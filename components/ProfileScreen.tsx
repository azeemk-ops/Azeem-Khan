
import React, { useState } from 'react';
import { User } from '../types';
import { ArrowLeftIcon, CogIcon, UserCircleIcon } from './Icons';

interface ProfileScreenProps {
  user: User;
  onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onBack }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const toggleDarkMode = () => {
      setDarkMode(!darkMode);
      // In a real app, you'd apply a class to the <html> element
      document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-teal-600 font-semibold mb-4 hover:underline">
        <ArrowLeftIcon />
        Back to Dashboard
      </button>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
          <div className="flex items-center space-x-4">
            <UserCircleIcon />
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm opacity-90">{user.role}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">My Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile Number:</span>
                <span className="font-medium text-gray-800">{user.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-xs text-gray-500">{user.id}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2"><CogIcon /> Settings</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 divide-y divide-gray-200">
              <div className="flex justify-between items-center py-2">
                <label htmlFor="notifications" className="text-gray-600">Enable Notifications</label>
                <Switch isEnabled={notifications} onToggle={() => setNotifications(!notifications)} id="notifications"/>
              </div>
              <div className="flex justify-between items-center py-2">
                 <label htmlFor="darkmode" className="text-gray-600">Dark Mode</label>
                 <Switch isEnabled={darkMode} onToggle={toggleDarkMode} id="darkmode"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Switch: React.FC<{ isEnabled: boolean, onToggle: () => void, id: string }> = ({ isEnabled, onToggle, id }) => (
    <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="relative">
            <input id={id} type="checkbox" className="sr-only" checked={isEnabled} onChange={onToggle} />
            <div className={`block w-14 h-8 rounded-full ${isEnabled ? 'bg-teal-600' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isEnabled ? 'transform translate-x-6' : ''}`}></div>
        </div>
    </label>
);


export default ProfileScreen;
