import React, { useState, useEffect } from 'react';
import { Clock, X, Plus } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const API_URL = '/admin/api/time-slots';

const AvailableTimeSlotsCard: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [editingSlot, setEditingSlot] = useState<{ id: number; field: 'start' | 'end' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string | null>(null);

  const { showNotification } = useNotification ? useNotification() : { showNotification: () => {} };

  // Fetch time slots from backend
  useEffect(() => {
    const fetchTimeSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTimeSlots(data.timeSlots || []);
      } catch (e) {
        setError('Failed to load time slots.');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeSlots();
  }, []);

  const handleTimeChange = (id: number, field: 'start' | 'end', value: string) => {
    setTimeSlots(prev => 
      prev.map(slot => 
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleTimeBlur = async () => {
    if (!editingSlot) return;
    setSavingId(editingSlot.id);
    setEditingSlot(null);
    setError(null);
    const slot = timeSlots.find(s => s.id === editingSlot.id);
    if (!slot) return;
    // Use inputValue for the edited field
    const newStart = editingSlot.field === 'start' ? (inputValue ?? slot.start_time) : slot.start_time;
    const newEnd = editingSlot.field === 'end' ? (inputValue ?? slot.end_time) : slot.end_time;
    try {
      const res = await fetch(`${API_URL}/${slot.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          start_time: newStart.slice(0,5),
          end_time: newEnd.slice(0,5),
        })
      });
      const data = await res.json();
      if (data.success && data.timeSlot) {
        setTimeSlots(prev => prev.map(s => s.id === slot.id ? data.timeSlot : s));
      } else {
        setError('Failed to update time slot.');
      }
    } catch (e) {
      setError('Failed to update time slot.');
    } finally {
      setSavingId(null);
      setInputValue(null);
    }
  };

  const handleTimeClick = (id: number, field: 'start' | 'end') => {
    setEditingSlot({ id, field });
    const slot = timeSlots.find(s => s.id === id);
    setInputValue(slot ? slot[field + '_time'] : '');
  };

  const removeTimeSlot = async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      const data = await res.json();
      if (data.success) {
        setTimeSlots(prev => prev.filter(slot => slot.id !== id));
        showNotification && showNotification('Time slot deleted successfully!', 'success');
      } else {
        setError('Failed to delete time slot.');
        showNotification && showNotification('Failed to delete time slot.', 'error');
      }
    } catch (e) {
      setError('Failed to delete time slot.');
      showNotification && showNotification('Failed to delete time slot.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const addTimeSlot = async () => {
    setAdding(true);
    setError(null);
    // Always use 08:00 to 20:00 as requested
    const start = '08:00';
    const end = '20:00';
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ start_time: start, end_time: end })
      });
      const data = await res.json();
      if (data.success && data.timeSlot) {
        setTimeSlots(prev => [...prev, data.timeSlot]);
        showNotification && showNotification('Time slot added successfully!', 'success');
      } else {
        setError('Failed to add time slot.');
        showNotification && showNotification('Failed to add time slot.', 'error');
      }
    } catch (e) {
      setError('Failed to add time slot.');
      showNotification && showNotification('Failed to add time slot.', 'error');
    } finally {
      setAdding(false);
    }
  };



  const convertTo12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1 sm:row-span-2 md:row-span-2 lg:row-span-2 xl:row-span-2 2xl:row-span-2 bg-white text-olive rounded p-3 sm:p-4 md:p-5 lg:p-6 xl:p-6 2xl:p-6 shadow-sm border-gray-300 border flex flex-col">
      <div className="flex items-center mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-gray-100/50 text-olive mr-3">
          <Clock size={20} />
        </span>
        <h3 className="text-base font-semibold font-lexend tracking-tighter">Available Time Slots</h3>
      </div>
      <div className="flex-1 space-y-2" style={{ maxHeight: 'calc(5 * 200px)', overflowY: 'auto' }}>
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : timeSlots.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No time slots available.</div>
        ) : (
          timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded p-2"
            >
              <div className="flex-1 min-w-0 flex items-center justify-center p-1 bg-white rounded border border-gray-200">
                {editingSlot?.id === slot.id && editingSlot?.field === 'start' ? (
                  <input
                    type="time"
                    value={inputValue ?? slot.start_time}
                    onChange={e => setInputValue(e.target.value)}
                    onBlur={handleTimeBlur}
                    onKeyDown={(e) => e.key === 'Enter' && handleTimeBlur()}
                    className="font-lexend font-light text-xs text-center bg-transparent border-none outline-none w-full"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="font-lexend font-light text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                    onClick={() => handleTimeClick(slot.id, 'start')}
                  >
                    {convertTo12Hour(slot.start_time)}
                    {savingId === slot.id && <span className="ml-1 text-xs text-gray-400 animate-pulse">Saving...</span>}
                  </span>
                )}
              </div>
              <span className="mx-1 text-gray-400">to</span>
              <div className="flex-1 min-w-0 flex items-center justify-center p-1 bg-white rounded border border-gray-200">
                {editingSlot?.id === slot.id && editingSlot?.field === 'end' ? (
                  <input
                    type="time"
                    value={inputValue ?? slot.end_time}
                    onChange={e => setInputValue(e.target.value)}
                    onBlur={handleTimeBlur}
                    onKeyDown={(e) => e.key === 'Enter' && handleTimeBlur()}
                    className="font-lexend font-light text-xs text-center bg-transparent border-none outline-none w-full"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="font-lexend font-light text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                    onClick={() => handleTimeClick(slot.id, 'end')}
                  >
                    {convertTo12Hour(slot.end_time)}
                    {savingId === slot.id && <span className="ml-1 text-xs text-gray-400 animate-pulse">Saving...</span>}
                  </span>
                )}
              </div>
              <button
                type="button"
                className={`flex items-center justify-center w-7 h-7 rounded hover:bg-red-200 text-red-500 ml-0.5 p-0 focus:outline-none ${deletingId === slot.id ? 'opacity-50 pointer-events-none' : ''}`}
                title="Remove time slot"
                onClick={() => removeTimeSlot(slot.id)}
                disabled={deletingId === slot.id}
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      <button
        type="button"
        className={`w-full flex items-center text-sm justify-center gap-2 p-2 border rounded focus:outline-none transition-colors duration-150 mt-2 border-gray-300 font-lexend font-light
          bg-gray-50 text-olive hover:bg-gray-200 hover:text-white cursor-pointer
          ${adding ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={addTimeSlot}
        disabled={adding}
      >
        <Plus size={14} /> {adding ? 'Adding...' : 'Add Time Slot'}
      </button>
    </div>
  );
};

export default AvailableTimeSlotsCard;