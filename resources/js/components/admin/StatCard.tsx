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
        <CardHeader className="pb-2 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-olive font-light">
            <Icon className="w-4 h-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <div className="text-3xl font-bold text-olive">{value}</div>
          <p className="text-sm text-olive/70 mt-1">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
