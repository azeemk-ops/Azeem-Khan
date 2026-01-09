
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
      <path d="M16 30C24.8366 30 32 23.134 32 14.5C32 5.866 24.8366 -1 16 -1C7.16344 -1 0 5.866 0 14.5C0 23.134 7.16344 30 16 30Z" fill="url(#paint0_linear_10_2)"/>
      <path d="M10 14.5L16 20.5L22 14.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 9.5L16 15.5L22 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="paint0_linear_10_2" x1="0" y1="-1" x2="32" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2DD4BF"/>
          <stop offset="1" stopColor="#06B6D4"/>
        </linearGradient>
      </defs>
    </svg>
    <span className="text-3xl font-bold text-gray-800">ParchiPay</span>
  </div>
);

export default Logo;
