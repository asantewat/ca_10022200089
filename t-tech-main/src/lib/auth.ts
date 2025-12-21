import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { dataStore, verifyPassword } from './dataStore';
import { AuthUser, User } from './types';

const SESSION_COOKIE_NAME = 'session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

// Get current user from session cookie
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionId) {
      return null;
    }

    const session = dataStore.getSession(sessionId);
    if (!session) {
      return null;
    }

    const user = dataStore.getUserById(session.userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Authenticate user login
export async function authenticate(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = dataStore.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

// Create user session and set cookie
export async function createUserSession(userId: string): Promise<string> {
  const session = dataStore.createSession(userId);
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session.id, COOKIE_OPTIONS);
  
  return session.id;
}

// Delete user session and clear cookie
export async function deleteUserSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (sessionId) {
    dataStore.deleteSession(sessionId);
  }
  
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Require admin role
export async function requireAdmin(): Promise<AuthUser | null> {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'admin') {
    return null;
  }
  
  return user;
}

// Middleware helper to check authentication
export function withAuth(handler: (req: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (req: NextRequest) => {
    try {
      const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
      
      if (!sessionId) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const session = dataStore.getSession(sessionId);
      if (!session) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }

      const user = dataStore.getUserById(session.userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
      }

      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return handler(req, authUser);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
    }
  };
}

// Middleware helper to require admin
export function withAdmin(handler: (req: NextRequest, user: AuthUser) => Promise<Response>) {
  return withAuth(async (req: NextRequest, user: AuthUser) => {
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    return handler(req, user);
  });
}

// Clean up expired sessions periodically
setInterval(() => {
  dataStore.cleanupExpiredSessions();
}, 60 * 60 * 1000); // Run every hour