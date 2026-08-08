import { checkDatabaseHealth } from '@/lib/db';
import { redis } from '@/lib/redis';
import { ok } from '@/lib/api/responses';

export async function GET() {
  const database = await checkDatabaseHealth();
  let redisHealth: { status: 'healthy' | 'unhealthy'; latency: number };
  const start = Date.now();
  try {
    await redis.ping();
    redisHealth = { status: 'healthy', latency: Date.now() - start };
  } catch {
    redisHealth = { status: 'unhealthy', latency: Date.now() - start };
  }
  return ok({ status: database.status === 'healthy' && redisHealth.status === 'healthy' ? 'ok' : 'degraded', database, redis: redisHealth, time: new Date().toISOString() });
}
