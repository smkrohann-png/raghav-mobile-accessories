'use client';

import { useAuthStore } from '@/store/auth';
import { useAdminStore } from '@/store/admin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';

export default function AdminOrdersPage() {
  const { user, checkAuth } = useAuthStore();
  const { orders, fetchAllOrders, updateOrderStatus, shipOrderViaShiprocket, isLoading } = useAdminStore();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const selectedOrderObj = orders.find((o) => o.id === selectedOrder);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchAllOrders();
    }
  }, [fetchAllOrders, router, user]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const validStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'];
    if (validStatuses.includes(newStatus)) {
      await updateOrderStatus(orderId, newStatus);
      fetchAllOrders();
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <Container>
        <div className="py-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Container>
    );
  }

  const statusColors: { [key: string]: string } = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Packed: 'bg-indigo-100 text-indigo-800',
    Shipped: 'bg-purple-100 text-purple-800',
    "Out For Delivery": 'bg-orange-100 text-orange-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
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
                        <p className="font-medium">
  {order.customerName || order.customer}
</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">₹{order.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.products.length} items</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString()}
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
              <div className="bg-gray-50 border-t p-6 space-y-6">
                {/* Shiprocket booking action */}
                {selectedOrderObj && !selectedOrderObj.shiprocketAwbCode && ['Confirmed', 'Packed', 'Pending'].includes(selectedOrderObj.status) && (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <span>📦 Courier Booking Ready</span>
                        <span className="rounded bg-orange-100 text-orange-850 px-2.5 py-0.5 text-xs font-semibold">Shiprocket</span>
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Book courier dispatch and generate tracking ID (AWB) directly via Shiprocket.
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await shipOrderViaShiprocket(selectedOrder);
                          fetchAllOrders();
                          alert("Order shipped via Shiprocket!");
                        } catch (err: any) {
                          console.error("Booking error:", err);
                          alert("Error booking Shiprocket: " + (err.response?.data?.error || err.message || "Unknown error"));
                        }
                      }}
                      disabled={isLoading}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 text-white px-6 text-sm font-bold shadow-md transition disabled:opacity-50"
                    >
                      🚀 Ship via Shiprocket
                    </button>
                  </div>
                )}

                {selectedOrderObj?.shiprocketAwbCode && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/55 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <span>✅ Dispatched via Shiprocket</span>
                      </h4>
                      <p className="text-sm text-slate-600 mt-1 font-mono">
                        AWB: <strong className="text-slate-900">{selectedOrderObj.shiprocketAwbCode}</strong> · Shipment ID: {selectedOrderObj.shiprocketShipmentId}
                      </p>
                    </div>
                    <a
                      href={`https://shiprocket.co/tracking/${selectedOrderObj.shiprocketAwbCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-5 text-sm font-bold text-slate-800 transition"
                    >
                      Track Order ↗
                    </a>
                  </div>
                )}

                <div>
                  <h3 className="font-bold mb-4">Manual Status Update</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedOrder, status)}
                        className={`px-3 py-2 rounded text-sm font-medium transition ${
                          status === 'Cancelled'
                            ? 'bg-red-100 hover:bg-red-200 text-red-700'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
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
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </Container>
  );
}
