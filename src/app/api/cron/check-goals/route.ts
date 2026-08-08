import logger from '@/lib/logger';
import { notifyAdminOnError } from '@/lib/logger-alerts';
import { db } from '@/lib/db';
import { createAlertIfNotExists } from '@/lib/alerts/engine';
import { ok } from '@/lib/api/responses';

export async function GET(request: Request) {
  const jobName = 'check-goals';
  const startedAt = Date.now();
  const jobId = `${jobName}-${startedAt}`;

  try {
    if (process.env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn('Unauthorized cron access', { jobId, jobName });
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Cron job started', { jobId, jobName });
    const goals = await db.goal.findMany({ where: { status: 'ACTIVE' } });
    let completed = 0;
    let atRisk = 0;

    for (const goal of goals) {
      const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
      const monthsLeft = Math.max(1, Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
      const expectedProgress = Math.min(1, Math.max(0, 1 - monthsLeft / 120));
      if (goal.currentAmount >= goal.targetAmount) {
        await db.goal.update({ where: { id: goal.id }, data: { status: 'COMPLETED', completedAt: new Date() } });
        await createAlertIfNotExists({ userId: goal.userId, type: 'GOAL_COMPLETED', title: `${goal.name} completed`, message: 'Your goal reached the target amount.', data: { deepLink: `/goals/${goal.id}` } });
        completed++;
      } else if (progress < expectedProgress - 0.2) {
        await createAlertIfNotExists({ userId: goal.userId, type: 'GOAL_AT_RISK', title: `${goal.name} is behind`, message: 'Your goal is trailing the expected pace by more than 20%.', data: { deepLink: `/goals/${goal.id}` } });
        atRisk++;
      }
    }

    const duration = Date.now() - startedAt;
    logger.info('Cron job completed', { jobId, jobName, duration, checked: goals.length, completed, atRisk });
    return ok({ checked: goals.length, completed, atRisk, duration });
  } catch (error) {
    const duration = Date.now() - startedAt;
    logger.error('Cron job failed', { jobId, jobName, duration, error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
    await notifyAdminOnError({ jobName, jobId, error: error instanceof Error ? error.message : String(error), duration });
    return Response.json({ success: false, jobId, error: String(error) }, { status: 500 });
  }
}
