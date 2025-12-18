
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, GraduationCap, Building2, ArrowRight, UserCheck, ArrowLeft, Key, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void; 
  onRegister: (name: string, email: string, role: UserRole) => void;
  onBack?: () => void; 
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, onBack }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const [error, setError] = useState('');

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/\d/.test(pass)) return "Password must include at least one number.";
    if (!/[!@#$%^&*]/.test(pass)) return "Password must include at least one symbol (!@#$%^&*).";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Handle forgot password mode separately to avoid nested complex logic
    if (authMode === 'forgot') {
        if (!email) {
            setError('Please enter your email address.');
            return;
        }
        setResetSent(true);
        return;
    }

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (authMode === 'register') {
        const passError = validatePassword(password);
        if (passError) {
            setError(passError);
            return;
        }

        if (!name) {
            setError('Please enter your name');
            return;
        }

        // Domain validation for students
        if (role === UserRole.STUDENT && !email.toLowerCase().endsWith('.edu')) {
            setError('Students must register with a valid .edu email address.');
            return;
        }

        onRegister(name, email, role);
    } else {
        onLogin(email);
    }
  };

  const getRoleIcon = () => {
    if (authMode === 'login') return <UserCheck className="w-8 h-8 text-indigo-600" />;
    if (authMode === 'forgot') return <Key className="w-8 h-8 text-indigo-600" />;

    switch (role) {
      case UserRole.ADMIN: return <Shield className="w-8 h-8 text-indigo-600" />;
      case UserRole.ALUMNI: return <Building2 className="w-8 h-8 text-indigo-600" />;
      case UserRole.STUDENT: return <GraduationCap className="w-8 h-8 text-indigo-600" />;
      default: return <UserCheck className="w-8 h-8 text-indigo-600" />;
    }
  };

  const getDescription = () => {
    if (authMode === 'forgot') return "Enter your email and we'll send you instructions to reset your password.";
    if (authMode === 'login') return "Welcome back! Please enter your credentials.";

    switch (role) {
      case UserRole.ADMIN: return "Manage events, master directory, and platform settings.";
      case UserRole.ALUMNI: return "Post jobs, create events, and find student talent.";
      case UserRole.STUDENT: return "Find mentorship, jobs, events, and connect with alumni.";
      default: return "";
    }
  };

  if (resetSent) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-12 text-center animate-fade-in">
                <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
                <p className="text-slate-500 mb-8">If an account exists for {email}, you will receive a password reset link shortly.</p>
                <button 
                    onClick={() => { setAuthMode('login'); setResetSent(false); }}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
                >
                    Return to Login
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[550px] relative">
        
        {onBack && (
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 z-20 flex items-center gap-2 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium md:text-white"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
        )}

        {/* Left Side */}
        <div className="md:w-2/5 bg-slate-900 text-white p-8 flex flex-col justify-between pt-16 md:pt-8">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg">N</div>
              <span className="text-xl font-bold">AlumNexus</span>
            </div>
            <h2 className="text-2xl font-bold mb-6">
                {authMode === 'register' ? "Create Account" : (authMode === 'forgot' ? "Reset Password" : "Welcome Back")}
            </h2>
            
            {authMode === 'register' ? (
                <div className="space-y-4 animate-fade-in">
                  <button 
                    type="button"
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
                    type="button"
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
                    type="button"
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
                {authMode === 'register' ? "Sign Up" : (authMode === 'forgot' ? "Forgot Password?" : "Log In")}
            </h1>
            <p className="text-slate-500">{getDescription()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
                <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input 
                        type="text"
                        required={authMode === 'register'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                  {authMode === 'register' && role === UserRole.STUDENT ? "College Email (.edu)" : "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authMode === 'register' && role === UserRole.STUDENT ? "name@university.edu" : "name@example.com"}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Change: Use explicit equality checks to prevent unintentional narrowing that breaks subsequent 'forgot' comparisons */}
            {(authMode === 'login' || authMode === 'register') && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    {authMode === 'login' && (
                        <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs font-bold text-indigo-600 hover:underline">Forgot Password?</button>
                    )}
                  </div>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  {authMode === 'register' && (
                      <p className="text-[10px] text-slate-400 mt-1">Min 8 chars, 1 number, 1 special character.</p>
                  )}
                </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2 text-red-600 text-sm animate-shake">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {authMode === 'register' ? "Create Account" : (authMode === 'forgot' ? "Send Reset Link" : "Log In")}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
            
          <div className="mt-6 text-center">
              {/* Fix: Directly use conditional blocks instead of nested ternary to avoid unintentional type narrowing issues */}
              {authMode === 'forgot' && (
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('login')} 
                    className="text-sm font-bold text-indigo-600 hover:underline"
                  >
                    Back to Login
                  </button>
              )}
              {authMode === 'login' && (
                  <p className="text-sm text-slate-500">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => setAuthMode('register')} 
                      className="font-bold text-indigo-600 hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
              )}
              {authMode === 'register' && (
                  <p className="text-sm text-slate-500">
                    Already have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => setAuthMode('login')} 
                      className="font-bold text-indigo-600 hover:underline"
                    >
                      Log In
                    </button>
                  </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
