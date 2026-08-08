import { db } from '@/lib/db';
import { ok, requireUserId, validateJson } from '@/lib/api/responses';
import { z } from 'zod';

const reportSchema = z.object({ type: z.enum(['monthly-summary', 'annual-tax', 'portfolio-performance', 'net-worth-tracker']) });

export async function POST(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const body = await validateJson(request, reportSchema);
  const payload = { type: body.type, generatedAt: new Date().toISOString(), deepLink: '/reports' };
  await db.auditLog.create({ data: { userId: auth.userId, action: 'report_generated', entity: 'Report', metadata: JSON.stringify(payload) } });
  return ok(payload, 'Report generated');
}
