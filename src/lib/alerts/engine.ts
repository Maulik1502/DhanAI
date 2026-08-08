import { db } from '@/lib/db';

type AlertInput = {
  userId: string;
  type: 'GOAL_COMPLETED' | 'GOAL_AT_RISK' | 'TAX_SAVING_LIMIT' | 'ADVANCE_TAX_DUE' | 'FINANCIAL_YEAR_END' | 'REBALANCE_NEEDED' | 'EMERGENCY_MILESTONE' | 'EMERGENCY_FUNDED' | 'INSURANCE_PREMIUM_DUE' | 'INSURANCE_SUGGESTED' | 'CORPUS_MILESTONE' | 'EMI_COMPLETED';
  title: string;
  message: string;
  data?: Record<string, unknown>;
};

export async function createAlertIfNotExists(input: AlertInput) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await db.alert.findFirst({
    where: { userId: input.userId, type: input.type, read: false, createdAt: { gte: since } },
  });
  if (existing) return existing;

  return db.alert.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      data: JSON.stringify({ deepLink: '/', ...(input.data || {}) }),
    },
  });
}

export const createAlert = createAlertIfNotExists;

export async function generateUserAlerts(userId: string) {
  const [emergencyFund, taxProfile] = await Promise.all([
    db.emergencyFund.findUnique({ where: { userId } }),
    db.taxProfile.findUnique({ where: { userId } }),
  ]);

  const created = [];
  if (emergencyFund && emergencyFund.currentAmount >= emergencyFund.targetAmount) {
    created.push(await createAlertIfNotExists({
      userId,
      type: 'EMERGENCY_FUNDED',
      title: 'Emergency fund complete',
      message: 'Your emergency fund target is fully covered. Keep it liquid and separate from investments.',
      data: { deepLink: '/emergency' },
    }));
  } else if (emergencyFund && emergencyFund.currentAmount >= emergencyFund.targetAmount * 0.5) {
    created.push(await createAlertIfNotExists({
      userId,
      type: 'EMERGENCY_MILESTONE',
      title: 'Emergency fund halfway there',
      message: 'Nice progress — your emergency fund has crossed the 50% milestone.',
      data: { deepLink: '/emergency' },
    }));
  }

  if (taxProfile && taxProfile.remainingLimit80C < 30000) {
    created.push(await createAlertIfNotExists({
      userId,
      type: 'TAX_SAVING_LIMIT',
      title: '80C limit nearly used',
      message: 'Your 80C remaining limit is below Rs.30,000. Avoid over-investing only for tax benefit.',
      data: { deepLink: '/tax' },
    }));
  }

  return created;
}
