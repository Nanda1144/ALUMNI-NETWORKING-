
import React from 'react';
import { GraduationCap, Building2, Users, ArrowRight, ShieldCheck, TrendingUp, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: (mode: 'login' | 'register') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">N</div>
          <span className="text-xl font-bold text-slate-900">AlumNexus</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => onGetStarted('login')}
            className="px-4 py-2 text-slate-600 font-medium hover:text-indigo-600 transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => onGetStarted('register')}
            className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-16 pb-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6 border border-indigo-100">
          <ShieldCheck className="w-4 h-4" /> Trusted by Leading Institutions
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          Bridge the Gap Between <br/>
          <span className="text-indigo-600">Education</span> and <span className="text-indigo-600">Industry</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          The all-in-one platform for Universities to foster mentorship, track alumni success, and connect students with their dream careers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onGetStarted('register')}
            className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
          >
            Join Your Network <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onGetStarted('login')}
            className="px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center"
          >
            Existing Member Login
          </button>
        </div>
      </header>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Join AlumNexus?</h2>
            <p className="text-slate-500">Tailored features for every member of the academic ecosystem.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Students</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>Access exclusive internships & jobs posted by alumni.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span>AI-powered mentorship matching with industry pros.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  <span><strong>Requirement:</strong> Must register with valid college email (.edu).</span>
                </li>
              </ul>
            </div>

            {/* Alumni Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Alumni</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-indigo-500 flex-shrink-0" />
                  <span>Give back by mentoring the next generation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-indigo-500 flex-shrink-0" />
                  <span>Network with fellow alumni in your industry.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-indigo-500 flex-shrink-0" />
                  <span>Recruit top talent directly from your alma mater.</span>
                </li>
              </ul>
            </div>

            {/* Institution Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Institutions</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-emerald-500 flex-shrink-0" />
                  <span>Track alumni career progression and statistics.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-emerald-500 flex-shrink-0" />
                  <span>Manage events, reunions, and fundraising.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-emerald-500 flex-shrink-0" />
                  <span>Centralized database with automated updates.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
                <p className="text-4xl font-bold text-indigo-600 mb-2">500+</p>
                <p className="text-slate-500 font-medium">Partner Colleges</p>
            </div>
            <div>
                <p className="text-4xl font-bold text-indigo-600 mb-2">1M+</p>
                <p className="text-slate-500 font-medium">Alumni Connected</p>
            </div>
            <div>
                <p className="text-4xl font-bold text-indigo-600 mb-2">50k+</p>
                <p className="text-slate-500 font-medium">Mentorships Created</p>
            </div>
            <div>
                <p className="text-4xl font-bold text-indigo-600 mb-2">98%</p>
                <p className="text-slate-500 font-medium">Student Satisfaction</p>
            </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
        <p>© 2024 AlumNexus Inc. All rights reserved.</p>
        <p className="mt-2">Connecting the future, today.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
