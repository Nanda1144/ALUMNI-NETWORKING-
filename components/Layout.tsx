
import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Briefcase, 
  Settings, 
  LogOut,
  Menu,
  X,
  GraduationCap,
  UserCircle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentTab, onTabChange, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = useMemo(() => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.STUDENT, UserRole.ALUMNI, UserRole.ADMIN] },
      { id: 'profile', label: 'My Profile', icon: UserCircle, roles: [UserRole.STUDENT, UserRole.ALUMNI, UserRole.ADMIN] },
      { 
        id: 'directory', 
        label: user.role === UserRole.STUDENT ? 'Find Alumni' : (user.role === UserRole.ALUMNI ? 'Find Talent' : 'User Directory'), 
        icon: Users, 
        roles: [UserRole.STUDENT, UserRole.ALUMNI, UserRole.ADMIN] 
      },
      { id: 'mentorship', label: 'Mentorship', icon: GraduationCap, roles: [UserRole.STUDENT] },
      { id: 'events', label: 'Events', icon: Calendar, roles: [UserRole.STUDENT, UserRole.ALUMNI, UserRole.ADMIN] },
      { id: 'jobs', label: 'Jobs & Internships', icon: Briefcase, roles: [UserRole.STUDENT, UserRole.ALUMNI] },
    ];

    return items.filter(item => item.roles.includes(user.role));
  }, [user.role]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed h-full z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl">
              N
            </div>
            <span className="text-xl font-bold tracking-tight">AlumNexus</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors mt-1"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-30 px-4 py-3 flex items-center justify-between shadow-md">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg">N</div>
            <span className="text-lg font-bold">AlumNexus</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900 z-20 pt-20 px-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-lg ${
                  currentTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                <item.icon className="w-6 h-6" />
                {item.label}
              </button>
            ))}
             <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-lg text-lg text-red-400"
              >
                <LogOut className="w-6 h-6" />
                Logout
              </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0 transition-all">
        <header className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-2xl font-bold text-slate-800">
              {navItems.find(i => i.id === currentTab)?.label}
            </h1>
            <p className="text-slate-500 text-sm">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-semibold text-slate-800">{user.name}</p>
               <p className="text-xs text-slate-500 uppercase">{user.role}</p>
             </div>
             <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;
