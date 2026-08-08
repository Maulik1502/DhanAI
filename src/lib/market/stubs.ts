export type MutualFundRow = { code: string; name: string; category: string; nav: number; returns3Y: number; score: number };
export type StockRow = { symbol: string; name: string; sector: string; price: number; score: number; note: string };
export type RateRow = { provider: string; product: string; rate: number; tenure: string };

export async function getMutualFundSnapshot(): Promise<MutualFundRow[]> {
  return [
    { code: '120503', name: 'Nifty 50 Index Fund', category: 'Large Cap Index', nav: 218.42, returns3Y: 14.2, score: 86 },
    { code: '118825', name: 'Liquid Fund Direct', category: 'Liquid Debt', nav: 1012.66, returns3Y: 6.5, score: 78 },
    { code: '125497', name: 'Flexi Cap Fund', category: 'Flexi Cap', nav: 76.31, returns3Y: 17.1, score: 81 },
  ];
}

export async function getStockSnapshot(): Promise<StockRow[]> {
  return [
    { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', price: 2860, score: 79, note: 'Quality large-cap watchlist candidate' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', price: 1688, score: 82, note: 'Core banking exposure candidate' },
    { symbol: 'INFY', name: 'Infosys', sector: 'IT', price: 1510, score: 76, note: 'Export earnings and dividend profile' },
  ];
}

export async function getFixedIncomeSnapshot(): Promise<RateRow[]> {
  return [
    { provider: 'SBI', product: 'FD', rate: 6.8, tenure: '1-2 years' },
    { provider: 'Post Office', product: 'PPF', rate: 7.1, tenure: '15 years' },
    { provider: 'RBI', product: 'SGB', rate: 2.5, tenure: '8 years + gold price' },
  ];
}


