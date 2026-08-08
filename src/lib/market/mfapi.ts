import { cached, CacheKey, TTL } from '@/lib/redis';

export type MFNav = { schemeCode: string; schemeName: string; nav: number; date: string };
export type TopFund = { code: string; name: string; category: string; nav: number; returns3Y: number; score: number };

export async function fetchMFNav(schemeCode: string): Promise<MFNav> {
  return cached(CacheKey.mfNav(schemeCode), async () => {
    const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}/latest`, { next: { revalidate: TTL.MF_NAV } });
    if (!response.ok) throw new Error('Unable to fetch mutual fund NAV');
    const payload = await response.json() as { meta?: { scheme_name?: string }; data?: Array<{ nav?: string; date?: string }> };
    return { schemeCode, schemeName: payload.meta?.scheme_name || schemeCode, nav: Number(payload.data?.[0]?.nav || 0), date: payload.data?.[0]?.date || new Date().toISOString() };
  }, TTL.MF_NAV);
}

export async function fetchTopFunds(category: string): Promise<TopFund[]> {
  return cached(CacheKey.mfTopFunds(category), async () => [
    { code: '120503', name: 'Nifty 50 Index Fund', category, nav: 218.42, returns3Y: 14.2, score: 86 },
    { code: '118825', name: 'Liquid Fund Direct', category: 'Liquid Debt', nav: 1012.66, returns3Y: 6.5, score: 78 },
    { code: '125497', name: 'Flexi Cap Fund', category: 'Flexi Cap', nav: 76.31, returns3Y: 17.1, score: 81 },
  ], TTL.MF_NAV);
}
