import { NextRequest, NextResponse } from 'next/server';
import { authenticate, createUserSession } from '../../../../lib/auth';
import { ApiResponse, AuthUser } from '../../../../lib/types';
import { verifyPassword } from '../../../../lib/dataStore';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    // Authenticate user
    const user = await authenticate(email, password);
    
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid credentials',
      }, { status: 401 });
    }

    // Check password
    if (!user.password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid credentials',
      }, { status: 401 });
    }
    
    const isPasswordValid = await verifyPassword(password, user.password);
    
    // Create session
    await createUserSession(user.id);

    return NextResponse.json<ApiResponse<AuthUser>>({
      success: true,
      message: 'Login successful',
      data: user,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}