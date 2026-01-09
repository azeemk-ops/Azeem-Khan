
import React, { useState } from 'react';
import { Committee, Member, User } from '../types';
import { ArrowLeftIcon } from './Icons';

interface CreateCommitteeScreenProps {
  onBack: () => void;
  onCreate: (committee: Omit<Committee, 'id' | 'adminId' | 'drawHistory' | 'status' | 'paymentDueDate'>) => void;
  availableMembers: User[];
}

const CreateCommitteeScreen: React.FC<CreateCommitteeScreenProps> = ({ onBack, onCreate, availableMembers }) => {
  const [step, setStep] = useState(1);
  const [committeeName, setCommitteeName] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState(1000);
  const [duration, setDuration] = useState(12);
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const toggleMember = (user: User) => {
    const isSelected = selectedMembers.some(m => m.userId === user.id);
    if (isSelected) {
      setSelectedMembers(prev => prev.filter(m => m.userId !== user.id));
    } else {
      const newMember: Member = {
        userId: user.id,
        name: user.name,
        mobile: user.mobile,
        status: 'Active',
        paymentHistory: [],
        hasWon: false,
      };
      setSelectedMembers(prev => [...prev, newMember]);
    }
  };

  const filteredMembers = availableMembers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.mobile.includes(searchTerm)
  );
  
  const handleSubmit = () => {
    if (committeeName && monthlyAmount > 0 && duration > 0) {
      onCreate({
        name: committeeName,
        monthlyAmount,
        totalMembers: selectedMembers.length + 1, // +1 for the admin
        duration,
        startDate: new Date().toISOString(),
        members: selectedMembers,
        whatsappGroupUrl,
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Step 1: Committee Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Committee Name</label>
                <input type="text" id="name" value={committeeName} onChange={e => setCommitteeName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="e.g., Office Bachat Group" />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monthly Amount (₹)</label>
                <input type="number" id="amount" value={monthlyAmount} onChange={e => setMonthlyAmount(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (Months)</label>
                <input type="number" id="duration" value={duration} onChange={e => setDuration(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp Group Link (Optional)</label>
                <input type="text" id="whatsapp" value={whatsappGroupUrl} onChange={e => setWhatsappGroupUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="https://chat.whatsapp.com/..." />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Step 2: Add Members</h2>
            <p className="text-sm text-gray-600 mb-4">You (admin) are automatically included. Select other members below.</p>
            <input 
              type="text" 
              placeholder="Search by name or mobile..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 mb-4 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {filteredMembers.map(user => (
                <div key={user.id} onClick={() => toggleMember(user)} className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors ${selectedMembers.some(m => m.userId === user.id) ? 'bg-teal-100 border-teal-500' : 'bg-gray-50 hover:bg-gray-100'}`}>
                    <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.mobile}</p>
                    </div>
                     <input type="checkbox" readOnly checked={selectedMembers.some(m => m.userId === user.id)} className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-teal-500" />
                </div>
              ))}
            </div>
          </div>
        );
       case 3:
        return (
            <div>
                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Step 3: Review & Confirm</h2>
                 <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div><span className="font-semibold">Name:</span> {committeeName}</div>
                    <div><span className="font-semibold">Amount:</span> ₹{monthlyAmount.toLocaleString('en-IN')} / month</div>
                    <div><span className="font-semibold">Duration:</span> {duration} months</div>
                    <div><span className="font-semibold">WhatsApp Group:</span> {whatsappGroupUrl || 'Not provided'}</div>
                    <div><span className="font-semibold">Total Members:</span> {selectedMembers.length + 1}</div>
                    <div className="pt-2 border-t">
                        <h3 className="font-semibold">Members:</h3>
                        <ul className="list-disc pl-5 text-sm">
                            <li>You (Admin)</li>
                            {selectedMembers.map(m => <li key={m.userId}>{m.name}</li>)}
                        </ul>
                    </div>
                 </div>
            </div>
        )
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-teal-600 font-semibold mb-4 hover:underline">
        <ArrowLeftIcon />
        Back to Dashboard
      </button>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Committee</h1>
        {renderStep()}
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button onClick={handleBack} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50">Back</button>
          )}
          {step < 3 ? (
            <button onClick={handleNext} disabled={!committeeName} className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 disabled:bg-gray-400">Next</button>
          ) : (
             <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">Create Committee</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCommitteeScreen;
