import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const cardData = [
  { label: 'Card 1' },
  { label: 'Card 2' },
  { label: 'Card 3' },
  { label: 'Card 4' },
];

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col items-center px-12 py-10">
        <p className="text-olive text-7xl font-thin font-lexend text-center">ADMIN</p>
        <div className="w-50 h-[1px] bg-olive mt-6" style={{ opacity: 0.5 }} />
      </div>
      <div className="px-12 flex gap-6 mb-8">
        {cardData.map((card, idx) => (
          <div
            key={card.label}
            className={
              'flex-1 min-h-0 border-2 border-primary-light bg-primary-light text-primary p-8 font-lexend font-light text-xl transition-all duration-300 cursor-pointer shadow-card hover:scale-[1.03] flex flex-col items-center justify-center'
            }
            style={{ minWidth: 0 }}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-center font-light text-xl whitespace-pre-line">
                TESTING<br />EMPTY DATA
              </span>
              <span className="mt-4 text-4xl font-bold tracking-wide">24</span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
