import { db } from '@/lib/db';
import { ok } from '@/lib/api/responses';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const marketData = await db.marketData.findMany({ where: type ? { type } : undefined, orderBy: { updatedAt: 'desc' } });
  return ok(marketData);
}
