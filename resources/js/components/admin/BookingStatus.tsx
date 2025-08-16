import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BookingStatusProps {
  completedReservations: number;
  cancelledReservations: number;
  totalReservations: number;
  variants: any;
}

const BookingStatus: React.FC<BookingStatusProps> = ({
  completedReservations,
  cancelledReservations,
  totalReservations,
  variants
}) => {
  // Debug: Log the values being received
  console.log('BookingStatus: Received props:', {
    completedReservations,
    cancelledReservations,
    totalReservations
  });
  
  // Calculate confirmed reservations (total - completed - cancelled)
  const confirmedReservations = totalReservations - completedReservations - cancelledReservations;
  
  console.log('BookingStatus: Calculated confirmedReservations:', confirmedReservations);

  // Donut chart data - using the same colors as reservation status badges
  const pieData = [
    { name: 'Completed', value: completedReservations, color: 'hsl(var(--secondary))' },
    { name: 'Confirmed', value: confirmedReservations, color: 'hsl(var(--primary))' },
    { name: 'Cancelled', value: cancelledReservations, color: 'hsl(var(--destructive))' },
  ].filter(item => item.value > 0);
  
  console.log('BookingStatus: Pie chart data:', pieData);

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalReservations > 0 ? ((data.value / totalReservations) * 100).toFixed(1) : '0';
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">{data.value} ({percentage}%)</p>
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
            <BarChart3 className="w-4 h-4" />
            Booking Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex items-center justify-center mb-4 relative flex-shrink-0">
            {totalReservations > 0 ? (
              <div className="w-48 h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-olive">{totalReservations}</div>
                  <div className="text-xs font-light tracking-tighter text-olive/70">Total Bookings</div>
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full">
                <div className="text-center">
                  <div className="text-2xl text-gray-400">No Data</div>
                  <div className="text-sm text-gray-400">No bookings yet</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="space-y-3 flex-1">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-olive/70">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium" style={{ color: item.color }}>
                    {item.value}
                  </span>
                  <span className="text-xs text-olive/50">
                    ({totalReservations > 0 ? ((item.value / totalReservations) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookingStatus;
