import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await AuthService.login(body);

    if (result.success) {
      const response = NextResponse.json({
        success: true,
        admin: result.admin,
        token: result.token,
      });

      response.cookies.set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 1 day in seconds
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: result.error || 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
