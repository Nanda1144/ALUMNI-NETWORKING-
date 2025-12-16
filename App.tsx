import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AlumniDirectory from './components/AlumniDirectory';
import Mentorship from './components/Mentorship';
import Events from './components/Events';
import Jobs from './components/Jobs';
import Profile from './components/Profile';
import { MOCK_USERS } from './constants';

const App: React.FC = () => {
  // Simulating a logged-in student user
  // In a real app, this would come from an Auth Context
  const currentUser = MOCK_USERS[4]; // David Kim (Student)

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [directorySearch, setDirectorySearch] = useState('');

  const navigateToDirectory = (term: string) => {
      setDirectorySearch(term);
      setCurrentTab('directory');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'directory':
        return <AlumniDirectory initialSearch={directorySearch} />;
      case 'mentorship':
        return <Mentorship currentUser={currentUser} />;
      case 'events':
        return <Events />;
      case 'jobs':
        return <Jobs currentUser={currentUser} />;
      case 'profile':
        return <Profile user={currentUser} onNavigateToDirectory={navigateToDirectory} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      user={currentUser} 
      currentTab={currentTab} 
      onTabChange={setCurrentTab}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;