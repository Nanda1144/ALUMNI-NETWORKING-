
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AlumniDirectory from './components/AlumniDirectory';
import Mentorship from './components/Mentorship';
import Events from './components/Events';
import Jobs from './components/Jobs';
import Profile from './components/Profile';
import Login from './components/Login';
import { MOCK_USERS } from './constants';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [directorySearch, setDirectorySearch] = useState('');
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);

  const handleLogin = (email: string, role: UserRole) => {
    // 1. Find user in mock data by email
    let user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    // 2. Mock Role Check (or if using Demo buttons)
    if (user) {
      if (user.role !== role) {
         alert(`This email is registered as a ${user.role}, not a ${role}.`);
         return;
      }
      setCurrentUser(user);
    } else {
      // For demo purposes, if email doesn't exist, we reject or could create a temporary mock
      alert("Invalid credentials. Please use the demo credentials provided.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('dashboard');
    setViewingProfile(null);
  };

  const navigateToDirectory = (term: string) => {
      setDirectorySearch(term);
      setCurrentTab('directory');
      setViewingProfile(null);
  };

  const handleViewProfile = (user: User) => {
      setViewingProfile(user);
  };

  const handleBackToDirectory = () => {
      setViewingProfile(null);
  };

  // If we change tabs, clear the viewed profile
  const handleTabChange = (tab: string) => {
      setCurrentTab(tab);
      setViewingProfile(null);
  };

  const renderContent = () => {
    if (!currentUser) return null;

    // Override content if viewing another user's profile
    if (viewingProfile) {
        return (
            <Profile 
                user={viewingProfile} 
                isReadOnly={true} 
                onBack={handleBackToDirectory}
                onNavigateToDirectory={navigateToDirectory}
            />
        );
    }

    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'directory':
        return (
            <AlumniDirectory 
                initialSearch={directorySearch} 
                currentUser={currentUser} 
                onViewProfile={handleViewProfile}
            />
        );
      case 'mentorship':
        return <Mentorship currentUser={currentUser} />;
      case 'events':
        return <Events currentUser={currentUser} />;
      case 'jobs':
        return <Jobs currentUser={currentUser} />;
      case 'profile':
        return <Profile user={currentUser} onNavigateToDirectory={navigateToDirectory} />;
      default:
        return <Dashboard />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={currentUser} 
      currentTab={currentTab} 
      onTabChange={handleTabChange}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
