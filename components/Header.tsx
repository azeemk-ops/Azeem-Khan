
import React, { useState } from 'react';
import { User, AppNotification } from '../types';
import { LogoutIcon, UserCircleIcon, NotificationBellIcon } from './Icons';
import Logo from './Logo';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: 'profile') => void;
  notifications: AppNotification[];
  unreadCount: number;
  onMarkNotificationsAsRead: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate, notifications, unreadCount, onMarkNotificationsAsRead }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleToggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      onMarkNotificationsAsRead();
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo className="h-8 w-auto" />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            
            <div className="relative">
                <button
                  onClick={handleToggleNotifications}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  aria-label="Notifications"
                >
                  <NotificationBellIcon />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </button>

                {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fade-in-down origin-top-right">
                       <div className="p-3 border-b">
                           <h3 className="font-semibold text-gray-800">Notifications</h3>
                       </div>
                       <ul className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(n => (
                            <li key={n.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                <div className="p-3">
                                    <p className="text-sm text-gray-700">{n.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                                </div>
                            </li>
                        )) : (
                            <li className="p-4 text-center text-sm text-gray-500">No new notifications.</li>
                        )}
                       </ul>
                    </div>
                )}
            </div>

            <button
              onClick={() => onNavigate('profile')}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              aria-label="Profile"
            >
              <UserCircleIcon />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              aria-label="Logout"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
