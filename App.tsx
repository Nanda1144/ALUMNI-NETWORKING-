import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AlumniDirectory from './components/AlumniDirectory';
import Mentorship from './components/Mentorship';
import Events from './components/Events';
import Jobs from './components/Jobs';
import Profile from './components/Profile';
import Login from './components/Login';
import LandingPage from './components/LandingPage'; 
import CreatorAnalytics from './components/CreatorAnalytics';
import { MOCK_USERS, MOCK_FEEDBACK } from './constants';
import { User, UserRole, Feedback } from './types';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [feedback, setFeedback] = useState<Feedback[]>(MOCK_FEEDBACK);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [directorySearch, setDirectorySearch] = useState('');
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsOffline(false);
      const response = await fetch('http://localhost:3001/api/users');
      if (response.ok) {
        const dbUsers = await response.json();
        if (dbUsers.length > 0) {
          setUsers(dbUsers);
        }
      } else {
        throw new Error('Server unreachable');
      }
    } catch (error) {
      console.warn("Backend not running. Using Mock Data.");
      setIsOffline(true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      if (response.ok) {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        alert("Database synchronized: Profile updated successfully.");
      } else {
        alert("Failed to sync with database.");
      }
    } catch (error) {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
      alert("Local update successful. (Server connection unavailable)");
    }
  };

  const handleLogin = (email: string) => {
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setViewState('app');
    } else {
      alert("Invalid credentials.");
    }
  };

  const handleRegister = async (name: string, email: string, role: UserRole) => {
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      alert("Email already registered.");
      return;
    }

    const prefix = role === UserRole.STUDENT ? 'S' : (role === UserRole.ALUMNI ? 'A' : 'ADM');
    const uniqueId = `${prefix}-${Date.now().toString().slice(-6)}`;
    const newUser: User = {
      id: uniqueId, name, email, role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      bio: "I am new here!", skills: [], interests: [],
      graduationYear: new Date().getFullYear(), department: "General",
      privacySettings: { showEmail: true, showCompany: true, showSocials: true }
    };

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (response.ok) {
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setViewState('app');
        setCurrentTab('profile');
      } else {
        throw new Error();
      }
    } catch (error) {
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setViewState('app');
      setCurrentTab('profile');
      alert("Account created locally. Data will sync once server is back.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewState('landing');
    setCurrentTab('dashboard');
    setViewingProfile(null);
  };

  const renderContent = () => {
    if (!currentUser) return null;
    if (viewingProfile) {
      return <Profile user={viewingProfile} isReadOnly={true} onBack={() => setViewingProfile(null)} />;
    }
    
    return (
      <>
        {isOffline && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-amber-800 text-sm animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Database connection lost. You are browsing in offline mode.</span>
            </div>
            <button onClick={fetchUsers} className="flex items-center gap-1 hover:underline font-bold">
              <RefreshCw className="w-3 h-3" /> Retry Sync
            </button>
          </div>
        )}
        {(() => {
          switch (currentTab) {
            case 'dashboard': return currentUser.role === UserRole.CREATOR ? <CreatorAnalytics feedback={feedback} /> : <Dashboard users={users} />;
            case 'directory': return <AlumniDirectory initialSearch={directorySearch} currentUser={currentUser} onViewProfile={setViewingProfile} users={users} />;
            case 'mentorship': return <Mentorship currentUser={currentUser} users={users} />;
            case 'events': return <Events currentUser={currentUser} />;
            case 'jobs': return <Jobs currentUser={currentUser} users={users} />;
            case 'profile': return <Profile user={currentUser} onUpdateUser={handleUpdateUser} />;
            default: return <Dashboard users={users} />;
          }
        })()}
      </>
    );
  };

  if (viewState === 'landing') return <LandingPage onGetStarted={() => setViewState('auth')} />;
  if (viewState === 'auth') return <Login onLogin={handleLogin} onRegister={handleRegister} onBack={() => setViewState('landing')} />;

  return (
    <Layout 
      user={currentUser} 
      currentTab={currentTab} 
      onTabChange={setCurrentTab}
      onLogout={handleLogout}
      onFeedbackSubmit={(r, c, com) => alert("Feedback received!")}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;