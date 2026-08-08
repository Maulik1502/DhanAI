import { db } from '@/lib/db';
import { fail, ok, readJson, requireUserId } from '@/lib/api/responses';

export async function GET() {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;

  const user = await db.user.findUnique({ where: { id: auth.userId } });
  return ok(user);
}

export async function PATCH(request: Request) {
  const auth = await requireUserId();
  if ('error' in auth) return auth.error;

  try {
    const body = await readJson<Record<string, unknown>>(request);
    
    let dobDate: Date | undefined = undefined;
    let computedAge: number | undefined = undefined;

    if (typeof body.dateOfBirth === 'string' && body.dateOfBirth.trim()) {
      const parsed = new Date(body.dateOfBirth);
      if (!isNaN(parsed.getTime())) {
        dobDate = parsed;
        const diffMs = Date.now() - parsed.getTime();
        const ageDate = new Date(diffMs);
        computedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      }
    } else if (typeof body.age === 'number') {
      computedAge = body.age;
    }

    const user = await db.user.update({
      where: { id: auth.userId },
      data: {
        name: typeof body.name === 'string' ? body.name : undefined,
        occupation: typeof body.occupation === 'string' ? body.occupation : undefined,
        dateOfBirth: dobDate,
        age: computedAge,
        dependents: typeof body.dependents === 'number' ? body.dependents : undefined,
        riskLevel: typeof body.riskLevel === 'string' ? (body.riskLevel as never) : undefined,
        taxRegime: typeof body.taxRegime === 'string' ? (body.taxRegime as never) : undefined,
        onboarded: typeof body.onboarded === 'boolean' ? body.onboarded : undefined,
      },
    });
    return ok(user, 'Profile updated');
  } catch (error) {
    return fail(error);
  }
}
