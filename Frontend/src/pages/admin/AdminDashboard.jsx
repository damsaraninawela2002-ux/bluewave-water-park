import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import DashboardHeader from '../../components/admin/dashboard/DashboardHeader';
import DashboardStats from '../../components/admin/dashboard/DashboardStats';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';
import StatusDonut from '../../components/admin/dashboard/StatusDonut';
import TopTicketsCard from '../../components/admin/dashboard/TopTicketsCard';
import RecentBookingsCard from '../../components/admin/dashboard/RecentBookingsCard';
import UpcomingVisitsCard from '../../components/admin/dashboard/UpcomingVisitsCard';
import RecentReviewsCard from '../../components/admin/dashboard/RecentReviewsCard';
import RecentMessagesCard from '../../components/admin/dashboard/RecentMessagesCard';
import QuickOverviewCards from '../../components/admin/dashboard/QuickOverviewCards';
import DashboardSkeleton from '../../components/admin/dashboard/DashboardSkeleton';
import DashboardError from '../../components/admin/dashboard/DashboardError';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    }
    setError(null);

    try {
      const data = await adminService.getDashboardData();
      setDashboardData(data);
      if (isManualRefresh) {
        toast.success('Park telemetry updated successfully', {
          id: 'dashboard-refresh',
          duration: 2500,
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      const errMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Could not synchronize with park telemetry database.';
      setError(errMsg);
      if (isManualRefresh) {
        toast.error('Failed to refresh metrics');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(false);
  }, [fetchDashboard]);

  // Loading state (initial page load)
  if (loading && !dashboardData) {
    return <DashboardSkeleton />;
  }

  // Fatal error state (no data available)
  if (error && !dashboardData) {
    return <DashboardError error={error} onRetry={() => fetchDashboard(false)} />;
  }

  const {
    totals = {},
    bookingStatusCounts = {},
    revenueByDay = [],
    topTickets = [],
    recentBookings = [],
    upcomingVisits = [],
    recentReviews = [],
    recentMessages = [],
    quickOverview = {},
  } = dashboardData || {};

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Header with Admin Greeting, Quick Actions, and Live Refresh */}
      <DashboardHeader
        onRefresh={() => fetchDashboard(true)}
        refreshing={refreshing}
      />

      {/* 2. 8 Animated Count-Up Stat Cards */}
      <DashboardStats
        totals={totals}
        bookingStatusCounts={bookingStatusCounts}
      />

      {/* 3. Operational Quick Overview Mini Metrics */}
      <QuickOverviewCards quickOverview={quickOverview} />

      {/* 4. Telemetry Charts Row: 14-day Area/Line Chart (8 cols) & Booking Donut (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <RevenueChart data={revenueByDay} />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <StatusDonut counts={bookingStatusCounts} />
        </div>
      </div>

      {/* 5. Bookings & Ticket Tier Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <RecentBookingsCard
            recentBookings={recentBookings}
            onStatusUpdated={() => fetchDashboard(false)}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <TopTicketsCard topTickets={topTickets} />
        </div>
      </div>

      {/* 6. Guest Activity & Communications Row (Upcoming Visits, Reviews, Inquiries) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <UpcomingVisitsCard upcomingVisits={upcomingVisits} />
        <RecentReviewsCard recentReviews={recentReviews} />
        <RecentMessagesCard recentMessages={recentMessages} />
      </div>
    </div>
  );
}
