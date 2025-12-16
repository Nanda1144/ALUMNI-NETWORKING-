
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, GraduationCap, Building2 } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Mock password field
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email');
      return;
    }
    // In a real app, validation happens on backend
    onLogin(email, role);
  };

  const getRoleIcon = () => {
    switch (role) {
      case UserRole.ADMIN: return <Shield className="w-8 h-8 text-indigo-600" />;
      case UserRole.ALUMNI: return <Building2 className="w-8 h-8 text-indigo-600" />;
      case UserRole.STUDENT: return <GraduationCap className="w-8 h-8 text-indigo-600" />;
    }
  };

  const getRoleDescription = () => {
    switch (role) {
      case UserRole.ADMIN: return "Manage events, master directory, and platform settings.";
      case UserRole.ALUMNI: return "Post jobs, create events, and find student talent.";
      case UserRole.STUDENT: return "Find mentorship, jobs, events, and connect with alumni.";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Side - Selection */}
        <div className="md:w-2/5 bg-slate-900 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg">N</div>
              <span className="text-xl font-bold">AlumNexus</span>
            </div>
            <h2 className="text-2xl font-bold mb-6">Choose Login Type</h2>
            
            <div className="space-y-4">
              <button 
                onClick={() => setRole(UserRole.STUDENT)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${role === UserRole.STUDENT ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                <GraduationCap className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Student</p>
                  <p className="text-xs opacity-75">Access mentorship & jobs</p>
                </div>
              </button>

              <button 
                onClick={() => setRole(UserRole.ALUMNI)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${role === UserRole.ALUMNI ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                <Building2 className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Company / Alumni</p>
                  <p className="text-xs opacity-75">Recruit talent & host events</p>
                </div>
              </button>

              <button 
                onClick={() => setRole(UserRole.ADMIN)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${role === UserRole.ADMIN ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                <Shield className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Administrator</p>
                  <p className="text-xs opacity-75">Platform management</p>
                </div>
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-6">© 2024 AlumNexus Inc.</p>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-8">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              {getRoleIcon()}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">{getRoleDescription()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              Log In as {role.charAt(0) + role.slice(1).toLowerCase()}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500">
              <span className="font-medium">Demo Credentials:</span><br/>
              Student: david.kim@university.edu<br/>
              Alumni: sarah.c@techcorp.com<br/>
              Admin: admin@alumnexus.edu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
