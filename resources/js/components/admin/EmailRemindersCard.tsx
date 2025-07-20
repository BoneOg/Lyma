import React from 'react';
import { Bell } from 'lucide-react';

const EmailRemindersCard: React.FC = () => (
  <div className="col-span-1 row-span-1 bg-white text-olive rounded p-6 shadow-sm border-gray-300 border">
    <div className="flex items-center mb-3">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100/50 text-olive mr-3">
        <Bell size={20} />
      </span>
      <h3 className="text-base font-semibold font-lexend tracking-tighter">Email Reminders</h3>
    </div>
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-lexend font-medium mb-1">First Reminder</label>
        <select className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light focus:outline-none text-sm">
          <option>24h before</option>
          <option>48h before</option>
          <option>72h before</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-lexend font-medium mb-1">Final Reminder</label>
        <select className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-50 text-olive font-lexend font-light focus:outline-none text-sm">
          <option>2h before</option>
          <option>4h before</option>
          <option>6h before</option>
        </select>
      </div>
    </div>
  </div>
);

export default EmailRemindersCard; 