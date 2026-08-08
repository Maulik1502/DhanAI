import logger from '@/lib/logger';
import { notifyAdminOnError } from '@/lib/logger-alerts';
import { db } from '@/lib/db';
import { isCronAuthorized, ok } from '@/lib/api/responses';
import { fetchFDRates } from '@/lib/market/fd-scraper';
import { fetchTopFunds } from '@/lib/market/mfapi';
import { fetchFundamentals } from '@/lib/market/nse';

export async function GET(request: Request) {
  const jobName = 'scan-market';
  const startedAt = Date.now();
  const jobId = `${jobName}-${startedAt}`;

  try {
    if (!isCronAuthorized(request)) {
      logger.warn('Unauthorized cron access', { jobId, jobName });
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Cron job started', { jobId, jobName });
    const symbols = ['RELIANCE', 'HDFCBANK', 'INFY', 'TCS', 'ICICIBANK'];
    const [funds, fdRates, stocks] = await Promise.all([fetchTopFunds('Core'), fetchFDRates(), Promise.all(symbols.map(fetchFundamentals))]);
    const rows = [
      ...funds.map((item) => ({ type: 'MF', code: item.code, name: item.name, data: JSON.stringify(item) })),
      ...fdRates.map((item) => ({ type: 'FD', code: item.bank, name: item.bank, data: JSON.stringify(item) })),
      ...stocks.map((item) => ({ type: 'STOCK', code: item.symbol, name: item.symbol, data: JSON.stringify(item) })),
    ];

    for (const row of rows) {
      await db.marketData.upsert({ where: { type_code: { type: row.type, code: row.code } }, create: row, update: { name: row.name, data: row.data } });
    }

    const duration = Date.now() - startedAt;
    logger.info('Cron job completed', { jobId, jobName, duration, count: rows.length });
    return ok({ upserted: rows.length, duration, funds, fdRates, stocks });
  } catch (error) {
    const duration = Date.now() - startedAt;
    logger.error('Cron job failed', { jobId, jobName, duration, error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
    await notifyAdminOnError({ jobName, jobId, error: error instanceof Error ? error.message : String(error), duration });
    return Response.json({ success: false, jobId, error: String(error) }, { status: 500 });
  }
}
