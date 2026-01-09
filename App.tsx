
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { User, Role, Committee, Member, PaymentStatus, AppNotification } from './types';
import { mockUsers, mockCommittees } from './data';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import MemberDashboard from './components/MemberDashboard';
import DrawHistoryScreen from './components/DrawHistoryScreen';
import Notification from './components/Notification';
import CreateCommitteeScreen from './components/CreateCommitteeScreen';
import ProfileScreen from './components/ProfileScreen';
import { Header } from './components/Header';
import Footer from './components/Footer';

type View = 'dashboard' | 'history' | 'create_committee' | 'profile';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [committees, setCommittees] = useState<Committee[]>(mockCommittees);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [globalNotifications, setGlobalNotifications] = useState<AppNotification[]>([]);
  
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('readParchiPayNotifications');
      return new Set(stored ? JSON.parse(stored) : []);
    } catch (error) {
      return new Set();
    }
  });

  const handleLogin = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setActiveView('dashboard');
      showToast(`Welcome back, ${user.name}!`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const handleUpdateCommittee = (updatedCommittee: Committee) => {
      setCommittees(prev => prev.map(c => c.id === updatedCommittee.id ? updatedCommittee : c));
  };

  const handleCreateCommittee = (newCommitteeData: Omit<Committee, 'id' | 'adminId' | 'drawHistory' | 'status' | 'paymentDueDate'>) => {
    if (!currentUser) return;
    const newCommittee: Committee = {
      ...newCommitteeData,
      id: `committee-${Date.now()}`,
      adminId: currentUser.id,
      drawHistory: [],
      status: 'Active',
      paymentDueDate: 7, // Standardized due date
      members: [
          ...newCommitteeData.members,
          {
            userId: currentUser.id,
            name: currentUser.name,
            mobile: currentUser.mobile,
            status: 'Active',
            paymentHistory: [],
            hasWon: false,
          }
      ]
    };
    setCommittees(prev => [...prev, newCommittee]);
    showToast(`Committee "${newCommittee.name}" created successfully!`);
    setActiveView('dashboard');
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
        setToast(null);
    }, 5000);
  };
  
  const createGlobalNotification = useCallback((committeeId: string, message: string) => {
      const newNotification: AppNotification = {
          id: `notif-${Date.now()}-${Math.random()}`,
          committeeId,
          message,
          timestamp: new Date().toISOString(),
      };
      setGlobalNotifications(prev => [newNotification, ...prev]);
  }, []);

  const navigateTo = (view: View) => setActiveView(view);
  
  const userCommittees = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === Role.Admin) {
        return committees.filter(c => c.adminId === currentUser.id);
    } else {
        return committees.filter(c => c.members.some(m => m.userId === currentUser.id));
    }
  }, [currentUser, committees]);
  
  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    const userCommitteeIds = userCommittees.map(c => c.id);
    return globalNotifications.filter(n => userCommitteeIds.includes(n.committeeId));
  }, [currentUser, userCommittees, globalNotifications]);

  const unreadCount = useMemo(() => {
    return userNotifications.filter(n => !readNotificationIds.has(n.id)).length;
  }, [userNotifications, readNotificationIds]);

  const markNotificationsAsRead = () => {
    const newReadIds = new Set(readNotificationIds);
    userNotifications.forEach(n => newReadIds.add(n.id));
    setReadNotificationIds(newReadIds);
    localStorage.setItem('readParchiPayNotifications', JSON.stringify(Array.from(newReadIds)));
  };

  useEffect(() => {
    if (!currentUser) return;

    const checkAndCreateReminders = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentJsMonth = today.getMonth();
        const currentYear = today.getFullYear();

        userCommittees.forEach(committee => {
            const myDetails = committee.members.find(m => m.userId === currentUser.id);

            // Conditions to skip sending reminders
            if (
                !myDetails ||
                myDetails.hasWon ||
                committee.status !== 'Active'
            ) {
                return;
            }

            const currentCommitteeMonth = committee.drawHistory.length + 1;
            const paymentForCurrentMonth = myDetails.paymentHistory.find(p => p.month === currentCommitteeMonth);

            if (paymentForCurrentMonth && (paymentForCurrentMonth.status === PaymentStatus.Paid || paymentForCurrentMonth.status === PaymentStatus.Late)) {
                return;
            }

            const dueDate = new Date(currentYear, currentJsMonth, committee.paymentDueDate);
            dueDate.setHours(0, 0, 0, 0);

            // Don't send reminders for past due dates in the current month
            if (today > dueDate) {
                return;
            }
            
            const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
            
            if (daysRemaining === 2) {
                const reminderId = `reminder-${committee.id}-${currentYear}-${currentJsMonth}-2day`;
                if (!localStorage.getItem(reminderId)) {
                    createGlobalNotification(
                        committee.id, 
                        `🔔 Reminder: Payment for "${committee.name}" is due in 2 days.`
                    );
                    localStorage.setItem(reminderId, 'true');
                }
            }

            if (daysRemaining === 0) {
                 const reminderId = `reminder-${committee.id}-${currentYear}-${currentJsMonth}-today`;
                 if (!localStorage.getItem(reminderId)) {
                    createGlobalNotification(
                        committee.id,
                        `⏰ Final Reminder: Payment for "${committee.name}" is due today!`
                    );
                    localStorage.setItem(reminderId, 'true');
                 }
            }
        });
    };
    
    const timer = setTimeout(checkAndCreateReminders, 1500);
    return () => clearTimeout(timer);

  }, [currentUser, userCommittees, createGlobalNotification]);


  const renderContent = () => {
    if (!currentUser) {
      return <LoginScreen users={users} onLogin={handleLogin} />;
    }

    switch(activeView) {
      case 'history':
        return <DrawHistoryScreen committees={userCommittees} onBack={() => navigateTo('dashboard')} />;
      case 'create_committee':
        const nonAdminUsers = users.filter(u => u.role !== Role.Admin && u.id !== currentUser.id);
        return <CreateCommitteeScreen onBack={() => navigateTo('dashboard')} onCreate={handleCreateCommittee} availableMembers={nonAdminUsers}/>;
      case 'profile':
        return <ProfileScreen user={currentUser} onBack={() => navigateTo('dashboard')} />;
      case 'dashboard':
      default:
        switch (currentUser.role) {
          case Role.Admin:
            return <AdminDashboard user={currentUser} committees={userCommittees} onLogout={handleLogout} onUpdateCommittee={handleUpdateCommittee} onNavigate={navigateTo} onShowToast={showToast} onCreateGlobalNotification={createGlobalNotification}/>;
          case Role.Member:
            return <MemberDashboard user={currentUser} committees={userCommittees} onLogout={handleLogout} onNavigate={navigateTo} />;
          default:
            return <LoginScreen users={users} onLogin={handleLogin} />;
        }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-col">
      <Notification toast={toast} onClose={() => setToast(null)} />
      {currentUser && <Header user={currentUser} onLogout={handleLogout} onNavigate={navigateTo} notifications={userNotifications} unreadCount={unreadCount} onMarkNotificationsAsRead={markNotificationsAsRead} />}
      <main className="p-4 sm:p-6 lg:p-8 flex-grow">
        {renderContent()}
      </main>
      {currentUser && <Footer />}
    </div>
  );
};

export default App;
