import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle: string;
  variants: any;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, variants }) => {
  return (
    <motion.div variants={variants} whileHover="hover" className="h-full">
      <Card className="border-gray-200 bg-gray-50 shadow-sm rounded-none h-full flex flex-col">
        <CardHeader className="pb-2 flex-shrink-0 px-3 sm:px-4 md:px-4 lg:px-6 xl:px-6 2xl:px-6 pt-3 sm:pt-4 md:pt-4 lg:pt-6 xl:pt-6 2xl:pt-6">
          <CardTitle className="flex items-center gap-2 text-olive font-light text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-base">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-4 2xl:h-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center px-3 sm:px-4 md:px-4 lg:px-6 xl:px-6 2xl:px-6 pb-3 sm:pb-4 md:pb-4 lg:pb-6 xl:pb-6 2xl:pb-6">
          <div className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-3xl font-bold text-olive">{value}</div>
          <p className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-olive/70 mt-1">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
