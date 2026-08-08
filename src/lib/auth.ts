import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Adapter, AdapterUser } from 'next-auth/adapters';
import { authConfig } from '@/lib/auth.config';
import { db } from '@/lib/db';
import { isAdminEmail } from '@/lib/config/admin';

const baseAdapter = PrismaAdapter(db) as Adapter;

function toAdapterUser(user: {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
}): AdapterUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.avatar,
    emailVerified: null,
  };
}

const adapter: Adapter = {
  ...baseAdapter,
  async createUser(user) {
    const created = await db.user.create({
      data: {
        email: user.email,
        name: user.name,
        avatar: user.image,
      },
      select: { id: true, email: true, name: true, avatar: true },
    });
    return toAdapterUser(created);
  },
  async updateUser(user) {
    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        email: user.email ?? undefined,
        name: user.name,
        avatar: user.image,
      },
      select: { id: true, email: true, name: true, avatar: true },
    });
    return toAdapterUser(updated);
  },
  async getUser(id) {
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, avatar: true },
    });
    return user ? toAdapterUser(user) : null;
  },
  async getUserByEmail(email) {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, avatar: true },
    });
    return user ? toAdapterUser(user) : null;
  },
  async getUserByAccount(providerAccountId) {
    const account = await db.account.findUnique({
      where: {
        provider_providerAccountId: providerAccountId,
      },
      include: {
        user: { select: { id: true, email: true, name: true, avatar: true } },
      },
    });
    return account?.user ? toAdapterUser(account.user) : null;
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter,
  events: {
    async createUser({ user }) {
      if (!user.id) return;
      await Promise.allSettled([
        db.taxProfile.create({ data: { userId: user.id, regime: 'NEW', financialYear: '2025-26' } }),
        db.corpus.create({ data: { userId: user.id, targetAmount: 10000000, expectedReturn: 11, timelineYears: 20, projections: '{}', allocation: '{}' } }),
      ]);
    },
  },
});

export async function getCurrentUser() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (userId) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, avatar: true, plan: true, onboarded: true, riskLevel: true, taxRegime: true, occupation: true, dateOfBirth: true, age: true, dependents: true },
      }).catch(() => null);

      if (user) {
        const isAdmin = isAdminEmail(user.email);
        return { ...user, role: isAdmin ? ('ADMIN' as const) : ('USER' as const), isAdmin };
      }

      const email = session?.user?.email || 'demo@dhanai.com';
      const isAdmin = isAdminEmail(email);

      return {
        id: userId,
        name: session?.user?.name || 'Investor',
        email,
        avatar: session?.user?.image || null,
        plan: 'PRO' as const,
        role: isAdmin ? ('ADMIN' as const) : ('USER' as const),
        isAdmin,
        onboarded: true,
        riskLevel: 'MODERATE' as const,
        taxRegime: 'NEW' as const,
        occupation: 'Salaried Professional',
        dateOfBirth: new Date('1998-05-15'),
        age: 28,
        dependents: 1,
      };
    }
  } catch (err) {
    console.warn('Auth session check error:', err);
  }

  // Development / local preview fallback
  if (process.env.NODE_ENV === 'development') {
    const email = 'demo@dhanai.com';
    const isAdmin = isAdminEmail(email);
    return {
      id: 'demo-user-id',
      name: 'Demo Investor',
      email,
      avatar: null,
      plan: 'PRO' as const,
      role: isAdmin ? ('ADMIN' as const) : ('USER' as const),
      isAdmin,
      onboarded: true,
      riskLevel: 'MODERATE' as const,
      taxRegime: 'NEW' as const,
      occupation: 'Software Engineer',
      dateOfBirth: new Date('1998-05-15'),
      age: 28,
      dependents: 1,
    };
  }

  return null;
}

export async function requireAuth() {
  try {
    const session = await auth();
    if (session?.user?.id) {
      return session.user;
    }
  } catch (err) {
    console.warn('requireAuth error:', err);
  }

  if (process.env.NODE_ENV === 'development') {
    return {
      id: 'demo-user-id',
      name: 'Demo Investor',
      email: 'demo@dhanai.com',
    };
  }

  throw new Error('UNAUTHORIZED');
}

