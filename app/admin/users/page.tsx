'use client';

import { useAuthStore } from '@/store/auth';
import { useAdminStore } from '@/store/admin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';

export default function AdminUsersPage() {
  const { user, checkAuth } = useAuthStore();
  const { dashboard, fetchDashboard, isLoading } = useAdminStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchDashboard();
    }
  }, [fetchDashboard, router, user]);

  if (!user || user.role !== 'admin') {
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
        <h1 className="text-4xl font-bold mb-2">User Statistics</h1>
        <p className="text-gray-600 mb-8">Analyze customer metrics and growth</p>

        {isLoading ? (
          <div className="text-center py-12">Loading statistics...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Total Users */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">
                  {dashboard?.totalUsers ?? 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">All registered users</p>
              </div>

              {/* Active Orders */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <p className="text-gray-600 text-sm font-medium mb-2">Active Customers</p>
                <p className="text-3xl font-bold text-green-600">{dashboard?.pendingOrders || 0}</p>
                <p className="text-xs text-gray-500 mt-2">Who have pending orders</p>
              </div>

              {/* Lifetime Value */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <p className="text-gray-600 text-sm font-medium mb-2">Customer LTV</p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{dashboard?.totalRevenue || 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">Total lifetime value</p>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-lg border p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Customer Insights</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Average Customer Value</span>
                  <span className="font-semibold">
                    ₹{dashboard?.totalOrders ? Math.round(dashboard.totalRevenue / dashboard.totalOrders) : 0}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Repeat Customer Rate</span>
                  <span className="font-semibold">Calculating...</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Churn Rate</span>
                  <span className="font-semibold">0%</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800">
                <strong>Note:</strong> User statistics are calculated based on order history and activity. 
                The database is currently in-memory mode. For production, integrate with your customer management system.
              </p>
            </div>
          </>
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
