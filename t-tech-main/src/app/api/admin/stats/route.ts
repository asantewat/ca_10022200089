import { NextRequest, NextResponse } from 'next/server';
import { dataStore, formatCurrency } from '../../../../lib/dataStore';
import { getCurrentUser } from '../../../../lib/auth';
import { ApiResponse } from '../../../../lib/types';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: number;
  lowStockProducts: number;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Admin access required',
      }, { status: 403 });
    }

    // Calculate real stats from data store
    const allProducts = dataStore.getAllProducts();
    const allOrders = dataStore.getAllOrders();
    
    // Calculate total revenue from all orders
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Calculate recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = allOrders.filter(order => 
      order.createdAt >= thirtyDaysAgo
    ).length;

    // Calculate low stock products (less than 5 items)
    const lowStockProducts = allProducts.filter(product => 
      product.countInStock < 5
    ).length;

    // Estimate user count (in real app, you'd have user stats)
    // For now, count unique user IDs from orders plus admin
    const uniqueUserIds = new Set(allOrders.map(order => order.userId));
    uniqueUserIds.add('admin'); // Add admin user
    const totalUsers = uniqueUserIds.size;

    const stats: AdminStats = {
      totalProducts: allProducts.length,
      totalOrders: allOrders.length,
      totalUsers,
      totalRevenue,
      recentOrders,
      lowStockProducts,
    };

    return NextResponse.json<ApiResponse<AdminStats>>({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch stats',
    }, { status: 500 });
  }
}