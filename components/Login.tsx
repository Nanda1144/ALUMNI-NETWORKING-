
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, GraduationCap, Building2, ArrowRight, UserCheck, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void; 
  onRegister: (name: string, email: string, role: UserRole) => void;
  onBack?: () => void; // Added back navigation prop
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isRegistering) {
        if (!name) {
            setError('Please enter your name');
            return;
        }
        onRegister(name, email, role);
    } else {
        // For login, we just pass the email. The App logic will determine the role.
        onLogin(email);
    }
  };

  const getRoleIcon = () => {
    if (!isRegistering) return <UserCheck className="w-8 h-8 text-indigo-600" />;

    switch (role) {
      case UserRole.ADMIN: return <Shield className="w-8 h-8 text-indigo-600" />;
      case UserRole.ALUMNI: return <Building2 className="w-8 h-8 text-indigo-600" />;
      case UserRole.STUDENT: return <GraduationCap className="w-8 h-8 text-indigo-600" />;
    }
  };

  const getRoleDescription = () => {
    if (!isRegistering) return "Welcome back! Please enter your credentials.";

    switch (role) {
      case UserRole.ADMIN: return "Manage events, master directory, and platform settings.";
      case UserRole.ALUMNI: return "Post jobs, create events, and find student talent.";
      case UserRole.STUDENT: return "Find mentorship, jobs, events, and connect with alumni.";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[550px] relative">
        
        {/* Back Button */}
        {onBack && (
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 z-20 flex items-center gap-2 text-slate-400 hover:text-white md:hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium md:text-white"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
        )}

        {/* Left Side - Selection */}
        <div className="md:w-2/5 bg-slate-900 text-white p-8 flex flex-col justify-between pt-16 md:pt-8">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg">N</div>
              <span className="text-xl font-bold">AlumNexus</span>
            </div>
            <h2 className="text-2xl font-bold mb-6">
                {isRegistering ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
                {isRegistering 
                    ? "Select your role to join our community." 
                    : "Log in to access your dashboard, connect with alumni, and find opportunities."
                }
            </p>
            
            {isRegistering ? (
                <div className="space-y-4 animate-fade-in">
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
            ) : (
                <div className="py-8 text-slate-400 text-sm leading-relaxed animate-fade-in">
                    <p>Connecting educational institutions with their alumni network.</p>
                    <ul className="mt-4 space-y-2 list-disc list-inside">
                        <li>AI-Powered Mentorship</li>
                        <li>Job Board & Internships</li>
                        <li>Event Management</li>
                        <li>Alumni Directory</li>
                    </ul>
                </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-6">© 2024 AlumNexus Inc.</p>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-6">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              {getRoleIcon()}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {isRegistering ? "Sign Up" : "Log In"}
            </h1>
            <p className="text-slate-500">{getRoleDescription()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
                <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input 
                        type="text"
                        required={isRegistering}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                  {isRegistering && role === UserRole.STUDENT ? "College Email (.edu)" : "Email Address"}
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRegistering && role === UserRole.STUDENT ? "name@university.edu" : "name@example.com"}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
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
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isRegistering ? "Create Account" : "Log In"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
            
          <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                  {isRegistering ? "Already have an account? " : "Don't have an account? "}
                  <button 
                    onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                      {isRegistering ? "Log In" : "Sign Up"}
                  </button>
              </p>
          </div>

          {!isRegistering && (
            <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-center text-sm text-slate-500">
                <span className="font-medium">Demo Credentials:</span><br/>
                Student: david.kim@university.edu<br/>
                Alumni: sarah.c@techcorp.com<br/>
                Admin: admin@alumnexus.edu
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
