import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../../lib/dataStore';
import { getCurrentUser } from '../../../../lib/auth';
import { ApiResponse, Order } from '../../../../lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const { id: orderId } = await params;
    const order = dataStore.getOrderById(orderId);

    if (!order) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Order not found',
      }, { status: 404 });
    }

    // Check if user can access this order
    if (user.role !== 'admin' && order.userId !== user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Access denied',
      }, { status: 403 });
    }

    return NextResponse.json<ApiResponse<Order>>({
      success: true,
      data: order,
    });

  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Admin access required',
      }, { status: 403 });
    }

    const { id: orderId } = await params;
    const updates = await request.json();

    const order = dataStore.getOrderById(orderId);
    if (!order) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Order not found',
      }, { status: 404 });
    }

    // Handle payment status update
    if (updates.isPaid && !order.isPaid) {
      updates.paidAt = new Date();
    }

    // Handle delivery status update
    if (updates.isDelivered && !order.isDelivered) {
      updates.deliveredAt = new Date();
      updates.status = 'delivered';
    }

    const updatedOrder = dataStore.updateOrder(orderId, updates);

    if (!updatedOrder) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to update order',
      }, { status: 500 });
    }

    return NextResponse.json<ApiResponse<Order>>({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder,
    });

  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}