
import { Committee, Member, PaymentStatus } from '../types';

const openWhatsApp = (message: string) => {
  // Using https://wa.me/ is more universal than whatsapp:// for web apps
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

export const sendWinnerAnnouncement = (committee: Committee, winner: Member) => {
  const message = `
🎉 *Winner Announcement!* 🎉

Congratulations to *${winner.name}*!

They have won the draw for Month ${committee.drawHistory.length} in our committee, *"${committee.name}"*.

Let's all wish them the best!

- Sent via ParchiPay
  `;
  openWhatsApp(message.trim());
};

export const sendPaymentReminders = (committee: Committee) => {
  const currentMonth = committee.drawHistory.length + 1;
  
  const pendingMembers = committee.members.filter(member => {
    if (member.hasWon) return false;
    const payment = member.paymentHistory.find(p => p.month === currentMonth);
    return !payment || payment.status === PaymentStatus.Pending;
  });

  if (pendingMembers.length === 0) {
    alert("All eligible members have paid for this month!");
    return;
  }

  const memberNames = pendingMembers.map(m => `- ${m.name}`).join('\n');

  const message = `
🔔 *Payment Reminder for "${committee.name}"* 🔔

Hello everyone,

This is a friendly reminder that the payment of *₹${committee.monthlyAmount.toLocaleString('en-IN')}* for Month ${currentMonth} is due soon.

The following members still need to complete their payment:
${memberNames}

Please make your payment on time to ensure the draw can happen smoothly.

Thank you!

- Sent via ParchiPay
  `;
  openWhatsApp(message.trim());
};
