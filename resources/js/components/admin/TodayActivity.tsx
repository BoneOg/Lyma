import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface TodayActivityProps {
  todayReservations: number;
  confirmedReservations: number;
  averagePartySize: number;
  popularTimeSlot: string;
  timeSlotData: Array<{ time: string; bookings: number }>;
  variants: any;
  trends?: {
    bookings_change: number;
    party_size_change: number;
  };
}

const TodayActivity: React.FC<TodayActivityProps> = ({
  todayReservations,
  confirmedReservations,
  averagePartySize,
  popularTimeSlot,
  timeSlotData,
  variants,
  trends
}) => {
  // Use real trend data from backend, fallback to calculated trends if not available
  const bookingsTrend = trends?.bookings_change ?? 0;
  const partySizeTrend = trends?.party_size_change ?? 0;

  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-olive">{payload[0].value} bookings</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div variants={variants} className="h-full">
      <Card className="border-gray-200 bg-gray-50 shadow-sm rounded-none h-full flex flex-col">
        <CardHeader className="pb-2 flex-shrink-0 px-3 sm:px-4 md:px-4 lg:px-6 xl:px-6 2xl:px-6 pt-3 sm:pt-4 md:pt-4 lg:pt-6 xl:pt-6 2xl:pt-6">
          <CardTitle className="flex items-center gap-2 text-olive font-light text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-base">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-4 2xl:h-4" />
            Today's Activity & Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col px-3 sm:px-4 md:px-4 lg:px-6 xl:px-6 2xl:px-6 pb-3 sm:pb-4 md:pb-4 lg:pb-6 xl:pb-6 2xl:pb-6">
          <div className="space-y-4 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-6 2xl:space-y-6 flex-1">
            
            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-4 2xl:gap-4">
              <div className="bg-white/60 p-3 sm:p-3 md:p-4 lg:p-4 xl:p-4 2xl:p-4 rounded-lg border border-white/50">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-4 2xl:h-4 text-olive" />
                  <span className="text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-bold text-olive">{todayReservations}</span>
                </div>
                <div className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-olive/70 mb-1">Today's Bookings</div>
                <div className="flex items-center gap-1 text-xs">
                  {bookingsTrend > 0 ? (
                    <TrendingUp className="w-3 h-3 text-olive" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-olive" />
                  )}
                  <span className="text-olive">
                    {Math.abs(bookingsTrend)} vs yesterday
                  </span>
                </div>
              </div>
              
              <div className="bg-white/60 p-3 sm:p-3 md:p-4 lg:p-4 xl:p-4 2xl:p-4 rounded-lg border border-white/50">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-4 2xl:h-4 text-olive" />
                  <span className="text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-bold text-olive">{averagePartySize}</span>
                </div>
                <div className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-olive/70 mb-1">Avg Party Size</div>
                <div className="flex items-center gap-1 text-xs">
                  {partySizeTrend > 0 ? (
                    <TrendingUp className="w-3 h-3 text-olive" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-olive" />
                  )}
                  <span className="text-olive">
                    {Math.abs(partySizeTrend).toFixed(1)} vs last week
                  </span>
                </div>
              </div>
            </div>
            
            {/* Popular Time Slots Bar Chart */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-medium text-olive/70">Popular Time Slots</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-olive" />
                  <span className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm font-medium text-olive">{popularTimeSlot} peak</span>
                </div>
              </div>
              {timeSlotData.length > 0 ? (
                <div className="h-24 sm:h-24 md:h-28 lg:h-32 xl:h-32 2xl:h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSlotData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis 
                        dataKey="time" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                      />
                      <YAxis hide />
                      <Tooltip content={<BarTooltip />} />
                      <Bar 
                        dataKey="bookings" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-24 sm:h-24 md:h-28 lg:h-32 xl:h-32 2xl:h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <div className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-gray-400">No time slot data</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TodayActivity;
