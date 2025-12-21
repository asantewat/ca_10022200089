import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../../lib/dataStore';
import { createUserSession } from '../../../../lib/auth';
import { ApiResponse, AuthUser } from '../../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Name, email and password are required',
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid email format',
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Password must be at least 6 characters long',
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = dataStore.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User already exists with this email',
      }, { status: 409 });
    }

    // Create new user
    const user = await dataStore.createUser({ name, email, password });

    // Create session for the new user
    await createUserSession(user.id);

    // Return user data without password
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json<ApiResponse<AuthUser>>({
      success: true,
      message: 'User created successfully',
      data: authUser,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}