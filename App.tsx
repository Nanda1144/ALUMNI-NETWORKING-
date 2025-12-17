
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AlumniDirectory from './components/AlumniDirectory';
import Mentorship from './components/Mentorship';
import Events from './components/Events';
import Jobs from './components/Jobs';
import Profile from './components/Profile';
import Login from './components/Login';
import LandingPage from './components/LandingPage'; 
import CreatorAnalytics from './components/CreatorAnalytics'; // Import
import { MOCK_USERS, MOCK_FEEDBACK } from './constants';
import { User, UserRole, Feedback } from './types';

const App: React.FC = () => {
  // State to hold all users
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [feedback, setFeedback] = useState<Feedback[]>(MOCK_FEEDBACK);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Navigation State
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app'>('landing');
  
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [directorySearch, setDirectorySearch] = useState('');
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);

  // Helper to start auth flow
  const handleGetStarted = (mode: 'login' | 'register') => {
      setViewState('auth');
  };

  const handleLogin = (email: string) => {
    // Check against the state 'users'
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      setCurrentUser(user);
      setViewState('app');
    } else {
      alert("Invalid credentials. Please use the demo credentials provided or create a new account.");
    }
  };

  const handleRegister = (name: string, email: string, role: UserRole) => {
      // 1. Check if email already exists
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          alert("This email is already registered.");
          return;
      }

      // 2. Validate Student Email (must be .edu)
      if (role === UserRole.STUDENT) {
          if (!email.toLowerCase().endsWith('.edu')) {
              alert("Access Denied: Students must register using a valid college email address ending in .edu");
              return;
          }
      }

      // 3. Create New User with Unique ID
      const prefix = role === UserRole.STUDENT ? 'S' : (role === UserRole.ALUMNI ? 'A' : 'ADM');
      const uniqueId = `${prefix}-${Date.now().toString().slice(-6)}`;

      const newUser: User = {
          id: uniqueId,
          name: name,
          email: email,
          role: role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          bio: "I am new here! excited to connect.",
          skills: [],
          interests: [],
          graduationYear: new Date().getFullYear(),
          department: "General",
          privacySettings: {
              showEmail: true,
              showCompany: true,
              showSocials: true
          }
      };

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setViewState('app');
      setCurrentTab('profile'); // Send them to profile to fill in details
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewState('landing');
    setCurrentTab('dashboard');
    setViewingProfile(null);
  };

  const handleBackToLanding = () => {
    setViewState('landing');
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

  const handleFeedbackSubmit = (rating: number, category: any, comment: string) => {
      if(!currentUser) return;
      const newFeedback: Feedback = {
          id: `f${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          rating,
          category,
          comment,
          date: new Date().toISOString().split('T')[0]
      };
      setFeedback(prev => [newFeedback, ...prev]);
      alert("Thank you for your feedback!");
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
        // If it's the Creator, show the Analytics Dashboard
        if (currentUser.role === UserRole.CREATOR) {
            return <CreatorAnalytics feedback={feedback} />;
        }
        return <Dashboard users={users} />;
      case 'directory':
        return (
            <AlumniDirectory 
                initialSearch={directorySearch} 
                currentUser={currentUser} 
                onViewProfile={handleViewProfile}
                users={users} 
            />
        );
      case 'mentorship':
        return <Mentorship currentUser={currentUser} users={users} />;
      case 'events':
        return <Events currentUser={currentUser} />;
      case 'jobs':
        return <Jobs currentUser={currentUser} users={users} />;
      case 'profile':
        return <Profile user={currentUser} onNavigateToDirectory={navigateToDirectory} />;
      default:
        if (currentUser.role === UserRole.CREATOR) {
            return <CreatorAnalytics feedback={feedback} />;
        }
        return <Dashboard users={users} />;
    }
  };

  // View Logic
  if (viewState === 'landing') {
      return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (viewState === 'auth') {
      return <Login onLogin={handleLogin} onRegister={handleRegister} onBack={handleBackToLanding} />;
  }

  // Logged In App View
  if (!currentUser) return null; // Should not happen based on viewState logic

  return (
    <Layout 
      user={currentUser} 
      currentTab={currentTab} 
      onTabChange={handleTabChange}
      onLogout={handleLogout}
      onFeedbackSubmit={handleFeedbackSubmit} // Pass handler
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
