import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { ApiResponse, AuthUser } from '../../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Not authenticated',
      }, { status: 401 });
    }

    return NextResponse.json<ApiResponse<AuthUser>>({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}