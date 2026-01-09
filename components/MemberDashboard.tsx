
import React from 'react';
import { User, Committee, PaymentStatus } from '../types';
import { BellIcon } from './Icons';

interface MemberDashboardProps {
  user: User;
  committees: Committee[];
  onLogout: () => void;
  onNavigate: (view: 'history' | 'profile') => void;
}

const getReminderStatus = (dueDate: number): { status: 'none' | 'reminder' | 'urgent', message: string } => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueDateThisMonth = new Date(currentYear, currentMonth, dueDate);
    const daysRemaining = (dueDateThisMonth.getTime() - today.getTime()) / (1000 * 3600 * 24);

    if (daysRemaining > 0 && daysRemaining <= 2) {
        return { status: 'urgent', message: `Payment due in ${Math.ceil(daysRemaining)} day(s)!` };
    }
    if (daysRemaining > 2 && daysRemaining <= 5) {
        return { status: 'reminder', message: `Payment due in ${Math.ceil(daysRemaining)} days.` };
    }
    return { status: 'none', message: '' };
}

const PaymentStatusIndicator: React.FC<{ status?: PaymentStatus, reminder: ReturnType<typeof getReminderStatus> }> = ({ status, reminder }) => {
    switch (status) {
        case PaymentStatus.Paid:
            return <span className="px-3 py-1 text-sm font-bold text-green-800 bg-green-100 rounded-full">Paid</span>;
        case PaymentStatus.Late:
            return <span className="px-3 py-1 text-sm font-bold text-yellow-800 bg-yellow-100 rounded-full">Late</span>;
        case PaymentStatus.Pending:
        default:
            return (
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-sm font-bold text-red-800 bg-red-100 rounded-full">Pending</span>
                    {reminder.status !== 'none' && (
                        <div title={reminder.message}>
                            <BellIcon status={reminder.status} />
                        </div>
                    )}
                </div>
            );
    }
};

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, committees, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Member Dashboard</h1>
      
      <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">My Committees</h2>
          <button onClick={() => onNavigate('history')} className="text-sm font-semibold text-teal-600 hover:underline">
              View Full History
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {committees.map(committee => {
            const myDetails = committee.members.find(m => m.userId === user.id);
            const currentMonth = committee.drawHistory.length + 1;
            const myPayment = myDetails?.paymentHistory.find(p => p.month === currentMonth);
            const reminder = getReminderStatus(committee.paymentDueDate);

            return (
              <li key={committee.id} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <p className="text-lg font-semibold text-teal-700">{committee.name}</p>
                    <p className="text-sm text-gray-500">{committee.totalMembers} Members | ₹{committee.monthlyAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">My Payment:</span>
                    <PaymentStatusIndicator status={myPayment?.status} reminder={reminder} />
                  </div>
                   <div>
                    <span className="font-semibold">My Winning Status:</span>
                    {myDetails?.hasWon ? (
                       <span className="ml-2 text-green-600 font-bold">You have won!</span>
                    ) : (
                       <span className="ml-2 text-gray-600">Not yet</span>
                    )}
                  </div>
                </div>
                 <div className="mt-4 border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Draw History</h3>
                    {committee.drawHistory.length > 0 ? (
                        <ul className="space-y-1 text-sm">
                        {committee.drawHistory.map(draw => {
                            const winner = committee.members.find(m => m.userId === draw.winnerId);
                            return (
                            <li key={draw.month} className="flex justify-between">
                                <span className="text-gray-600">Month {draw.month} Winner:</span>
                                <span className={`font-bold ${winner?.userId === user.id ? 'text-teal-600' : 'text-gray-800'}`}>{winner?.name || 'Unknown'}</span>
                            </li>
                            )
                        })}
                        </ul>
                    ): (
                        <p className="text-sm text-gray-500">No draws have occurred yet.</p>
                    )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MemberDashboard;
