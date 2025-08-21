import React, { useState, useEffect } from 'react';
import { motion, easeOut } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import BookingStatus from '@/components/admin/BookingStatus';
import TodayActivity from '@/components/admin/TodayActivity';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  TrendingUp
} from 'lucide-react';

interface DashboardStats {
  totalReservations: number;
  todayReservations: number;
  confirmedReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  averagePartySize: number;
  popularTimeSlot: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 0,
    todayReservations: 0,
    confirmedReservations: 0,
    completedReservations: 0,
    cancelledReservations: 0,
    averagePartySize: 0,
    popularTimeSlot: '6:00 PM'
  });

  const [timeSlotData, setTimeSlotData] = useState<Array<{ time: string; bookings: number }>>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [trends, setTrends] = useState<{
    bookings_change: number;
    party_size_change: number;
  }>({
    bookings_change: 0,
    party_size_change: 0
  });

  useEffect(() => {
    console.log('Dashboard component mounted, fetching data...');
    fetchDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      // Set refreshing state if not initial load
      if (lastUpdated) {
        setRefreshing(true);
      }
      
      // Fetch all dashboard data from the new consolidated API
      const dashboardResponse = await fetch('/admin/api/dashboard/stats');
      console.log('Dashboard response status:', dashboardResponse.status);
      
      if (!dashboardResponse.ok) {
        throw new Error(`HTTP error! status: ${dashboardResponse.status}`);
      }
      
      const dashboardData = await dashboardResponse.json();
      console.log('Dashboard data received:', dashboardData);
      
      if (!dashboardData.success) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = dashboardData.data;

      // Debug: Log the data structure
      console.log('Dashboard API data structure:', data);
      console.log('Today data:', data.today);
      console.log('Average party size from API:', data.today?.avg_party_size);
      console.log('Total reservations:', data.total_reservations);
      console.log('Today bookings:', data.today?.bookings);

      // Calculate average party size if not provided by API
      let calculatedAvgPartySize = data.today?.avg_party_size || 0;
      if (calculatedAvgPartySize === 0 && data.today?.reservations) {
        const totalGuests = data.today.reservations.reduce((sum: any, r: any) => 
          sum + (r.guest_count || 0), 0
        );
        calculatedAvgPartySize = data.today.reservations.length > 0 
          ? Math.round(totalGuests / data.today.reservations.length) 
          : 0;
        console.log('Calculated average party size:', calculatedAvgPartySize);
      }

      // Update stats with real data
      setStats({
        totalReservations: data.total_reservations || 0,
        todayReservations: data.today?.bookings || 0,
        confirmedReservations: data.confirmed_reservations || 0,
        completedReservations: data.completed_reservations || 0,
        cancelledReservations: data.cancelled_reservations || 0,
        averagePartySize: calculatedAvgPartySize,
        popularTimeSlot: data.time_slots?.[0]?.time || '6:00 PM'
      });

      // Update time slot data for charts
      setTimeSlotData(data.time_slots || []);

      // Update trends data
      setTrends({
        bookings_change: data.trends?.bookings_change || 0,
        party_size_change: data.trends?.party_size_change || 0
      });

      // Update last updated timestamp
      setLastUpdated(new Date());
      setError(null);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data. Please try again.');
      
      // Fallback to individual API calls if the consolidated endpoint fails
      try {
        console.log('Trying fallback data fetch...');
        await fetchFallbackData();
        setError(null);
      } catch (fallbackError) {
        console.error('Fallback data fetch also failed:', fallbackError);
        setError('Dashboard data is currently unavailable. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fallback function to fetch data from individual endpoints
  const fetchFallbackData = async () => {
    try {
      console.log('Fetching fallback data...');
      // Fetch reservation counts
      const countsResponse = await fetch('/admin/api/reservation-counts');
      const countsData = await countsResponse.json();
      
      // Fetch today's reservations
      const todayResponse = await fetch('/admin/api/reservations?status=all');
      const todayData = await todayResponse.json();
      
      const today = new Date().toISOString().split('T')[0];
      const todayReservations = todayData.reservations?.filter((r: any) => 
        r.reservation_date === today
      ).length || 0;

      // Fetch all reservations for popular time analysis and party size calculation
      const allReservationsResponse = await fetch('/admin/api/reservations?status=all&limit=1000');
      const allReservationsData = await allReservationsResponse.json();

      // Calculate average party size from all reservations (not just today)
      const allReservationsForPartySize = allReservationsData.reservations || [];
      const totalGuests = allReservationsForPartySize.reduce((sum: number, r: any) => 
        sum + (r.guest_count || 0), 0
      ) || 0;
      const avgPartySize = allReservationsForPartySize.length > 0 
        ? Math.round(totalGuests / allReservationsForPartySize.length) 
        : 0;

      // Calculate yesterday's bookings for trend comparison
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const yesterdayReservations = allReservationsData.reservations?.filter((r: any) => 
        r.reservation_date === yesterdayStr
      ).length || 0;

      // Calculate last week's average party size
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastWeekStr = lastWeek.toISOString().split('T')[0];
      const lastWeekReservations = allReservationsData.reservations?.filter((r: any) => 
        r.reservation_date >= lastWeekStr
      ) || [];
      
      const lastWeekTotalGuests = lastWeekReservations.reduce((sum: number, r: any) => 
        sum + (r.guest_count || 0), 0
      );
      const lastWeekAvgPartySize = lastWeekReservations.length > 0 
        ? Math.round(lastWeekTotalGuests / lastWeekReservations.length) 
        : 0;

      // Calculate popular time slot
      const timeSlotCounts: { [key: string]: number } = {};
      allReservationsData.reservations?.forEach((r: any) => {
        if (r.time_slot) {
          const time = r.time_slot;
          timeSlotCounts[time] = (timeSlotCounts[time] || 0) + 1;
        }
      });

      const popularTimeSlot = Object.entries(timeSlotCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || '6:00 PM';

      // Prepare time slot data for chart
      const timeSlotData = Object.entries(timeSlotCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([time, count]) => ({
          time: time.length > 5 ? time.substring(0, 5) : time,
          bookings: count
        }));

      setStats({
        totalReservations: countsData.all || 0,
        todayReservations,
        confirmedReservations: countsData.confirmed || 0,
        completedReservations: countsData.completed || 0,
        cancelledReservations: countsData.cancelled || 0,
        averagePartySize: avgPartySize,
        popularTimeSlot: popularTimeSlot
      });

      setTimeSlotData(timeSlotData);

      // Set trends data from fallback
      setTrends({
        bookings_change: todayReservations - yesterdayReservations,
        party_size_change: avgPartySize - lastWeekAvgPartySize
      });

    } catch (error) {
      console.error('Fallback data fetch failed:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: easeOut
      }
    },
    hover: {
      scale: 1.01,
      transition: {
        duration: 0.2
      }
    }
  };

  // Show loading for initial load
  if (loading) {
    console.log('AdminDashboard: Loading state, showing spinner...');
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-light border-t-transparent rounded-none"
          />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-12 py-6 sm:py-8 md:py-10 lg:py-10 xl:py-10 2xl:py-10 space-y-6 sm:space-y-6 md:space-y-8 lg:space-y-8 xl:space-y-8 2xl:space-y-8 font-lexend">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4 2xl:mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-6xl font-thin font-lexend text-olive">
              ADMIN DASHBOARD
            </h1>
          </div>
          <div className="w-20 sm:w-24 md:w-28 lg:w-32 xl:w-32 2xl:w-32 h-[1px] bg-olive mx-auto" style={{ opacity: 0.5 }} />
        </div>

        {/* Error Display */}
        {error && (
          <div 
            className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-4 py-3 rounded-none font-lexend"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-light">⚠️ {error}</span>
              <button 
                onClick={fetchDashboardData}
                className="text-red-600 hover:text-red-800 underline text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 2xl:gap-6 items-stretch">
          <StatCard
            icon={Users}
            title="Total Reservations"
            value={stats.totalReservations}
            subtitle="All time"
            variants={cardVariants}
          />
          <StatCard
            icon={Calendar}
            title="Today's Bookings"
            value={stats.todayReservations}
            subtitle="Reservations today"
            variants={cardVariants}
          />
          <StatCard
            icon={CheckCircle}
            title="Confirmed"
            value={stats.confirmedReservations}
            subtitle="Awaiting guests"
            variants={cardVariants}
          />
          <StatCard
            icon={TrendingUp}
            title="Avg Party Size"
            value={stats.averagePartySize}
            subtitle="Guests per table"
            variants={cardVariants}
          />
        </div>

        {/* Booking Status & Today's Activity - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 2xl:gap-6 items-stretch">
          <BookingStatus
            completedReservations={stats.completedReservations}
            cancelledReservations={stats.cancelledReservations}
            totalReservations={stats.totalReservations}
            variants={cardVariants}
          />
          <TodayActivity
            todayReservations={stats.todayReservations}
            confirmedReservations={stats.confirmedReservations}
            averagePartySize={stats.averagePartySize}
            popularTimeSlot={stats.popularTimeSlot}
            timeSlotData={timeSlotData}
            trends={trends}
            variants={cardVariants}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
