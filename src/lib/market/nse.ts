import { cached, CacheKey, TTL } from '@/lib/redis';

export type StockFundamentals = { symbol: string; price: number; pe: number; roe: number; debtToEquity: number; salesGrowth: number; profitGrowth: number; score: number; note: string };

export async function fetchStockPrice(symbol: string) {
  return cached(CacheKey.stockPrice(symbol), async () => ({ symbol, price: mockFundamentals(symbol).price, updatedAt: new Date().toISOString() }), TTL.STOCK_PRICE);
}

export async function fetchFundamentals(symbol: string): Promise<StockFundamentals> {
  // TODO: wire real NSE API, rate-limit 1req/sec.
  return cached(`fundamentals:${symbol}`, async () => mockFundamentals(symbol), TTL.STOCK_PRICE);
}

function mockFundamentals(symbol: string): StockFundamentals {
  const rows: Record<string, StockFundamentals> = {
    RELIANCE: { symbol, price: 2860, pe: 27.4, roe: 9.1, debtToEquity: 0.36, salesGrowth: 8.2, profitGrowth: 7.4, score: 79, note: 'Quality large-cap watchlist candidate' },
    HDFCBANK: { symbol, price: 1688, pe: 19.2, roe: 15.8, debtToEquity: 0, salesGrowth: 14.1, profitGrowth: 16.3, score: 82, note: 'Core banking exposure candidate' },
    INFY: { symbol, price: 1510, pe: 23.8, roe: 29.6, debtToEquity: 0.08, salesGrowth: 6.7, profitGrowth: 5.2, score: 76, note: 'Export earnings and dividend profile' },
  };
  return rows[symbol.toUpperCase()] || { symbol, price: 1000, pe: 22, roe: 15, debtToEquity: 0.2, salesGrowth: 8, profitGrowth: 8, score: 70, note: 'Mock data until NSE integration is enabled' };
}
