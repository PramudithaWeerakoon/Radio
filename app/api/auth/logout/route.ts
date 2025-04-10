import { NextResponse } from 'next/server';
import { clearUserSession } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
  
  // Clear the main session cookie
  response.headers.set('Set-Cookie', clearUserSession());
  
  // Also clear the admin token cookie
  const adminCookieClear = 'admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
  
  // Append the admin cookie clearing to existing cookies
  const existingCookies = response.headers.get('Set-Cookie');
  if (existingCookies) {
    response.headers.set('Set-Cookie', [existingCookies, adminCookieClear].join(', '));
  } else {
    response.headers.set('Set-Cookie', adminCookieClear);
  }
  
  return response;
}
