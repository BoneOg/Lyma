export interface Reservation {
  id: number;
  guest_first_name: string;
  guest_last_name: string;
  reservation_date: string;
  time_slot: string | null;
  reserved_time?: string | null;
  reserved_label?: string | null;
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
}

export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  formatted_time: string;
  start_time_formatted: string;
  end_time_formatted: string;
}

export interface SystemSettings {
  max_advance_booking_days: number;
} 