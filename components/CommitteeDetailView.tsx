
import React, { useState } from 'react';
import { Committee, Member, PaymentStatus, Role, User, Draw } from '../types';
import { generateCommitteeRules } from '../services/geminiService';
import { sendWinnerAnnouncement, sendPaymentReminders } from '../services/whatsappService';
import DrawAnimation from './DrawAnimation';
import { ArrowLeftIcon, SparklesIcon, BellIcon, WhatsAppIcon } from './Icons';

interface CommitteeDetailViewProps {
  user: User;
  committee: Committee;
  onBack: () => void;
  onUpdateCommittee: (committee: Committee) => void;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
  onCreateGlobalNotification: (committeeId: string, message: string) => void;
}

type Tab = 'members' | 'payments' | 'history' | 'rules';

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

const CommitteeDetailView: React.FC<CommitteeDetailViewProps> = ({ user, committee: initialCommittee, onBack, onUpdateCommittee, onShowToast, onCreateGlobalNotification }) => {
  const [committee, setCommittee] = useState(initialCommittee);
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [isGeneratingRules, setIsGeneratingRules] = useState(false);
  const [isDrawInProgress, setIsDrawInProgress] = useState(false);
  const [winner, setWinner] = useState<Member | null>(null);

  const handleRulesGeneration = async () => {
    setIsGeneratingRules(true);
    const rules = await generateCommitteeRules(committee);
    const updatedCommittee = { ...committee, rules };
    setCommittee(updatedCommittee);
    onUpdateCommittee(updatedCommittee);
    setIsGeneratingRules(false);
  };

  const currentMonth = committee.drawHistory.length + 1;
  const eligibleMembers = committee.members.filter(m => !m.hasWon && m.paymentHistory.find(p => p.month === currentMonth)?.status === PaymentStatus.Paid);

  const handleDraw = () => {
    if (eligibleMembers.length > 0) {
      setIsDrawInProgress(true);
      setWinner(null);
      // Animation will call onDrawFinish
    }
  };

  const handleDrawFinish = (selectedWinner: Member) => {
    const newDraw: Draw = {
      month: currentMonth,
      winnerId: selectedWinner.userId,
      timestamp: new Date().toISOString()
    };
    
    const updatedMembers = committee.members.map(m =>
      m.userId === selectedWinner.userId ? { ...m, hasWon: true } : m
    );

    const updatedCommittee = {
      ...committee,
      members: updatedMembers,
      drawHistory: [...committee.drawHistory, newDraw]
    };

    setCommittee(updatedCommittee);
    onUpdateCommittee(updatedCommittee);
    setWinner(selectedWinner);

    const notificationMessage = `Congratulations to ${selectedWinner.name}! They won the draw for ${committee.name}.`;
    onShowToast(notificationMessage);

    const globalNotificationMessage = `🎉 Winner Announced! ${selectedWinner.name} has won the draw for "${committee.name}".`;
    onCreateGlobalNotification(committee.id, globalNotificationMessage);

    // Send WhatsApp notification
    sendWinnerAnnouncement(updatedCommittee, selectedWinner);

    setTimeout(() => {
        setIsDrawInProgress(false);
    }, 4000);
  };

  const togglePaymentStatus = (memberId: string) => {
    const updatedMembers = committee.members.map(member => {
        if (member.userId === memberId) {
            let paymentForCurrentMonth = member.paymentHistory.find(p => p.month === currentMonth);
            
            if (!paymentForCurrentMonth) {
                const newPayment = { month: currentMonth, status: PaymentStatus.Paid };
                return { ...member, paymentHistory: [...member.paymentHistory, newPayment] };
            }

            const updatedPaymentHistory = member.paymentHistory.map(p => {
                if(p.month === currentMonth){
                    let newStatus: PaymentStatus;
                    switch(p.status) {
                        case PaymentStatus.Pending: newStatus = PaymentStatus.Paid; break;
                        case PaymentStatus.Paid: newStatus = PaymentStatus.Late; break;
                        case PaymentStatus.Late: newStatus = PaymentStatus.Pending; break;
                        default: newStatus = PaymentStatus.Pending;
                    }
                    return {...p, status: newStatus };
                }
                return p;
            });
            return {...member, paymentHistory: updatedPaymentHistory};
        }
        return member;
    });
    const updatedCommittee = {...committee, members: updatedMembers};
    setCommittee(updatedCommittee);
    onUpdateCommittee(updatedCommittee);
  }

  const TabButton = ({ tab, label }: { tab: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tab ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'members': return <MemberList members={committee.members} />;
      case 'payments': return <PaymentList members={committee.members} currentMonth={currentMonth} isAdmin={user.role === Role.Admin} togglePaymentStatus={togglePaymentStatus} committee={committee}/>;
      case 'history': return <DrawHistory draws={committee.drawHistory} members={committee.members} />;
      case 'rules': return <CommitteeRules committee={committee} isGenerating={isGeneratingRules} onGenerate={handleRulesGeneration} />;
    }
  };

  if (isDrawInProgress) {
    return <DrawAnimation members={eligibleMembers} onDrawFinish={handleDrawFinish} winner={winner} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
       <button onClick={onBack} className="flex items-center gap-2 text-teal-600 font-semibold mb-4 hover:underline">
          <ArrowLeftIcon />
          Back to Dashboard
       </button>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{committee.name}</h1>
              <p>₹{(committee.monthlyAmount * committee.totalMembers).toLocaleString('en-IN')} Total Pool Amount</p>
            </div>
            {committee.whatsappGroupUrl && (
              <a href={committee.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-white text-green-600 font-bold rounded-lg shadow hover:bg-gray-100 transition-colors">
                <WhatsAppIcon className="h-5 w-5" />
                Open Group
              </a>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
            <div><p className="text-sm text-gray-500">Contribution</p><p className="font-bold text-lg">₹{committee.monthlyAmount.toLocaleString('en-IN')}</p></div>
            <div><p className="text-sm text-gray-500">Members</p><p className="font-bold text-lg">{committee.totalMembers}</p></div>
            <div><p className="text-sm text-gray-500">Duration</p><p className="font-bold text-lg">{committee.duration} Months</p></div>
            <div><p className="text-sm text-gray-500">Status</p><p className="font-bold text-lg text-green-600">{committee.status}</p></div>
          </div>

          {user.role === Role.Admin && committee.drawHistory.length < committee.duration && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
              <h3 className="font-bold text-yellow-800">Next Draw: Month {currentMonth}</h3>
              <p className="text-sm text-yellow-700">{eligibleMembers.length} members are eligible for this month's draw.</p>
              <button onClick={handleDraw} disabled={eligibleMembers.length === 0} className="mt-2 px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg shadow hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                Start Parchi Draw
              </button>
            </div>
          )}

          <div className="border-b border-gray-200 mb-4">
            <nav className="flex space-x-2">
              <TabButton tab="members" label="Members" />
              <TabButton tab="payments" label="Payments" />
              <TabButton tab="history" label="Draw History" />
              <TabButton tab="rules" label="Rules" />
            </nav>
          </div>

          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};


const MemberList: React.FC<{ members: Member[] }> = ({ members }) => (
    <ul className="space-y-3">
        {members.map(m => (
            <li key={m.userId} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-800">{m.name}</p>
                    <p className="text-sm text-gray-500">{m.mobile}</p>
                </div>
                {m.hasWon && <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-1 rounded-full">WINNER</span>}
            </li>
        ))}
    </ul>
);

const PaymentStatusButton: React.FC<{ status: PaymentStatus, onClick?: () => void, isAdmin: boolean }> = ({ status, onClick, isAdmin }) => {
    const baseClasses = "px-3 py-1 text-sm font-bold rounded-full";
    const statusClasses = {
        [PaymentStatus.Paid]: 'bg-green-100 text-green-800',
        [PaymentStatus.Pending]: 'bg-red-100 text-red-800',
        [PaymentStatus.Late]: 'bg-yellow-100 text-yellow-800',
    };
    const hoverClasses = {
        [PaymentStatus.Paid]: 'hover:bg-green-200',
        [PaymentStatus.Pending]: 'hover:bg-red-200',
        [PaymentStatus.Late]: 'hover:bg-yellow-200',
    };

    if (isAdmin) {
        return <button onClick={onClick} className={`${baseClasses} ${statusClasses[status]} ${hoverClasses[status]} transition-colors`}>{status}</button>;
    }
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
}

const PaymentList: React.FC<{ members: Member[], currentMonth: number, isAdmin: boolean, togglePaymentStatus: (memberId: string) => void, committee: Committee }> = ({ members, currentMonth, isAdmin, togglePaymentStatus, committee }) => {
    const reminder = getReminderStatus(committee.paymentDueDate);
    const handleSendReminders = () => {
        sendPaymentReminders(committee);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Payment Status for Month {currentMonth}</h3>
                {isAdmin && (
                    <button onClick={handleSendReminders} className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm font-bold rounded-lg shadow hover:bg-green-600 transition-colors">
                        <WhatsAppIcon className="h-4 w-4" />
                        Send Reminders
                    </button>
                )}
            </div>
            <ul className="space-y-3">
                {members.map(m => {
                    const payment = m.paymentHistory.find(p => p.month === currentMonth);
                    const status = payment ? payment.status : PaymentStatus.Pending;
                    return (
                        <li key={m.userId} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <p className="font-semibold text-gray-800">{m.name}</p>
                            <div className="flex items-center gap-2">
                                {status === PaymentStatus.Pending && reminder.status !== 'none' && (
                                    <div title={reminder.message}><BellIcon status={reminder.status} /></div>
                                )}
                                <PaymentStatusButton 
                                    status={status}
                                    isAdmin={isAdmin}
                                    onClick={isAdmin ? () => togglePaymentStatus(m.userId) : undefined}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const DrawHistory: React.FC<{ draws: Draw[], members: Member[] }> = ({ draws, members }) => (
    <div>
        {draws.length > 0 ? (
            <ul className="space-y-3">
                {[...draws].reverse().map(d => {
                    const winner = members.find(m => m.userId === d.winnerId);
                    return (
                        <li key={d.month} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800">Month {d.month} Winner</p>
                                <p className="text-sm text-gray-500">{new Date(d.timestamp).toLocaleString()}</p>
                            </div>
                            <p className="font-bold text-lg text-teal-600">{winner?.name || 'Unknown'}</p>
                        </li>
                    )
                })}
            </ul>
        ) : <p className="text-gray-500">No draws have taken place yet.</p>}
    </div>
);

const CommitteeRules: React.FC<{committee: Committee, isGenerating: boolean, onGenerate: () => void}> = ({committee, isGenerating, onGenerate}) => (
    <div className="space-y-4">
        {committee.rules ? (
            <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans">{committee.rules}</pre>
            </div>
        ) : (
            <p className="text-gray-500 italic">No rules have been set for this committee yet.</p>
        )}
        <button 
            onClick={onGenerate} 
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400">
            <SparklesIcon />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
        </button>
    </div>
);

export default CommitteeDetailView;
