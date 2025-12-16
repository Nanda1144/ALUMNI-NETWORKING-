import React, { useState, useCallback } from 'react';
import { User, Job, JobMatch } from '../types';
import { MOCK_JOBS, MOCK_USERS } from '../constants';
import { generateJobMatches } from '../services/geminiService';
import { Briefcase, MapPin, Sparkles, Building2, User as UserIcon, Filter } from 'lucide-react';

interface JobsProps {
  currentUser: User;
}

const Jobs: React.FC<JobsProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<JobMatch[] | null>(null);
  
  // Preferences State
  const [preferredType, setPreferredType] = useState<string>('');
  const [preferredLocation, setPreferredLocation] = useState<string>('');

  const handleAIMatch = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const preferences = {
        type: preferredType || "Any",
        location: preferredLocation || "Any"
    };
    const results = await generateJobMatches(currentUser, MOCK_JOBS, preferences);
    setMatches(results);
    setLoading(false);
  }, [currentUser, loading, preferredType, preferredLocation]);

  const getJobMatch = (jobId: string) => matches?.find(m => m.jobId === jobId);

  // Sort jobs: if matches exist, put matched ones first sorted by score
  const sortedJobs = [...MOCK_JOBS].sort((a, b) => {
    if (!matches) return 0;
    const matchA = getJobMatch(a.id);
    const matchB = getJobMatch(b.id);
    const scoreA = matchA?.matchScore || 0;
    const scoreB = matchB?.matchScore || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Jobs & Internships</h2>
          <p className="text-slate-500 text-sm">Find your next career opportunity</p>
        </div>

        {/* AI Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>AI Recommendation Preferences</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Preferred Job Type</label>
                    <select 
                        value={preferredType}
                        onChange={(e) => setPreferredType(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                        <option value="">Any Type</option>
                        <option value="Internship">Internship</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>
                
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Preferred Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={preferredLocation}
                            onChange={(e) => setPreferredLocation(e.target.value)}
                            placeholder="e.g. San Francisco, Remote..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>
                </div>

                <button
                    onClick={handleAIMatch}
                    disabled={loading}
                    className={`
                        flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all h-[40px] whitespace-nowrap
                        ${loading ? 'opacity-75 cursor-wait' : ''}
                    `}
                >
                    {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {matches ? 'Update Matches' : 'Find Best Matches'}
                </button>
            </div>
        </div>
      </div>

      <div className="grid gap-6">
        {sortedJobs.map((job) => {
          const match = getJobMatch(job.id);
          const alumniPoster = job.postedByAlumniId ? MOCK_USERS.find(u => u.id === job.postedByAlumniId) : null;

          return (
            <div key={job.id} className={`bg-white rounded-xl p-6 shadow-sm border ${match ? 'border-pink-200 ring-1 ring-pink-100' : 'border-slate-100'} hover:shadow-md transition-all relative overflow-hidden`}>
               {match && (
                <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  {match.matchScore}% Match
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-slate-500" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                      <p className="text-slate-600 font-medium">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                      <Briefcase className="w-3 h-3" /> {job.type}
                    </span>
                    <span className="text-slate-400">• Posted {job.postedDate}</span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4">{job.description}</p>
                  
                  {match && (
                    <div className="bg-pink-50 p-3 rounded-lg mb-4 text-sm text-pink-800 flex gap-2 items-start border border-pink-100">
                      <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold">AI Insight:</span> {match.reason}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.map((req, i) => (
                      <span key={i} className="px-2 py-1 border border-slate-200 rounded text-xs text-slate-600 bg-slate-50">
                        {req}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    {alumniPoster ? (
                       <div className="flex items-center gap-2 text-sm text-slate-600">
                          <UserIcon className="w-4 h-4 text-indigo-500" />
                          <span>Posted by <span className="font-medium text-slate-900">{alumniPoster.name}</span> (Alumni)</span>
                       </div>
                    ) : <div></div>}
                    
                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Jobs;