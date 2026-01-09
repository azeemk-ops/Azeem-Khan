
import React, { useState } from 'react';
import { User, Committee, PaymentStatus } from '../types';
import CommitteeDetailView from './CommitteeDetailView';
import { StatCard, PlusCircleIcon } from './Icons';

interface AdminDashboardProps {
  user: User;
  committees: Committee[];
  onLogout: () => void;
  onUpdateCommittee: (committee: Committee) => void;
  onNavigate: (view: 'history' | 'create_committee' | 'profile') => void;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
  onCreateGlobalNotification: (committeeId: string, message: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, committees, onLogout, onUpdateCommittee, onNavigate, onShowToast, onCreateGlobalNotification }) => {
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);

  const totalCollection = committees.reduce((sum, c) => sum + c.monthlyAmount * c.members.filter(m => m.paymentHistory.find(p => p.month === c.drawHistory.length + 1)?.status === 'PAID').length, 0);
  const totalDefaulters = committees.reduce((sum, c) => sum + c.members.filter(m => {
    const status = m.paymentHistory.find(p => p.month === c.drawHistory.length + 1)?.status;
    return status === PaymentStatus.Pending || status === PaymentStatus.Late;
  }).length, 0);
  
  if (selectedCommittee) {
    return <CommitteeDetailView user={user} committee={selectedCommittee} onBack={() => setSelectedCommittee(null)} onUpdateCommittee={onUpdateCommittee} onShowToast={onShowToast} onCreateGlobalNotification={onCreateGlobalNotification} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard title="Active Committees" value={committees.length.toString()} />
        <StatCard title="This Month's Collection" value={`₹${totalCollection.toLocaleString('en-IN')}`} />
        <StatCard title="Total Defaulters" value={totalDefaulters.toString()} />
        <StatCard title="Total Members" value={committees.reduce((acc, c) => acc + c.totalMembers, 0).toString()} />
      </div>

      <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Committees</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('history')} className="text-sm font-semibold text-teal-600 hover:underline">
              View Full History
            </button>
            <button onClick={() => onNavigate('create_committee')} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors">
              <PlusCircleIcon />
              Create New
            </button>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {committees.map(committee => (
            <li key={committee.id} onClick={() => setSelectedCommittee(committee)} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-teal-700">{committee.name}</p>
                  <p className="text-sm text-gray-500">{committee.totalMembers} Members | ₹{committee.monthlyAmount.toLocaleString('en-IN')} per month</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-medium text-gray-900">
                    Pool: ₹{(committee.monthlyAmount * committee.totalMembers).toLocaleString('en-IN')}
                  </p>
                   <p className="text-xs text-gray-500">
                     Next Draw: Month {committee.drawHistory.length + 1} / {committee.duration}
                   </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
