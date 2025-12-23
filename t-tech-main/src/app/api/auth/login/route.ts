import { NextRequest, NextResponse } from 'next/server';
import { createUserSession } from '../../../../lib/auth';
import { ApiResponse, AuthUser } from '../../../../lib/types';
import { dataStore, verifyPassword } from '../../../../lib/dataStore';

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

    // Find user by email
    const existingUser = dataStore.getUserByEmail(email);
    if (!existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid credentials',
      }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, existingUser.password);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid credentials',
      }, { status: 401 });
    }

    // Create session
    await createUserSession(existingUser.id);

    const authUser: AuthUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    return NextResponse.json<ApiResponse<AuthUser>>({
      success: true,
      message: 'Login successful',
      data: authUser,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}