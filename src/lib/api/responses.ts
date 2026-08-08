import { NextResponse } from 'next/server';
import { ZodError, type ZodSchema } from 'zod';
import { requireAuth } from '@/lib/auth';

type AuthResult = { userId: string; user: { id?: string | null; plan?: 'FREE' | 'PRO' | 'ELITE' | null } } | { error: NextResponse };

export async function requireUserId(): Promise<AuthResult> {
  try {
    const user = await requireAuth();
    if (!user.id) return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) };
    return { userId: user.id, user };
  } catch {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) };
  }
}

export function ok<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function fail(error: unknown, status = 400) {
  const message = error instanceof ZodError ? error.issues.map((issue) => issue.message).join(', ') : error instanceof Error ? error.message : String(error);
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function validateJson<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  const payload = await request.json().catch(() => ({}));
  return schema.parse(payload);
}

export async function readJson<T>(request: Request): Promise<T> {
  return request.json().catch(() => ({} as T));
}

export function isCronAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return request.headers.get('authorization') === `Bearer ${secret}`;
}
