import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout';

interface Transaction {
  id: number;
  firstName: string;
  lastName: string;
  referenceNumber: string;
  amount: number;
  receiptNumber: string;
  paymentMethod: string;
  mayaPaymentId: string;
  status: string;
  paymentStatus: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

const Transactions: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  // Hardcoded sample data
  const transactions: Transaction[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      referenceNumber: 'RES_001_ABC123',
      amount: 500.00,
      receiptNumber: 'RCPT_2025_001',
      paymentMethod: 'Credit Card',
      mayaPaymentId: 'MAYA_PAY_001234567',
      status: 'completed',
      paymentStatus: 'paid',
      currency: 'PHP',
      createdAt: '2025-01-15 14:30:00',
      updatedAt: '2025-01-15 14:35:00'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      referenceNumber: 'RES_002_DEF456',
      amount: 750.00,
      receiptNumber: 'RCPT_2025_002',
      paymentMethod: 'Debit Card',
      mayaPaymentId: 'MAYA_PAY_002345678',
      status: 'completed',
      paymentStatus: 'paid',
      currency: 'PHP',
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="px-12 py-10">
          <p className="text-olive text-4xl font-bold font-lexend">TRANSACTIONS</p>
        </div>

        {/* White Container */}
        <div className="px-12">
          <div className="bg-white rounded-4xl shadow-lg p-8">
            {/* Table */}
            <table className="w-full text-left font-lexend">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-3 font-regular">First Name</th>
                  <th className="py-3 px-3 font-regular">Last Name</th>
                  <th className="py-3 px-3 font-regular">Reference Number</th>
                  <th className="py-3 px-3 font-regular">Amount</th>
                  <th className="py-3 px-3 font-regular">Receipt Number</th>
                  <th className="py-3 px-3 font-regular">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <tr
                      className={`cursor-pointer hover:bg-yellow-50 transition ${expanded === transaction.id ? 'bg-yellow-50' : ''}`}
                      onClick={() => handleExpand(transaction.id)}
                    >
                      <td className="py-6 px-3 font-light">{transaction.firstName}</td>
                      <td className="py-6 px-3 font-light">{transaction.lastName}</td>
                      <td className="py-6 px-3 font-light">{transaction.referenceNumber}</td>
                      <td className="py-6 px-3 font-light">{formatCurrency(transaction.amount)}</td>
                      <td className="py-6 px-3 font-light">{transaction.receiptNumber}</td>
                      <td className="py-6 px-3 font-light">{transaction.paymentMethod}</td>
                    </tr>
                    {expanded === transaction.id && (
                      <tr className="bg-yellow-50">
                        <td colSpan={6} className="py-3 px-3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-[#3f411a] font-light">
                            <div><b>Maya Payment ID:</b> {transaction.mayaPaymentId}</div>
                            <div><b>Status:</b> <span className="capitalize">{transaction.status}</span></div>
                            <div><b>Payment Status:</b> <span className="capitalize">{transaction.paymentStatus}</span></div>
                            <div><b>Currency:</b> {transaction.currency}</div>
                            <div><b>Created At:</b> {formatDate(transaction.createdAt)}</div>
                            <div><b>Updated At:</b> {formatDate(transaction.updatedAt)}</div>
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