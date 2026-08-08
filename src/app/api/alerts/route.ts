import { z } from 'zod';
import { db } from '@/lib/db';
import { fail, ok, requireUserId, validateJson } from '@/lib/api/responses';

const patchSchema = z.object({ id: z.string().optional(), markAllRead: z.boolean().default(false) });

export async function GET(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  const url = new URL(request.url);
  const unreadOnly = url.searchParams.get('unread') === 'true';
  const page = Math.max(1, Number(url.searchParams.get('page') || 1));
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') || 20)));
  const where = { userId: auth.userId, ...(unreadOnly ? { read: false } : {}) };
  const [alerts, total] = await Promise.all([
    db.alert.findMany({ where, orderBy: [{ read: 'asc' }, { createdAt: 'desc' }], skip: (page - 1) * pageSize, take: pageSize }),
    db.alert.count({ where }),
  ]);
  return ok({ alerts, page, pageSize, total, unread: await db.alert.count({ where: { userId: auth.userId, read: false } }) });
}

export async function PATCH(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;
  try {
    const body = await validateJson(request, patchSchema);
    if (body.markAllRead) {
      await db.alert.updateMany({ where: { userId: auth.userId }, data: { read: true } });
      return ok({ allRead: true });
    }
    if (!body.id) return fail('Alert id is required unless markAllRead is true', 400);
    const updated = await db.alert.updateMany({ where: { id: body.id, userId: auth.userId }, data: { read: true } });
    if (!updated.count) return fail('Alert not found', 404);
    return ok({ id: body.id });
  } catch (error) { return fail(error, 400); }
}
