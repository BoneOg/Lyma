import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout';

interface Reservation {
  id: number;
  firstName: string;
  lastName: string;
  referenceNumber: string;
  guestCount: number;
  status: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

const Transactions: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  // Hardcoded sample data
  const reservations: Reservation[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      referenceNumber: 'RES_001_ABC123',
      guestCount: 4,
      status: 'confirmed',
      email: 'john.smith@email.com',
      phone: '+639123456789',
      createdAt: '2025-01-15 14:30:00',
      updatedAt: '2025-01-15 14:35:00'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      referenceNumber: 'RES_002_DEF456',
      guestCount: 2,
      status: 'confirmed',
      email: 'sarah.johnson@email.com',
      phone: '+639123456790',
      createdAt: '2025-01-16 10:15:00',
      updatedAt: '2025-01-16 10:20:00'
    }
  ];

  const handleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-lexend font-medium text-[#3f411a]">Reservation Management</h1>
          <p className="text-[#3f411a]/60 font-lexend font-light">View and manage all reservations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3f411a] text-white">
                <tr>
                  <th className="py-3 px-3 font-regular">Guest Name</th>
                  <th className="py-3 px-3 font-regular">Reference</th>
                  <th className="py-3 px-3 font-regular">Guests</th>
                  <th className="py-3 px-3 font-regular">Status</th>
                  <th className="py-3 px-3 font-regular">Date</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <React.Fragment key={reservation.id}>
                    <tr
                      className={`cursor-pointer hover:bg-yellow-50 transition ${expanded === reservation.id ? 'bg-yellow-50' : ''}`}
                      onClick={() => handleExpand(reservation.id)}
                    >
                      <td className="py-6 px-3 font-light">{reservation.firstName} {reservation.lastName}</td>
                      <td className="py-6 px-3 font-light">{reservation.referenceNumber}</td>
                      <td className="py-6 px-3 font-light">{reservation.guestCount}</td>
                      <td className="py-6 px-3 font-light">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="py-6 px-3 font-light">{formatDate(reservation.createdAt)}</td>
                    </tr>
                    {expanded === reservation.id && (
                      <tr className="bg-yellow-50">
                        <td colSpan={5} className="py-3 px-3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-[#3f411a] font-light">
                            <div><b>Email:</b> {reservation.email}</div>
                            <div><b>Phone:</b> {reservation.phone}</div>
                            <div><b>Status:</b> <span className="capitalize">{reservation.status}</span></div>
                            <div><b>Created At:</b> {formatDate(reservation.createdAt)}</div>
                            <div><b>Updated At:</b> {formatDate(reservation.updatedAt)}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Transactions; 