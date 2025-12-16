import React, { useState, useCallback } from 'react';
import { User, MentorshipMatch, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { generateMentorshipMatches } from '../services/geminiService';
import { Sparkles, ArrowRight, MessageSquare, BrainCircuit, Target } from 'lucide-react';

interface MentorshipProps {
  currentUser: User;
}

const Mentorship: React.FC<MentorshipProps> = ({ currentUser }) => {
  const [matches, setMatches] = useState<MentorshipMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusArea, setFocusArea] = useState('');

  const handleFindMentors = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    
    // Filter alumni only
    const potentialMentors = MOCK_USERS.filter(u => u.role === UserRole.ALUMNI);
    
    const results = await generateMentorshipMatches(currentUser, potentialMentors, focusArea);
    setMatches(results);
    setLoading(false);
  }, [currentUser, loading, focusArea]);

  const getMentorDetails = (id: string) => MOCK_USERS.find(u => u.id === id);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <BrainCircuit className="w-8 h-8" />
            AI Mentorship Matching
          </h2>
          <p className="text-indigo-100 mb-6 text-lg">
            Leverage Gemini AI to analyze your skills and find the perfect alumni mentor.
          </p>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 mb-6">
            <label className="block text-sm font-medium text-indigo-100 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              What is your specific goal? (Optional)
            </label>
            <input 
              type="text" 
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="e.g. Preparing for technical interviews, exploring product management, etc."
              className="w-full px-4 py-2 bg-white/20 border border-indigo-400/30 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <button
            onClick={handleFindMentors}
            disabled={loading}
            className={`
              flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold shadow-lg 
              transition-all duration-200 hover:bg-indigo-50 active:scale-95
              ${loading ? 'opacity-75 cursor-wait' : ''}
            `}
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Analyzing Profiles...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Find My Mentor
              </>
            )}
          </button>
        </div>
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {matches && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-xl font-bold text-slate-800">Top Recommendations</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {matches.map((match, idx) => {
              const mentor = getMentorDetails(match.mentorId);
              if (!mentor) return null;

              return (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100" />
                        <div>
                          <h4 className="font-bold text-slate-900">{mentor.name}</h4>
                          <p className="text-xs text-slate-500">{mentor.jobTitle} at {mentor.company}</p>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                        {match.matchScore}% Match
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-slate-600 italic border-l-2 border-indigo-300 pl-3 py-1 bg-indigo-50 rounded-r-md">
                        "{match.reason}"
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Discussion Topics</p>
                      <ul className="space-y-1">
                        {match.suggestedTopics.map((topic, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      Request Mentorship
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!matches && !loading && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Ready to Connect?</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2">
            Our AI analyzes thousands of alumni profiles to find mentors who align with your specific career trajectory and interests.
          </p>
        </div>
      )}
    </div>
  );
};

export default Mentorship;