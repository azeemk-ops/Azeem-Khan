
import { User, Role, Committee, PaymentStatus } from './types';

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Ramesh Patel', mobile: '9876543210', role: Role.Admin },
  { id: 'user-2', name: 'Sita Sharma', mobile: '9876543211', role: Role.Member },
  { id: 'user-3', name: 'Amit Kumar', mobile: '9876543212', role: Role.Member },
  { id: 'user-4', name: 'Priya Singh', mobile: '9876543213', role: Role.Member },
  { id: 'user-5', name: 'Vijay Verma', mobile: '9876543214', role: Role.Member },
];

export const mockCommittees: Committee[] = [
  {
    id: 'committee-1',
    name: 'Office Friends Bachat',
    adminId: 'user-1',
    monthlyAmount: 5000,
    totalMembers: 4,
    duration: 4,
    startDate: '2024-08-01',
    paymentDueDate: 7,
    status: 'Active',
    whatsappGroupUrl: 'https://chat.whatsapp.com/sampleinvite123',
    members: [
      {
        userId: 'user-2',
        name: 'Sita Sharma',
        mobile: '9876543211',
        status: 'Active',
        paymentHistory: [
          { month: 1, status: PaymentStatus.Paid },
          { month: 2, status: PaymentStatus.Late },
        ],
        hasWon: false,
      },
      {
        userId: 'user-3',
        name: 'Amit Kumar',
        mobile: '9876543212',
        status: 'Active',
        paymentHistory: [
          { month: 1, status: PaymentStatus.Paid },
          { month: 2, status: PaymentStatus.Paid },
        ],
        hasWon: true,
      },
      {
        userId: 'user-4',
        name: 'Priya Singh',
        mobile: '9876543213',
        status: 'Active',
        paymentHistory: [
          { month: 1, status: PaymentStatus.Paid },
          { month: 2, status: PaymentStatus.Pending },
        ],
        hasWon: false,
      },
      {
        userId: 'user-1',
        name: 'Ramesh Patel',
        mobile: '9876543210',
        status: 'Active',
        paymentHistory: [
          { month: 1, status: PaymentStatus.Paid },
          { month: 2, status: PaymentStatus.Paid },
        ],
        hasWon: false,
      },
    ],
    drawHistory: [
      { month: 1, winnerId: 'user-3', timestamp: new Date().toISOString() }
    ],
    rules: "1. All payments must be made by the 5th of each month.\n2. Late payments will incur a small penalty.\n3. The draw will be held on the 7th of each month."
  },
  {
    id: 'committee-2',
    name: 'Family Fortune Fund',
    adminId: 'user-1',
    monthlyAmount: 10000,
    totalMembers: 5,
    duration: 5,
    startDate: '2024-07-15',
    paymentDueDate: 7,
    status: 'Active',
    members: [
      { userId: 'user-1', name: 'Ramesh Patel', mobile: '9876543210', status: 'Active', paymentHistory: [{ month: 1, status: PaymentStatus.Paid }, { month: 2, status: PaymentStatus.Paid }], hasWon: false },
      { userId: 'user-2', name: 'Sita Sharma', mobile: '9876543211', status: 'Active', paymentHistory: [{ month: 1, status: PaymentStatus.Paid }, { month: 2, status: PaymentStatus.Paid }], hasWon: false },
      { userId: 'user-3', name: 'Amit Kumar', mobile: '9876543212', status: 'Active', paymentHistory: [{ month: 1, status: PaymentStatus.Paid }, { month: 2, status: PaymentStatus.Pending }], hasWon: false },
      { userId: 'user-4', name: 'Priya Singh', mobile: '9876543213', status: 'Active', paymentHistory: [{ month: 1, status: PaymentStatus.Paid }, { month: 2, status: PaymentStatus.Paid }], hasWon: true },
      { userId: 'user-5', name: 'Vijay Verma', mobile: '9876543214', status: 'Active', paymentHistory: [{ month: 1, status: PaymentStatus.Paid }, { month: 2, status: PaymentStatus.Paid }], hasWon: false },
    ],
    drawHistory: [
        { month: 1, winnerId: 'user-4', timestamp: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString() }
    ],
  }
];
