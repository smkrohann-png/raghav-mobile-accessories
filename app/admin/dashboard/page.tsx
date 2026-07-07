'use client';

import { useAuthStore } from '@/store/auth';
import { useAdminStore } from '@/store/admin';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Container from '@/components/ui/Container';

export default function AdminDashboardPage() {
  const { user, checkAuth } = useAuthStore();
  const { dashboard, fetchDashboard, isLoading } = useAdminStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

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
      fetchDashboard();
    }
  }, [mounted, user]);

  if (!mounted || !user || user.role !== 'admin') {
    return (
      <Container>
        <div className="py-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {user.firstName}!</p>

        {isLoading ? (
          <div className="text-center py-12">Loading dashboard...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Total Orders */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{dashboard?.totalOrders || 0}</p>
                <p className="text-xs text-gray-500 mt-2">All time</p>
              </div>

              {/* Total Revenue */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{dashboard?.totalRevenue || 0}</p>
                <p className="text-xs text-gray-500 mt-2">Completed orders</p>
              </div>

              {/* Pending Orders */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                <p className="text-gray-600 text-sm font-medium mb-2">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600">{dashboard?.pendingOrders || 0}</p>
                <p className="text-xs text-gray-500 mt-2">Awaiting processing</p>
              </div>

              {/* Completed Orders */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <p className="text-gray-600 text-sm font-medium mb-2">Completed Orders</p>
                <p className="text-3xl font-bold text-purple-600">{dashboard?.completedOrders || 0}</p>
                <p className="text-xs text-gray-500 mt-2">Delivered</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/admin/orders"
                  className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition text-center"
                >
                  <p className="font-semibold text-blue-600">View All Orders</p>
                  <p className="text-sm text-gray-600">Manage customer orders</p>
                </a>
                <a
                  href="/admin/users"
                  className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition text-center"
                >
                  <p className="font-semibold text-green-600">User Statistics</p>
                  <p className="text-sm text-gray-600">View user analytics</p>
                </a>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Order Value</span>
                  <span className="font-semibold">
                    ₹{dashboard?.totalOrders ? Math.round(dashboard.totalRevenue / dashboard.totalOrders) : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold">
                    {dashboard?.totalOrders
                      ? Math.round((dashboard.completedOrders / dashboard.totalOrders) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-semibold">{dashboard?.pendingOrders || 0}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
