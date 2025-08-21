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
        <CardHeader className="pb-2 flex-shrink-0 px-3 sm:px-4 md:px-4 lg:px-6 xl:px-6 2xl:px-6 pt-3 sm:pt-4 md:pt-4 lg:pt-6 xl:pt-6 2xl:pt-6">
          <CardTitle className="flex items-center gap-2 text-olive font-light text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-base">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-4 2xl:h-4" />
            Reservation Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col px-3 sm:px-4 md:px-4 lg:px-6 xl:px-6 2xl:px-6 pb-3 sm:pb-4 md:pb-4 lg:pb-6 xl:pb-6 2xl:pb-6">
          <div className="flex items-center justify-center mb-4 relative flex-shrink-0">
            {totalReservations > 0 ? (
              <div className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-56 xl:h-56 2xl:w-56 2xl:h-56 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
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
                  <div className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-4xl font-bold text-olive">{totalReservations}</div>
                  <div className="text-center">
                    <div className="text-xs font-light tracking-tighter text-olive">Total</div>
                    <div className="text-xs font-light tracking-tighter text-olive">Reservations</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-56 xl:h-56 2xl:w-56 2xl:h-56 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full">
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl text-gray-400">No Data</div>
                  <div className="text-xs text-gray-400">No bookings yet</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="space-y-2 sm:space-y-2 md:space-y-3 lg:space-y-3 xl:space-y-3 2xl:space-y-3 flex-1">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-3 2xl:gap-3">
                  <div 
                    className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-4 2xl:h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-olive/70">{item.name}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1 md:gap-2 lg:gap-2 xl:gap-2 2xl:gap-2">
                  <span className="font-medium text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm" style={{ color: item.color }}>
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
