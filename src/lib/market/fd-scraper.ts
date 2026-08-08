import { cached, CacheKey, TTL } from '@/lib/redis';

export type FDRate = { bank: string; rate: number; tenure: string; seniorCitizenRate: number };

export async function fetchFDRates(): Promise<FDRate[]> {
  return cached(CacheKey.fdRates(), async () => [
    { bank: 'SBI', rate: 6.8, seniorCitizenRate: 7.3, tenure: '1-2 years' },
    { bank: 'HDFC Bank', rate: 7.1, seniorCitizenRate: 7.6, tenure: '18-21 months' },
    { bank: 'ICICI Bank', rate: 7.0, seniorCitizenRate: 7.5, tenure: '15-18 months' },
    { bank: 'Axis Bank', rate: 7.1, seniorCitizenRate: 7.6, tenure: '17-18 months' },
    { bank: 'Kotak Mahindra Bank', rate: 7.2, seniorCitizenRate: 7.7, tenure: '390 days' },
    { bank: 'PNB', rate: 6.75, seniorCitizenRate: 7.25, tenure: '1-2 years' },
    { bank: 'Bank of Baroda', rate: 6.85, seniorCitizenRate: 7.35, tenure: '399 days' },
    { bank: 'Canara Bank', rate: 6.9, seniorCitizenRate: 7.4, tenure: '444 days' },
    { bank: 'Union Bank', rate: 6.8, seniorCitizenRate: 7.3, tenure: '1-2 years' },
    { bank: 'IDFC First Bank', rate: 7.5, seniorCitizenRate: 8.0, tenure: '500 days' },
  ], TTL.FD_RATES);
}
