import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { encrypt, decrypt } from './encryption';

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

// Function to get current user from encrypted cookie - now properly async
export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    // Properly await the cookies storage
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('authUser');
    
    if (!authCookie?.value) return null;
    
    // Decrypt the cookie value to get the user data
    const decrypted = decrypt(authCookie.value);
    const userData = JSON.parse(decrypted) as UserPayload;
    
    return userData;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// Create user session cookie
export const createUserSession = (user: UserPayload) => {
  const data = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  
  const encrypted = encrypt(data);
  
  // Set cookie options - updated for Netlify compatibility
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none' as const, // Changed from 'lax' to 'none' for cross-domain
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };
  
  // Serialize cookie for HTTP header
  return serialize('authUser', encrypted, cookieOptions);
};

// Clear user session
export const clearUserSession = () => {
  return serialize('authUser', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none' as const, // Changed from 'lax' to 'none' for cross-domain
    maxAge: -1,
    path: '/',
  });
};

// Updated middleware to protect routes that require authentication
export const requireAuth = (handler: Function) => {
  return async (request: Request) => {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return handler(request, user);
  };
};

// Updated middleware to protect admin routes
export const requireAdmin = (handler: Function) => {
  return async (request: Request) => {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    return handler(request, user);
  };
};
