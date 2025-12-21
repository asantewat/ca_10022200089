import React, { useEffect, useState } from 'react';
import { productsAPI } from '../../../../lib/api';
// TODO: Implement ordersAPI and usersAPI
// import { ordersAPI, usersAPI } from '../../../../lib/api';
import { useAuth } from '../../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { token, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAdmin && token) {
      loadStats();
    } else {
      onNavigate('home');
    }
  }, [isAdmin, token]);

  const loadStats = async () => {
    if (!token) return;

    try {
      // TODO: Implement orders and users API
      const products = await productsAPI.getAll();
      // const [products, orders, users] = await Promise.all([
      //   productsAPI.getAll(),
      //   ordersAPI.getAll(token),
      //   usersAPI.getAll(token),
      // ]);

      // const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalProducts: products.length,
        totalOrders: 0, // orders.length,
        totalUsers: 0, // users.length,
        totalRevenue: 0, // revenue,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) return null;

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to your T-Tech & Appliances admin panel</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => onNavigate('admin-products')}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <Package className="w-8 h-8 text-blue-600 mb-2" />
                    <h3 className="font-semibold mb-1">Manage Products</h3>
                    <p className="text-sm text-gray-600">Create, edit, or delete products</p>
                  </button>
                  <button
                    onClick={() => onNavigate('admin-orders')}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
                  >
                    <ShoppingCart className="w-8 h-8 text-green-600 mb-2" />
                    <h3 className="font-semibold mb-1">Manage Orders</h3>
                    <p className="text-sm text-gray-600">View and update order status</p>
                  </button>
                  <button
                    onClick={() => onNavigate('home')}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
                  >
                    <Users className="w-8 h-8 text-purple-600 mb-2" />
                    <h3 className="font-semibold mb-1">View Store</h3>
                    <p className="text-sm text-gray-600">Go to customer view</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
