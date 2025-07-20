import React from 'react';
import { Check, X } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const statusColors: Record<string, string> = {
  confirmed: 'bg-[hsl(var(--primary))] text-white border-none ',
  completed: 'bg-[hsl(var(--secondary))] text-black border-none',
  cancelled: 'bg-[hsl(var(--destructive))] text-white border-none',
  all: 'bg-yellow-100 text-yellow-900 border-yellow-400',
};

export interface ReservationTableRowProps {
  reservation: {
    id: number;
    guest_first_name: string;
    guest_last_name: string;
    reservation_date: string;
    time_slot: string | null;
    guest_count: number;
    status: string;
    email: string;
    phone: string;
    special_requests?: string;
    created_at: string;
    updated_at: string;
    special_hours_data?: {
      special_start: string;
      special_end: string;
    };
  };
  expanded: boolean;
  onExpand: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

const ReservationTableRow: React.FC<ReservationTableRowProps> = ({ reservation, expanded, onExpand, onComplete, onCancel }) => (
  <>
    <tr
      className={`cursor-pointer font-lexendd hover:bg-gray-100 transition ${expanded ? 'bg-gray-100' : ''}${expanded ? '' : ' border-b border-gray-200'}`}
      onClick={onExpand}
    >
      <td className="py-5 px-5 font-regular text-olive truncate align-top " style={{ wordBreak: 'break-word' }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default">
              {reservation.guest_first_name}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{reservation.guest_first_name}</p>
          </TooltipContent>
        </Tooltip>
      </td>
      <td className="py-5 px-2 font-regular truncate align-top text-olive" style={{ wordBreak: 'break-word' }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default">
              {reservation.guest_last_name}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{reservation.guest_last_name}</p>
          </TooltipContent>
        </Tooltip>
      </td>
      <td className="py-5 px-2 font-regular text-olive truncate align-top text-center" style={{ wordBreak: 'break-word' }}>{formatDate(reservation.reservation_date)}</td>
      <td className="py-5 px-1 font-regular text-olive truncate align-top text-center" style={{ wordBreak: 'break-word' }}>
        {reservation.special_hours_data 
          ? 'Special Hours'
          : reservation.time_slot || '-'
        }
      </td>
      <td className="py-5 px-1 font-regular text-olive truncate align-top text-center" style={{ wordBreak: 'break-word' }}>{reservation.guest_count}</td>
      <td className="py-4 px-1 text-center align-top">
        <span
          className={`inline-flex items-center justify-center border text-xs font-extralight capitalize tracking-wider ${statusColors[reservation.status] || 'bg-gray-200 text-gray-700 border-gray-300'}`}
          style={{ width: '100px', height: '32px', borderRadius: '16px', fontWeight: 400 }}
        >
          {reservation.status}
        </span>
      </td>
      <td className="py-4 px-1 text-center align-top" style={{ minWidth: '70px' }}>
        <div style={{ minHeight: '34px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {reservation.status !== 'completed' && reservation.status !== 'cancelled' && (
            <div className="flex gap-2 justify-center">
              <button
                className="group h-10 w-10 flex items-center justify-center rounded bg-transparent border-none hover:bg-green-200 focus-visible:bg-green-100 transition-colors"
                title="Complete"
                style={{ lineHeight: 0 }}
                onClick={e => { e.stopPropagation(); onComplete(); }}
              >
                <Check className="w-8 h-8 text-green-600 group-hover:text-green-800 group-focus-visible:text-green-800 transition-colors" />
              </button>
              <button
                className="group h-10 w-10 flex items-center justify-center rounded bg-transparent border-none hover:bg-red-200 focus-visible:bg-red-100 transition-colors"
                title="Cancel"
                style={{ lineHeight: 0 }}
                onClick={e => { e.stopPropagation(); onCancel(); }}
              >
                <X className="w-8 h-8 text-red-600 group-hover:text-red-800 group-focus-visible:text-red-800 transition-colors" />
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
    {expanded && (
      <tr className="bg-gray-100 border-b border-gray-200">
        <td colSpan={7} className="py-3 px-3">
          <div className="flex flex-col gap-2 text-sm text-[#3f411a] font-light">
          {reservation.special_requests && (
              <div><b>Special Requests:</b> {reservation.special_requests}</div>
            )}
            <div><b>Email:</b> {reservation.email}</div>
            <div><b>Phone:</b> {reservation.phone}</div>
            <div><b>Created At:</b> {formatDate(reservation.created_at)}</div>
            <div><b>Updated At:</b> {formatDate(reservation.updated_at)}</div>
          </div>
        </td>
      </tr>
    )}
  </>
);

export default ReservationTableRow; 