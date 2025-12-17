
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { User, Job, JobMatch, UserRole } from '../types';
import { MOCK_JOBS } from '../constants';
import { generateJobMatches, generateSyntheticJobs } from '../services/geminiService';
import { Briefcase, MapPin, Sparkles, Building2, User as UserIcon, Search, ArrowUpDown, Bookmark, Linkedin, Plus, X, Image as ImageIcon, ExternalLink, Globe, Bot } from 'lucide-react';

interface JobsProps {
  currentUser: User;
  users: User[];
}

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const parseRelativeDate = (dateStr: string): number => {
    const now = new Date();
    const str = dateStr.toLowerCase();
    
    if (str.includes('just now')) return 0;
    if (str.includes('day')) {
        const days = parseInt(str.split(' ')[0]) || 0;
        return days;
    }
    if (str.includes('week')) {
        const weeks = parseInt(str.split(' ')[0]) || 0;
        return weeks * 7;
    }
    if (str.includes('month')) {
        const months = parseInt(str.split(' ')[0]) || 0;
        return months * 30;
    }
    return 999; // Fallback for old/unknown dates
};

// Internal component for creating jobs
const CreateJobModal = ({ onClose, onSave }: { onClose: () => void, onSave: (e: any) => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    applicationUrl: '',
    companyLogo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
        ...formData,
        requirements: formData.requirements.split(',').map(s => s.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Post a Job</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-slate-400 hover:text-slate-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                />
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Application URL</label>
                <input 
                  type="url"
                  placeholder="https://linkedin.com/jobs/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.applicationUrl}
                  onChange={e => setFormData({...formData, applicationUrl: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Logo URL</label>
                <input 
                  type="url"
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.companyLogo}
                  onChange={e => setFormData({...formData, companyLogo: e.target.value})}
                />
              </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                Description 
                <span className="text-xs text-slate-400 font-normal ml-2">(Supports simple HTML: &lt;b&gt;, &lt;ul&gt;, &lt;li&gt;, etc.)</span>
            </label>
            <textarea 
              required
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="<p>Job description goes here...</p>"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Requirements (comma separated)</label>
            <input 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.requirements}
              onChange={e => setFormData({...formData, requirements: e.target.value})}
              placeholder="React, TypeScript, Communication"
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

const Jobs: React.FC<JobsProps> = ({ currentUser, users }) => {
  const [loading, setLoading] = useState(false);
  const [generatingJobs, setGeneratingJobs] = useState(false);
  const [matches, setMatches] = useState<JobMatch[] | null>(null);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  
  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Bookmarking
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [filterSaved, setFilterSaved] = useState(false);

  // AI Preference State
  const [preferredType, setPreferredType] = useState<string>('');
  const [preferredLocation, setPreferredLocation] = useState<string>('');
  
  // Local Filter State
  const [techFilter, setTechFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [expFilter, setExpFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'Relevance' | 'Date'>('Date');

  // Debounce inputs to optimize large list filtering
  const debouncedTechFilter = useDebounce(techFilter, 300);
  const debouncedIndustryFilter = useDebounce(industryFilter, 300);

  const canPostJob = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.ALUMNI || currentUser.role === UserRole.CREATOR;

  const handleAIMatch = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const preferences = {
        type: preferredType || "Any",
        location: preferredLocation || "Any"
    };
    const results = await generateJobMatches(currentUser, jobs, preferences);
    setMatches(results);
    setLoading(false);
    setSortBy('Relevance'); // Auto-switch to relevance view
  }, [currentUser, loading, preferredType, preferredLocation, jobs]);

  const handleCreateJob = (data: any) => {
      const newJob: Job = {
          id: `j${Date.now()}`,
          ...data,
          postedDate: 'Just now',
          postedByAlumniId: currentUser.id
      };
      setJobs([newJob, ...jobs]);
  };

  const handleAIJobGeneration = async () => {
      if(generatingJobs) return;
      setGeneratingJobs(true);
      const newJobs = await generateSyntheticJobs(jobs);
      if(newJobs.length > 0) {
          setJobs(prev => [...newJobs, ...prev]);
          alert(`Success! AI found ${newJobs.length} new opportunities in the market.`);
      } else {
          alert("AI scan completed. No new specific matches found right now.");
      }
      setGeneratingJobs(false);
  };

  const toggleSave = (id: string) => {
      const newSet = new Set(savedJobIds);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setSavedJobIds(newSet);
  };

  const getJobMatch = (jobId: string) => matches?.find(m => m.jobId === jobId);

  // Memoized filter logic with debounced values
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // Filter Saved
    if (filterSaved) {
        result = result.filter(job => savedJobIds.has(job.id));
    }

    // Filter by Technology (Debounced)
    if (debouncedTechFilter) {
        const term = debouncedTechFilter.toLowerCase();
        result = result.filter(job => 
            job.requirements.some(r => r.toLowerCase().includes(term)) ||
            job.description.toLowerCase().includes(term)
        );
    }

    // Filter by Industry (Debounced)
    if (debouncedIndustryFilter) {
        const term = debouncedIndustryFilter.toLowerCase();
        result = result.filter(job => 
            job.company.toLowerCase().includes(term) ||
            job.description.toLowerCase().includes(term)
        );
    }

    // Filter by Experience Level
    if (expFilter !== 'All') {
        const term = expFilter.toLowerCase();
        if (term === 'internship') {
            result = result.filter(job => job.type === 'Internship' || job.title.toLowerCase().includes('intern'));
        } else if (term === 'entry level' || term === 'junior') {
            result = result.filter(job => 
                job.title.toLowerCase().includes('junior') || 
                job.title.toLowerCase().includes('associate') || 
                job.title.toLowerCase().includes('graduate')
            );
        } else if (term === 'senior') {
            result = result.filter(job => job.title.toLowerCase().includes('senior') || job.title.toLowerCase().includes('lead'));
        }
    }

    // Sorting
    return result.sort((a, b) => {
        if (sortBy === 'Relevance' && matches) {
            const matchA = getJobMatch(a.id);
            const matchB = getJobMatch(b.id);
            const scoreA = matchA?.matchScore || 0;
            const scoreB = matchB?.matchScore || 0;
            if (scoreA !== scoreB) return scoreB - scoreA;
        }
        
        // Date sort
        const daysA = parseRelativeDate(a.postedDate);
        const daysB = parseRelativeDate(b.postedDate);
        return daysA - daysB;
    });

  }, [jobs, matches, debouncedTechFilter, debouncedIndustryFilter, expFilter, sortBy, filterSaved, savedJobIds]);


  return (
    <div className="space-y-6">
      {showCreateModal && <CreateJobModal onClose={() => setShowCreateModal(false)} onSave={handleCreateJob} />}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Jobs & Internships</h2>
          <p className="text-slate-500 text-sm">Find your next career opportunity</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
                <button 
                    onClick={() => setFilterSaved(false)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${!filterSaved ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    All Jobs
                </button>
                <button 
                    onClick={() => setFilterSaved(true)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterSaved ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Saved
                </button>
            </div>

            {/* AI Update Button for Alumni/Creator */}
            {canPostJob && (
                <button 
                    onClick={handleAIJobGeneration}
                    disabled={generatingJobs}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all shadow-sm disabled:opacity-70"
                >
                    {generatingJobs ? <Bot className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                    Scan Market (AI)
                </button>
            )}
            
            {canPostJob && (
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Post Job
                </button>
            )}
        </div>
      </div>

        {/* AI Match Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-2 mb-4 font-semibold text-indigo-300">
                <Sparkles className="w-5 h-5" />
                <span>AI Smart Match</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Preferred Job Type</label>
                    <select 
                        value={preferredType}
                        onChange={(e) => setPreferredType(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white"
                    >
                        <option value="">Any Type</option>
                        <option value="Internship">Internship</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>
                
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Preferred Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={preferredLocation}
                            onChange={(e) => setPreferredLocation(e.target.value)}
                            placeholder="e.g. San Francisco, Remote..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white placeholder-slate-500"
                        />
                    </div>
                </div>

                <button
                    onClick={handleAIMatch}
                    disabled={loading}
                    className={`
                        flex items-center gap-2 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-md transition-all h-[40px] whitespace-nowrap font-medium
                        ${loading ? 'opacity-75 cursor-wait' : ''}
                    `}
                >
                    {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {matches ? 'Update AI Matches' : 'Find Best Matches'}
                </button>
            </div>
        </div>
        
        {/* Standard Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
             <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Filter by technology..."
                    value={techFilter}
                    onChange={(e) => setTechFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
             </div>
             <div className="flex-1 w-full relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Filter by industry..."
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
             </div>
             <div className="w-full md:w-auto">
                 <select 
                    value={expFilter}
                    onChange={(e) => setExpFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                 >
                     <option value="All">All Experience</option>
                     <option value="Internship">Internship</option>
                     <option value="Junior">Junior / Entry</option>
                     <option value="Senior">Senior</option>
                 </select>
             </div>
             <div className="w-full md:w-auto border-l border-slate-200 pl-4">
                 <button 
                   onClick={() => setSortBy(prev => prev === 'Date' ? 'Relevance' : 'Date')}
                   className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                 >
                     <ArrowUpDown className="w-4 h-4" />
                     Sort: {sortBy}
                 </button>
             </div>
        </div>

      <div className="grid gap-6">
        {filteredAndSortedJobs.map((job) => {
          const match = getJobMatch(job.id);
          // Look up user from the dynamic list passed via props
          const alumniPoster = job.postedByAlumniId ? users.find(u => u.id === job.postedByAlumniId) : null;
          const isSaved = savedJobIds.has(job.id);
          const linkedinUrl = job.applicationUrl?.includes('linkedin.com') 
             ? job.applicationUrl 
             : `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title + ' ' + job.company)}`;
          
          const isLinkedInApplication = job.applicationUrl?.toLowerCase().includes('linkedin.com');
          const showCompanyApply = job.applicationUrl && !isLinkedInApplication;

          return (
            <div key={job.id} className={`bg-white rounded-xl p-6 shadow-sm border ${match ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-100'} hover:shadow-md transition-all relative overflow-hidden animate-fade-in`}>
               {match && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                  {match.matchScore}% Match
                </div>
              )}
              
              {/* Bookmark Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
                    isSaved ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                }`}
                title={isSaved ? "Remove from saved" : "Save job"}
              >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo Section */}
                <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100 overflow-hidden relative">
                  {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1" />
                  ) : (
                      <Building2 className="w-8 h-8 text-slate-400" />
                  )}
                  {job.isAiGenerated && (
                      <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[9px] px-1 font-bold">AI</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2 pr-10">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                      <p className="text-slate-600 font-medium text-lg">{job.company}</p>
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

                  {/* Rich Text Description */}
                  <div 
                    className="text-slate-600 text-sm mb-4 prose prose-sm max-w-none prose-ul:list-disc prose-ul:pl-4 prose-p:mb-2"
                    dangerouslySetInnerHTML={{ __html: job.description }} 
                  />
                  
                  {match && (
                    <div className="bg-indigo-50 p-3 rounded-lg mb-4 text-sm text-indigo-800 flex gap-2 items-start border border-indigo-100">
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
                    ) : (job.isAiGenerated ? (
                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                           <Bot className="w-4 h-4" />
                           <span>Sourced by AI Market Scan</span>
                        </div>
                    ) : <div></div>)}
                    
                    <div className="flex gap-2">
                         {/* Apply via LinkedIn Button - Always visible, links to direct app or search */}
                         <a 
                            href={linkedinUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="px-4 py-2 bg-[#0077b5] hover:bg-[#006097] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                         >
                            <Linkedin className="w-4 h-4" />
                            Apply via LinkedIn
                         </a>
                         
                         {/* Apply Via Company Website Button - Only if URL exists and is NOT LinkedIn */}
                         {showCompanyApply && (
                             <a 
                                href={job.applicationUrl}
                                target="_blank" 
                                rel="noreferrer"
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                             >
                               <Globe className="w-4 h-4" />
                               Apply via Company Website
                             </a>
                         )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredAndSortedJobs.length === 0 && (
            <div className="text-center py-12 text-slate-500">
                {filterSaved ? "You haven't saved any jobs yet." : "No jobs match your current filters."}
            </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
