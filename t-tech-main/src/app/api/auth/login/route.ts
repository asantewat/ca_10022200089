import { NextRequest, NextResponse } from 'next/server';
import { createUserSession } from '../../../../lib/auth';
import { ApiResponse, AuthUser } from '../../../../lib/types';
import { dataStore, verifyPassword } from '../../../../lib/dataStore';

export async function POST(request: NextRequest) {
  try {
    // Ensure dataStore is initialized
    await dataStore.ensureInitialized();
    console.log('DataStore instance ID:', dataStore.getInstanceId());

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    // Find user by email (normalize email to lowercase)
    const normalizedEmail = email.toLowerCase().trim();
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', normalizedEmail);
    console.log('All users in store:', dataStore.getAllUserEmails());
    
    const existingUser = dataStore.getUserByEmail(normalizedEmail);
    
    if (!existingUser) {
      console.error('Login failed: User not found for email:', normalizedEmail);
      console.log('Available user emails:', dataStore.getAllUserEmails());
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid email or password',
      }, { status: 401 });
    }

    console.log('User found:', existingUser.email, 'Role:', existingUser.role);

    // Verify password
    console.log('Verifying password...');
    console.log('Password hash length:', existingUser.password?.length || 0);
    console.log('Password hash starts with:', existingUser.password?.substring(0, 10) || 'none');
    const isPasswordValid = await verifyPassword(password, existingUser.password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.error('Login failed: Invalid password for email:', normalizedEmail);
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid email or password',
      }, { status: 401 });
    }

    // Create session
    const sessionId = await createUserSession(existingUser.id);

    const authUser: AuthUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    console.log('Login successful for user:', authUser.email);

    // Create response with user data
    const response = NextResponse.json<ApiResponse<AuthUser>>({
      success: true,
      message: 'Login successful',
      data: authUser,
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}