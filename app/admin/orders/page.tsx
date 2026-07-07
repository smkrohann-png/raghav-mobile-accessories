'use client';

import { useAuthStore } from '@/store/auth';
import { useAdminStore } from '@/store/admin';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';

export default function AdminOrdersPage() {
  const { user, checkAuth } = useAuthStore();
  const { orders, fetchAllOrders, updateOrderStatus, isLoading } = useAdminStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  useEffect(() => {
    if (mounted && user) {
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchAllOrders();
    }
  }, [mounted, user]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (validStatuses.includes(newStatus)) {
      await updateOrderStatus(orderId, newStatus);
      fetchAllOrders();
    }
  };

  if (!mounted || !user || user.role !== 'admin') {
    return (
      <Container>
        <div className="py-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Container>
    );
  }

  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-4xl font-bold mb-2">Orders Management</h1>
        <p className="text-gray-600 mb-8">Manage all customer orders</p>

        {isLoading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : orders && orders.length > 0 ? (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{order.id}</td>
                      <td className="px-6 py-4 text-sm">
                        <p className="font-medium">{order.userId}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">₹{order.totalPrice}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.items.length} items</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          {selectedOrder === order.id ? 'Close' : 'Edit'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status Update Section */}
            {selectedOrder && (
              <div className="bg-gray-50 border-t p-6">
                <h3 className="font-bold mb-4">Update Order Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder, status)}
                      className={`px-3 py-2 rounded text-sm font-medium transition ${
                        status === 'cancelled'
                          ? 'bg-red-100 hover:bg-red-200 text-red-700'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No orders found</p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <a href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </Container>
  );
}
