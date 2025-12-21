import { NextRequest, NextResponse } from 'next/server';
import { deleteUserSession } from '../../../../lib/auth';
import { ApiResponse } from '../../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    // Delete the session
    await deleteUserSession();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}