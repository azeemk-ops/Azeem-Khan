
import React, { useState, useEffect, useMemo } from 'react';
import { Member } from '../types';

interface DrawAnimationProps {
  members: Member[];
  onDrawFinish: (winner: Member) => void;
  winner: Member | null;
}

const Parchi: React.FC<{ name: string; isVisible: boolean; isSelected: boolean, isWinner: boolean }> = ({ name, isVisible, isSelected, isWinner }) => {
    const baseClasses = "absolute w-32 h-20 bg-white rounded-lg shadow-lg border-2 flex items-center justify-center text-center font-semibold text-gray-800 p-2 transition-all duration-500";
    const visibilityClass = isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50';
    const selectedClass = isSelected ? 'border-yellow-400 ring-4 ring-yellow-300 z-20' : 'border-teal-300';
    const winnerClass = isWinner ? 'bg-gradient-to-br from-yellow-300 to-orange-400 scale-125 z-30 shadow-2xl' : '';
    
    return <div className={`${baseClasses} ${visibilityClass} ${selectedClass} ${winnerClass}`}>{name}</div>;
};

const DrawAnimation: React.FC<DrawAnimationProps> = ({ members, onDrawFinish, winner }) => {
  const [parchis, setParchis] = useState<{ member: Member; angle: number; distance: number }[]>([]);
  const [currentSelectionIndex, setCurrentSelectionIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<'shuffling' | 'selecting' | 'finished'>('shuffling');

  const winnerIndex = useMemo(() => {
    if (!winner) return -1;
    return parchis.findIndex(p => p.member.userId === winner.userId);
  }, [winner, parchis]);

  useEffect(() => {
    // Initialize parchis with random positions
    setParchis(members.map(member => ({
      member,
      angle: Math.random() * 360,
      distance: 80 + Math.random() * 80, // in pixels from center
    })));
  }, [members]);

  useEffect(() => {
    if (phase === 'shuffling') {
      const interval = setInterval(() => {
        setParchis(prev => prev.map(p => ({ ...p, angle: (p.angle + 5) % 360 })));
      }, 50);

      const shuffleTimer = setTimeout(() => {
        clearInterval(interval);
        setPhase('selecting');
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(shuffleTimer);
      };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'selecting') {
      let selectionCount = 0;
      const totalSelections = members.length + Math.floor(Math.random() * members.length) + 5;
      let delay = 100;
      
      const selectNext = () => {
        setCurrentSelectionIndex(prev => (prev === null ? 0 : (prev + 1) % members.length));
        selectionCount++;

        if (selectionCount < totalSelections) {
          if (selectionCount > totalSelections - 5) { // Slow down at the end
            delay *= 1.4;
          }
          setTimeout(selectNext, delay);
        } else {
          // Final selection
          const finalWinner = members[Math.floor(Math.random() * members.length)];
          const finalIndex = members.findIndex(m => m.userId === finalWinner.userId);
          setCurrentSelectionIndex(finalIndex);
          setPhase('finished');
          onDrawFinish(finalWinner);
        }
      };
      
      selectNext();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, members, onDrawFinish]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
      <div className="relative w-96 h-96 flex items-center justify-center">
        {parchis.map((p, index) => (
          <div key={p.member.userId} style={{ transform: `rotate(${p.angle}deg) translateX(${p.distance}px) rotate(-${p.angle}deg)` }} className="absolute">
            <Parchi 
                name={p.member.name} 
                isVisible={true}
                isSelected={phase !== 'finished' && index === currentSelectionIndex}
                isWinner={phase === 'finished' && index === winnerIndex}
            />
          </div>
        ))}
      </div>
      <div className="text-white text-center mt-10 p-4 rounded-lg">
        {phase === 'shuffling' && <h2 className="text-3xl font-bold animate-pulse">Shuffling Parchis...</h2>}
        {phase === 'selecting' && <h2 className="text-3xl font-bold animate-pulse">Picking a Winner...</h2>}
        {phase === 'finished' && winner && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold">Congratulations!</h2>
            <p className="text-5xl font-bold text-yellow-300 my-2">{winner.name}</p>
            <p className="text-xl">You are this month's winner!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawAnimation;
