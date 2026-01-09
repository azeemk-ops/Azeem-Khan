
export enum Role {
  Admin = 'ADMIN',
  Member = 'MEMBER',
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: Role;
}

export enum PaymentStatus {
  Paid = 'PAID',
  Pending = 'PENDING',
  Late = 'LATE',
}

export interface Member {
  userId: string;
  name: string;
  mobile: string;
  status: 'Active' | 'Inactive';
  paymentHistory: { month: number; status: PaymentStatus }[];
  hasWon: boolean;
}

export interface Draw {
  month: number;
  winnerId: string;
  timestamp: string;
}

export interface Committee {
  id: string;
  name: string;
  adminId: string;
  monthlyAmount: number;
  totalMembers: number;
  duration: number; // in months
  startDate: string;
  paymentDueDate: number; // Day of the month
  status: 'Active' | 'Completed';
  members: Member[];
  drawHistory: Draw[];
  rules?: string;
  whatsappGroupUrl?: string;
}

export interface AppNotification {
  id:string;
  message: string;
  committeeId: string;
  timestamp: string;
}
