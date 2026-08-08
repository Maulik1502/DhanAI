import { PrismaClient } from '@prisma/client';

declare global { var __prisma: PrismaClient | undefined; }

function buildDatabaseUrl(): string {
  const baseUrl = process.env.DATABASE_URL;
  if (!baseUrl) throw new Error('DATABASE_URL is not set');
  const provider = process.env.DATABASE_PROVIDER || 'postgresql';
  const poolMax = process.env.DATABASE_POOL_MAX || '10';
  if (provider === 'postgresql') {
    try {
      const url = new URL(baseUrl);
      url.searchParams.set('connection_limit', poolMax);
      url.searchParams.set('pool_timeout', '20');
      return url.toString();
    } catch { return baseUrl; }
  }
  if (provider === 'mysql') {
    try {
      const url = new URL(baseUrl);
      url.searchParams.set('connection_limit', poolMax);
      return url.toString();
    } catch { return baseUrl; }
  }
  return baseUrl;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: { db: { url: buildDatabaseUrl() } },
    errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
  });
}

export const db = globalThis.__prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.__prisma = db;

export async function checkDatabaseHealth() {
  const provider = process.env.DATABASE_PROVIDER || 'postgresql';
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return { status: 'healthy' as const, provider, latency: Date.now() - start };
  } catch {
    return { status: 'unhealthy' as const, provider, latency: Date.now() - start };
  }
}

declare global { var __prismaRead: PrismaClient | undefined; }
const readUrl = process.env.DATABASE_URL_READ;
const readClient = readUrl ? new PrismaClient({ datasources: { db: { url: readUrl } }, log: ['error'] }) : null;
export const dbRead = globalThis.__prismaRead ?? readClient ?? db;
if (process.env.NODE_ENV !== 'production' && readClient) globalThis.__prismaRead = readClient;

process.on('beforeExit', async () => {
  await db.$disconnect();
  if (dbRead !== db) await (dbRead as PrismaClient).$disconnect();
});

