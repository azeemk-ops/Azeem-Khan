
import React from 'react';
import { Committee } from '../types';
import { ArrowLeftIcon } from './Icons';

interface DrawHistoryScreenProps {
  committees: Committee[];
  onBack: () => void;
}

const DrawHistoryScreen: React.FC<DrawHistoryScreenProps> = ({ committees, onBack }) => {
    // Flatten all draws from all committees into a single array and sort by date
    const allDraws = committees.flatMap(c => 
        c.drawHistory.map(d => ({
            ...d,
            committeeName: c.name,
            committeeId: c.id,
            winnerName: c.members.find(m => m.userId === d.winnerId)?.name || 'Unknown'
        }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-teal-600 font-semibold mb-4 hover:underline">
           <ArrowLeftIcon />
           Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Draw History</h1>
        <p className="mt-1 text-gray-600">A complete and transparent record of all committee draws.</p>
        
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <h3 className="font-bold text-blue-800">Trust & Transparency</h3>
            <p className="text-sm text-blue-700">
                Every draw is conducted using a secure, randomized algorithm. The results are recorded with a permanent timestamp and cannot be altered, ensuring fairness for all members.
            </p>
        </div>

        <div className="mt-8 space-y-6">
            {allDraws.length > 0 ? (
                allDraws.map(draw => (
                    <div key={`${draw.committeeId}-${draw.month}`} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <div>
                                <p className="font-semibold text-teal-700">{draw.committeeName}</p>
                                <p className="text-sm text-gray-500">Month {draw.month} Draw</p>
                            </div>
                            <div className="text-left sm:text-right mt-2 sm:mt-0">
                                <p className="text-lg font-bold text-gray-800">{draw.winnerName}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(draw.timestamp).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No draw history available yet.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default DrawHistoryScreen;
