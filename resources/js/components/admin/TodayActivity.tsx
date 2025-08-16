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
        <CardHeader className="pb-2 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-olive font-light">
            <Activity className="w-4 h-4" />
            Today's Activity & Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="space-y-6 flex-1">
            
            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 p-4 rounded-lg border border-white/50">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-4 h-4 text-olive" />
                  <span className="text-2xl font-bold text-olive">{todayReservations}</span>
                </div>
                <div className="text-sm text-olive/70 mb-1">Today's Bookings</div>
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
              
              <div className="bg-white/60 p-4 rounded-lg border border-white/50">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-4 h-4 text-olive" />
                  <span className="text-2xl font-bold text-olive">{averagePartySize}</span>
                </div>
                <div className="text-sm text-olive/70 mb-1">Avg Party Size</div>
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
                <span className="text-sm font-medium text-olive/70">Popular Time Slots</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-olive" />
                  <span className="text-sm font-medium text-olive">{popularTimeSlot} peak</span>
                </div>
              </div>
              {timeSlotData.length > 0 ? (
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSlotData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis 
                        dataKey="time" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
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
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">No time slot data</div>
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
