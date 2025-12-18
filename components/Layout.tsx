
import React, { useState, useMemo, useEffect } from 'react';
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
  UserCircle,
  MessageSquarePlus,
  Star,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onFeedbackSubmit?: (rating: number, category: string, comment: string) => void;
  dbStatus?: 'connected' | 'disconnected' | 'checking';
}

const FeedbackModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (r: number, cat: string, com: string) => void }) => {
    const [rating, setRating] = useState(5);
    const [category, setCategory] = useState('Feature');
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(rating, category, comment);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Give Feedback</h3>
                    <button onClick={onClose}><X className="w-6 h-6 text-slate-400 hover:text-slate-600" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`p-1 transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-slate-300'}`}
                                >
                                    <Star className="w-8 h-8 fill-current" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Feature">Feature Request</option>
                            <option value="Bug">Report a Bug</option>
                            <option value="Content">Content Issue</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Comments</label>
                        <textarea 
                            required
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Tell us what you think..."
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

const Layout: React.FC<LayoutProps> = ({ children, user, currentTab, onTabChange, onLogout, onFeedbackSubmit, dbStatus = 'checking' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const navItems = useMemo(() => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.STUDENT, UserRole.ALUMNI, UserRole.ADMIN, UserRole.CREATOR] },
      { id: 'profile', label: 'My Profile', icon: UserCircle, roles: [UserRole.STUDENT, UserRole.ALUMNI, UserRole.ADMIN, UserRole.CREATOR] },
      { 
        id: 'directory', 
        label: user.role === UserRole.STUDENT ? 'Find Alumni' : (user.role === UserRole.ALUMNI ? 'Find Talent' : 'User Directory'), 
        icon: Users, 
        roles: [UserRole.STUDENT, UserRole.ALUMNI, UserRole.ADMIN, UserRole.CREATOR] 
      },
      { id: 'mentorship', label: 'Mentorship', icon: GraduationCap, roles: [UserRole.STUDENT] },
      { id: 'events', label: 'Events', icon: Calendar, roles: [UserRole.STUDENT, UserRole.ALUMNI, UserRole.ADMIN, UserRole.CREATOR] },
      { id: 'jobs', label: 'Jobs & Internships', icon: Briefcase, roles: [UserRole.STUDENT, UserRole.ALUMNI, UserRole.CREATOR] },
    ];

    return items.filter(item => item.roles.includes(user.role));
  }, [user.role]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {showFeedback && onFeedbackSubmit && (
          <FeedbackModal 
            onClose={() => setShowFeedback(false)} 
            onSubmit={onFeedbackSubmit} 
          />
      )}

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
          {user.role !== UserRole.CREATOR && (
               <button 
                onClick={() => setShowFeedback(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded-lg transition-colors mb-2"
               >
                 <MessageSquarePlus className="w-5 h-5" />
                 <span className="font-medium">Give Feedback</span>
               </button>
          )}

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

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0 transition-all">
        <header className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-2xl font-bold text-slate-800">
              {navItems.find(i => i.id === currentTab)?.label}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-500 text-sm">Welcome back, {user.name}</p>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                dbStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' : 
                dbStatus === 'disconnected' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {dbStatus === 'connected' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {dbStatus === 'connected' ? 'DB Online' : dbStatus === 'disconnected' ? 'Offline Mode' : 'Syncing...'}
              </div>
            </div>
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
