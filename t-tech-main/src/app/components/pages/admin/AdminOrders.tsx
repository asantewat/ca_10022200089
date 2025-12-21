import React, { useEffect, useState } from 'react';
import { Order } from '../../../../lib/types';
// TODO: Implement ordersAPI
// import { ordersAPI } from '../../../../lib/api';
import { useAuth } from '../../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { toast } from 'sonner';

interface AdminOrdersProps {
  onNavigate: (page: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ onNavigate }) => {
  const { token, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAdmin && token) {
      loadOrders();
    } else {
      onNavigate('home');
    }
  }, [isAdmin, token]);

  const loadOrders = async () => {
    if (!token) return;
    
    try {
      // TODO: Implement orders API
      // const data = await ordersAPI.getAll(token);
      // setOrders(data);
      setOrders([]);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: any) => {
    if (!token) return;

    try {
      // TODO: Implement order status update API
      // await ordersAPI.updateStatus(orderId, newStatus, token);
      console.log('TODO: Update order status', orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
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

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Manage Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-gray-500 text-lg">No orders yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">Order #{order.id}</CardTitle>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>
                          Placed: {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>User ID: {order.userId}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-3">Order Items:</h4>
                    <div className="space-y-2">
                      <p className="text-gray-500">Order items will be displayed here when orders API is implemented.</p>
                    </div>
                  </div>

                  {/* Total and Status Update */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg">
                        Total: <span className="text-blue-600">${order.totalPrice?.toFixed(2) || '0.00'}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Update Status:</span>
                      <Select
                        value={order.status}
                        onValueChange={(value: Order['status']) =>
                          handleUpdateStatus(order.id, value)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
