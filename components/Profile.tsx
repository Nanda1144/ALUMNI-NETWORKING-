import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { analyzeProfileImprovements, generateProfileSummary, syncExternalProfileData } from '../services/geminiService';
import { Sparkles, Edit2, AlertCircle, CheckCircle, Save, X, Brain, Download, Github, Linkedin, Twitter, Globe, Lock, Eye, EyeOff, Search, FileText, RefreshCw, Award, ArrowLeft, FolderGit2, ExternalLink, CalendarClock, Fingerprint, Trophy, TrendingUp } from 'lucide-react';
import { jsPDF } from "jspdf";

interface ProfileProps {
  user: User;
  onNavigateToDirectory?: (skill: string) => void;
  onUpdateUser?: (user: User) => void;
  isReadOnly?: boolean;
  onBack?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onNavigateToDirectory, onUpdateUser, isReadOnly = false, onBack }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    completeness: number;
    suggestions: { text: string; relatedSkills: string[] }[];
    missingFields: string[];
  } | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(user.preferences?.analysisReminder || false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData(user);
    setReminderEnabled(user.preferences?.analysisReminder || false);
  }, [user]);

  const handleAnalyze = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    const result = await analyzeProfileImprovements(formData);
    setAnalysis(result);
    setAnalyzing(false);
  };

  const handleGenerateSummary = async () => {
    if (generatingSummary) return;
    setGeneratingSummary(true);
    const result = await generateProfileSummary(formData);
    setSummary(result);
    setGeneratingSummary(false);
  }

  const handleSync = async (platform: string, url: string) => {
      if(!url) return;
      setSyncing(platform);
      const { newSkills, newCertifications } = await syncExternalProfileData(formData, platform, url);
      setFormData(prev => ({
          ...prev,
          skills: Array.from(new Set([...prev.skills, ...newSkills])),
          certifications: Array.from(new Set([...(prev.certifications || []), ...newCertifications]))
      }));
      setSyncing(null);
  };

  const handleSave = () => {
    if (onUpdateUser) {
        onUpdateUser(formData);
    }
    setIsEditing(false);
    setAnalysis(null);
    setSummary(''); 
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSocialChange = (key: string, value: string) => {
    setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
      setFormData(prev => ({
          ...prev,
          privacySettings: {
              ...(prev.privacySettings || { showEmail: true, showCompany: true, showSocials: true }),
              [key]: value
          }
      }));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(formData.name, 20, 20);
    doc.save(`alumnexus_profile_${formData.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  const getStrengthLevel = (score: number) => {
    if (score >= 90) return { label: 'All-Star', textColor: 'text-amber-400', barColor: 'bg-gradient-to-r from-amber-400 to-orange-500', icon: Trophy, baseColor: 'amber' };
    if (score >= 70) return { label: 'Expert', textColor: 'text-emerald-400', barColor: 'bg-gradient-to-r from-emerald-400 to-teal-500', icon: Award, baseColor: 'emerald' };
    if (score >= 40) return { label: 'Intermediate', textColor: 'text-blue-400', barColor: 'bg-gradient-to-r from-blue-400 to-indigo-500', icon: TrendingUp, baseColor: 'blue' };
    return { label: 'Beginner', textColor: 'text-slate-300', barColor: 'bg-slate-500', icon: Sparkles, baseColor: 'slate' };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {isReadOnly && onBack && (
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-2 font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to Directory
          </button>
      )}

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-visible">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl"></div>
        <div className="relative pt-16 flex flex-col md:flex-row items-end gap-6">
          <img src={formData.avatar} alt={formData.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white" />
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{formData.name}</h1>
            {isEditing ? (
              <div className="flex gap-2 mt-2">
                 <input type="text" value={formData.jobTitle || ''} onChange={(e) => handleChange('jobTitle', e.target.value)} placeholder="Job Title" className="px-2 py-1 border border-slate-300 rounded text-sm w-full md:w-auto" />
                 <input type="text" value={formData.company || ''} onChange={(e) => handleChange('company', e.target.value)} placeholder="Company" className="px-2 py-1 border border-slate-300 rounded text-sm w-full md:w-auto" />
              </div>
            ) : (
              <p className="text-slate-600 font-medium">{formData.jobTitle || formData.role} {formData.company && `• ${formData.company}`} • Class of {formData.graduationYear}</p>
            )}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs font-mono text-slate-600">
                <Fingerprint className="w-3.5 h-3.5" />
                <span>ID: {formData.id}</span>
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            {!isReadOnly && (
                isEditing ? (
                <>
                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                    <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">
                    <X className="w-4 h-4" /> Cancel
                    </button>
                </>
                ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
                    <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
                )
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">About</h3>
             {isEditing ? (
               <textarea value={formData.bio} onChange={(e) => handleChange('bio', e.target.value)} className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Tell us about yourself..." />
             ) : (
               <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{formData.bio}</p>
             )}
             <div className="mt-6">
                 <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Online Presence</h3>
                 <div className="flex flex-col gap-2">
                     {isEditing ? (
                         <>
                             <div className="flex items-center gap-2">
                                 <Linkedin className="w-4 h-4 text-slate-400" />
                                 <input className="flex-1 px-2 py-1 text-sm border rounded" placeholder="LinkedIn URL" value={formData.socialLinks?.linkedin || ''} onChange={(e) => handleSocialChange('linkedin', e.target.value)} />
                                 <button onClick={() => handleSync('LinkedIn', formData.socialLinks?.linkedin || '')} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded">
                                    <RefreshCw className={`w-4 h-4 ${syncing === 'LinkedIn' ? 'animate-spin' : ''}`} />
                                 </button>
                             </div>
                             <div className="flex items-center gap-2">
                                 <Github className="w-4 h-4 text-slate-400" />
                                 <input className="flex-1 px-2 py-1 text-sm border rounded" placeholder="GitHub URL" value={formData.socialLinks?.github || ''} onChange={(e) => handleSocialChange('github', e.target.value)} />
                             </div>
                         </>
                     ) : (
                         <div className="flex gap-4">
                             {formData.socialLinks?.linkedin && <a href={`https://${formData.socialLinks.linkedin}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-600"><Linkedin className="w-5 h-5" /></a>}
                             {formData.socialLinks?.github && <a href={`https://${formData.socialLinks.github}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900"><Github className="w-5 h-5" /></a>}
                         </div>
                     )}
                 </div>
             </div>
          </div>
          <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills</h3>
                {isEditing ? (
                  <input type="text" value={formData.skills.join(', ')} onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full p-2 border border-slate-300 rounded-lg text-sm" placeholder="React, TypeScript, Design" />
                ) : (
                  <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">{skill}</span>
                      ))}
                  </div>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Award className="w-4 h-4" /> Certifications</h3>
                {isEditing ? (
                  <input type="text" value={(formData.certifications || []).join(', ')} onChange={(e) => handleChange('certifications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full p-2 border border-slate-300 rounded-lg text-sm" placeholder="AWS Certified" />
                ) : (
                  <div className="flex flex-col gap-2">
                      {(formData.certifications || []).map((cert, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />{cert}</div>
                      ))}
                  </div>
                )}
            </div>
            {!isReadOnly && (
                <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Lock className="w-3 h-3" /> Privacy Settings</h3>
                    <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Show Email</span>
                            {isEditing ? (
                                <input type="checkbox" checked={formData.privacySettings?.showEmail ?? true} onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)} />
                            ) : (
                                (formData.privacySettings?.showEmail ?? true) ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />
                            )}
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
         <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Brain className="w-6 h-6 text-violet-500" /> Professional Summary</h2>
           {!isReadOnly && (
             <button onClick={handleGenerateSummary} disabled={generatingSummary} className="text-sm text-violet-600 font-medium hover:text-violet-700 disabled:opacity-50">
                {generatingSummary ? 'Generating...' : 'Generate with AI'}
             </button>
           )}
         </div>
         {summary ? (
           <div className="p-4 bg-violet-50 rounded-xl border border-violet-100 text-slate-700 leading-relaxed"><p>{summary}</p></div>
         ) : (
           <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <p className="text-slate-500 text-sm">Use Gemini AI to instantly create a professional summary.</p>
           </div>
         )}
      </div>

      {!isReadOnly && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="w-6 h-6 text-yellow-400" /> AI Profile Optimization</h2>
                    <p className="text-slate-400 mt-1">Get personalized suggestions to improve your profile.</p>
                </div>
                <button onClick={handleAnalyze} disabled={analyzing} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold shadow-lg transition-all active:scale-95 flex items-center gap-2">
                    {analyzing ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />} Analyze My Profile
                </button>
            </div>
            {analysis && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in relative z-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="font-semibold text-slate-300 text-sm uppercase tracking-wider">Strength: {analysis.completeness}%</h3>
                        <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden mt-4">
                            <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ width: `${analysis.completeness}%` }}></div>
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-indigo-300"><Sparkles className="w-4 h-4" /> Suggestions</h3>
                            <ul className="space-y-4">
                                {analysis.suggestions.map((s, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex items-start gap-3"><span className="mt-1 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0"></span>{s.text}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Profile;