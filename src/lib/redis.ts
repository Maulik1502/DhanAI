import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const TTL = {
  USER_CONTEXT: 300, DASHBOARD: 900, MARKET_SNAPSHOT: 900,
  STOCK_PRICE: 900, MF_NAV: 14400, FD_RATES: 604800,
  BOND_YIELDS: 86400, NEWS: 7200, AI_SUGGESTION: 3600, RATE_LIMIT: 86400,
};

export const CacheKey = {
  userContext: (uid: string) => 'ctx:' + uid,
  dashboard:   (uid: string) => 'dash:' + uid,
  marketSnapshot: () => 'market:snapshot',
  mfNav:       (code: string) => 'mf:' + code,
  mfTopFunds:  (cat: string)  => 'mf:top:' + cat,
  fdRates:     () => 'fd:rates',
  bondYields:  () => 'bond:yields',
  stockPrice:  (sym: string)  => 'stock:' + sym,
  news:        () => 'news:market',
  aiSuggestion:(uid: string, type: string) => 'ai:' + uid + ':' + type,
  rateLimit:   (uid: string, action: string) => 'rl:' + uid + ':' + action,
};

export async function cached<T>(key: string, fetcher: () => Promise<T>, ttl: number): Promise<T> {
  try { const hit = await redis.get<T>(key); if (hit !== null) return hit; } catch {}
  const fresh = await fetcher();
  try { await redis.setex(key, ttl, JSON.stringify(fresh)); } catch {}
  return fresh;
}

export async function invalidateUser(userId: string): Promise<void> {
  await Promise.allSettled([redis.del(CacheKey.userContext(userId)), redis.del(CacheKey.dashboard(userId))]);
}

export async function checkRateLimit(userId: string, action: string, limit: number, windowSeconds = 86400) {
  const key = CacheKey.rateLimit(userId, action);
  try {
    const current = await redis.incr(key);
    if (current === 1) await redis.expire(key, windowSeconds);
    const ttl = await redis.ttl(key);
    return { allowed: current <= limit, remaining: Math.max(0, limit - current), resetAt: Date.now() + ttl * 1000 };
  } catch {
    return { allowed: true, remaining: limit, resetAt: Date.now() + windowSeconds * 1000 };
  }
}

const AI_LIMITS = { FREE: 5, PRO: 100, ELITE: 999999 } as const;
export async function checkAILimit(userId: string, plan: 'FREE' | 'PRO' | 'ELITE') {
  return checkRateLimit(userId, 'ai_call', AI_LIMITS[plan]);
}

