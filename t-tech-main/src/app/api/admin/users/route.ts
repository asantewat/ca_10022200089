import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { dataStore } from '../../../../lib/dataStore';
import { ApiResponse, User } from '../../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Admin access required',
      }, { status: 403 });
    }

    // Get all users from data store
    const allUsers = dataStore.getAllUsers();

    // Remove password from response for security
    const usersWithoutPasswords = allUsers.map(({ password, ...user }) => ({
      ...user,
      password: undefined, // Explicitly remove password
    }));

    return NextResponse.json<ApiResponse<{
      users: Omit<User, 'password'>[];
      total: number;
    }>>({
      success: true,
      data: {
        users: usersWithoutPasswords,
        total: usersWithoutPasswords.length,
      },
    });

  } catch (error) {
    console.error('Admin get users error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

