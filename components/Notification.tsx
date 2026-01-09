
import React, { useEffect } from 'react';
import { CheckCircleIcon, XIcon } from './Icons';

interface NotificationProps {
  toast: { message: string; type: 'success' | 'error' } | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ toast, onClose }) => {
  if (!toast) {
    return null;
  }

  const { message, type } = toast;
  const isSuccess = type === 'success';

  return (
    <div
      className="fixed top-5 right-5 z-50 animate-fade-in-down"
      role="alert"
      aria-live="assertive"
    >
      <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {isSuccess && <CheckCircleIcon />}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={onClose}
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Close</span>
                <XIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
