import logger from '@/lib/logger';
import { notifyAdminOnError } from '@/lib/logger-alerts';
import { db } from '@/lib/db';
import { ok } from '@/lib/api/responses';

export async function GET(request: Request) {
  const jobName = 'check-portfolio';
  const startedAt = Date.now();
  const jobId = `${jobName}-${startedAt}`;

  try {
    if (process.env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn('Unauthorized cron access', { jobId, jobName });
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Cron job started', { jobId, jobName });
    const users = await db.user.findMany({ select: { id: true, riskLevel: true } });
    let created = 0;

    for (const user of users) {
      const investments = await db.investment.findMany({ where: { userId: user.id, status: 'ACTIVE' } });
      if (investments.length === 0) continue;

      const total = investments.reduce((sum, item) => sum + (item.currentValue ?? item.amount), 0);
      const allocation = investments.reduce<Record<string, number>>((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + (item.currentValue ?? item.amount);
        return acc;
      }, {});
      const equity = Object.entries(allocation).filter(([type]) => ['MUTUAL_FUND', 'STOCK', 'ELSS', 'NPS'].includes(type)).reduce((sum, [, value]) => sum + value, 0);
      const debt = Object.entries(allocation).filter(([type]) => ['FD', 'BOND', 'PPF', 'RD'].includes(type)).reduce((sum, [, value]) => sum + value, 0);
      const gold = Object.entries(allocation).filter(([type]) => ['SGB'].includes(type)).reduce((sum, [, value]) => sum + value, 0);
      const equityPct = total ? equity / total : 0;
      const debtPct = total ? debt / total : 0;
      const goldPct = total ? gold / total : 0;
      const target = user.riskLevel === 'AGGRESSIVE' ? { equity: 0.7, debt: 0.2, gold: 0.1 } : user.riskLevel === 'CONSERVATIVE' ? { equity: 0.3, debt: 0.6, gold: 0.1 } : { equity: 0.5, debt: 0.4, gold: 0.1 };
      const drift = Math.max(Math.abs(equityPct - target.equity), Math.abs(debtPct - target.debt), Math.abs(goldPct - target.gold));
      if (drift > 0.05) {
        await db.alert.create({ data: { userId: user.id, type: 'REBALANCE_NEEDED', title: 'Portfolio drift detected', message: 'Your portfolio allocation has drifted more than 5% from target.', data: JSON.stringify({ deepLink: '/investments', equityPct, debtPct, goldPct }) } });
        created++;
      }
    }

    const duration = Date.now() - startedAt;
    logger.info('Cron job completed', { jobId, jobName, duration, created, users: users.length });
    return ok({ checked: users.length, created, duration });
  } catch (error) {
    const duration = Date.now() - startedAt;
    logger.error('Cron job failed', { jobId, jobName, duration, error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
    await notifyAdminOnError({ jobName, jobId, error: error instanceof Error ? error.message : String(error), duration });
    return Response.json({ success: false, jobId, error: String(error) }, { status: 500 });
  }
}
