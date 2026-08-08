import logger from '@/lib/logger';
import { notifyAdminOnError } from '@/lib/logger-alerts';
import { db } from '@/lib/db';
import { createAlertIfNotExists } from '@/lib/alerts/engine';
import { ok } from '@/lib/api/responses';

export async function GET(request: Request) {
  const jobName = 'check-alerts';
  const startedAt = Date.now();
  const jobId = `${jobName}-${startedAt}`;

  try {
    if (process.env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn('Unauthorized cron access', { jobId, jobName });
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Cron job started', { jobId, jobName });
    const users = await db.user.findMany({ select: { id: true, occupation: true, age: true } });
    let created = 0;

    for (const user of users) {
      const [expenses, insurance, taxProfile, emergencyFund] = await Promise.all([
        db.expense.findMany({ where: { userId: user.id, isActive: true } }),
        db.insurance.findMany({ where: { userId: user.id } }),
        db.taxProfile.findUnique({ where: { userId: user.id } }),
        db.emergencyFund.findUnique({ where: { userId: user.id } }),
      ]);

      for (const expense of expenses.filter((item) => item.isEMI && (item.emiMonthsLeft ?? 0) <= 0)) {
        await createAlertIfNotExists({ userId: user.id, type: 'EMI_COMPLETED', title: `${expense.name} EMI completed`, message: 'This EMI is paid off now.', data: { deepLink: '/finances' } });
        created++;
      }

      for (const policy of insurance.filter((item) => item.nextDueDate)) {
        const due = policy.nextDueDate!.getTime();
        const daysLeft = Math.ceil((due - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysLeft === 30 || daysLeft === 7) {
          await createAlertIfNotExists({ userId: user.id, type: 'INSURANCE_PREMIUM_DUE', title: `${policy.type} renewal due soon`, message: `Your insurance premium is due in ${daysLeft} days.`, data: { deepLink: '/insurance' } });
          created++;
        }
      }

      if (taxProfile && taxProfile.remainingLimit80C < 30000 && new Date().getMonth() === 10) {
        await createAlertIfNotExists({ userId: user.id, type: 'TAX_SAVING_LIMIT', title: '80C limit nearly used', message: 'Your 80C balance is below Rs.30,000 and tax-saving season is here.', data: { deepLink: '/tax' } });
        created++;
      }

      if (emergencyFund) {
        if (emergencyFund.currentAmount >= emergencyFund.targetAmount * 0.5) {
          await createAlertIfNotExists({ userId: user.id, type: 'EMERGENCY_MILESTONE', title: 'Emergency fund halfway there', message: 'Your emergency fund crossed the 50% milestone.', data: { deepLink: '/emergency' } });
          created++;
        }
        if (emergencyFund.currentAmount >= emergencyFund.targetAmount) {
          await createAlertIfNotExists({ userId: user.id, type: 'EMERGENCY_FUNDED', title: 'Emergency fund complete', message: 'Your emergency fund is fully funded.', data: { deepLink: '/emergency' } });
          created++;
        }
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
