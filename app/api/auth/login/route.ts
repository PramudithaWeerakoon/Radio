import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { createUserSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Create session cookie
    const sessionCookie = createUserSession({
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role
    });
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin'
      }
    });
    
    // Set the main session cookie
    response.headers.set('Set-Cookie', sessionCookie);
    
    // For admin users, add a simple admin token cookie that's easy to check in middleware
    if (user.role === 'admin') {
      // Add a second cookie specifically for admin access
      const adminCookie = `admin_token=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`; // 7 days
      
      // Append the admin cookie to existing cookies
      const existingCookies = response.headers.get('Set-Cookie');
      if (existingCookies) {
        response.headers.set('Set-Cookie', [existingCookies, adminCookie].join(', '));
      } else {
        response.headers.set('Set-Cookie', adminCookie);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}
