import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

export const SESSION_COOKIE_NAME = 'egx_session_token';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, reqDetails?: { ip?: string; userAgent?: string }) {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await prisma.session.create({
    data: {
      sessionToken: token,
      userId,
      expiresAt,
      ipAddress: reqDetails?.ip || null,
      userAgent: reqDetails?.userAgent || null,
    },
  });

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return session;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user || user.status !== 'ACTIVE') {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  await createSession(user.id);
  return user;
}

export async function getSessionUser(_req?: any) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
            department: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!session || new Date() > session.expiresAt || session.user.status !== 'ACTIVE') {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
}

export const getAuthenticatedUser = getSessionUser;
export const getCurrentUser = getSessionUser;

export async function destroySession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await prisma.session.deleteMany({
        where: { sessionToken: token },
      });
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error('Session destruction error:', error);
  }
}

export const logoutUser = destroySession;
