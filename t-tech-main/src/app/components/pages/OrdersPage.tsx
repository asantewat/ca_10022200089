import React, { useEffect, useState } from 'react';
import { Order } from '../../../lib/types';
// TODO: Implement ordersAPI
// import { ordersAPI } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Package } from 'lucide-react';

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      // TODO: Implement orders API
      // const data = await ordersAPI.getMyOrders(user.id);
      // setOrders(data);
      setOrders([]);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-2">Order #{order.id}</CardTitle>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {/* TODO: Implement order items display */}
                    {(order.orderItems || []).map((product: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                        </div>
                        <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl text-blue-600">
                      ${order.totalPrice?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {/* Order Status Timeline */}
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            order.status === 'pending' || order.status === 'shipped' || order.status === 'delivered'
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`} />
                          <div className={`flex-1 h-1 ${
                            order.status === 'shipped' || order.status === 'delivered'
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`} />
                          <div className={`w-3 h-3 rounded-full ${
                            order.status === 'shipped' || order.status === 'delivered'
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`} />
                          <div className={`flex-1 h-1 ${
                            order.status === 'delivered'
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`} />
                          <div className={`w-3 h-3 rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-2">
                          <span>Order Placed</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
