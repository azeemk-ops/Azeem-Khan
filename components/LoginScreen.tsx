
import React from 'react';
import { User } from '../types';
import Logo from './Logo';

interface LoginScreenProps {
  users: User[];
  onLogin: (userId: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  return (
    <div className="flex items-center justify-center -m-4 sm:-m-6 lg:-m-8 min-h-screen bg-gradient-to-br from-teal-400 to-blue-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-12 w-auto" />
          </div>
          <p className="mt-2 text-gray-600">Your Digital Committee, Simplified.</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-700">Select a user to login</h2>
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onLogin(user.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-teal-100 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.mobile}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${user.role === 'ADMIN' ? 'bg-teal-500' : 'bg-blue-500'}`}>
                {user.role}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
