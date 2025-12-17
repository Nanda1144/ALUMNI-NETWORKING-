
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { analyzeProfileImprovements, generateProfileSummary, syncExternalProfileData } from '../services/geminiService';
import { Sparkles, Edit2, AlertCircle, CheckCircle, Save, X, Brain, Download, Github, Linkedin, Twitter, Globe, Lock, Eye, EyeOff, Search, FileText, RefreshCw, Award, ArrowLeft, FolderGit2, ExternalLink, CalendarClock, Fingerprint } from 'lucide-react';
import { jsPDF } from "jspdf";

interface ProfileProps {
  user: User;
  onNavigateToDirectory?: (skill: string) => void;
  isReadOnly?: boolean;
  onBack?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onNavigateToDirectory, isReadOnly = false, onBack }) => {
  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    completeness: number;
    suggestions: { text: string; relatedSkills: string[] }[];
    missingFields: string[];
  } | null>(null);

  // Summary State
  const [summary, setSummary] = useState<string>('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  // Sync State
  const [syncing, setSyncing] = useState<string | null>(null);

  // Reminder State
  const [reminderEnabled, setReminderEnabled] = useState(user.preferences?.analysisReminder || false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    // Reset form data if user prop changes
    setFormData(user);
    setReminderEnabled(user.preferences?.analysisReminder || false);
  }, [user]);

  const handleAnalyze = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    const result = await analyzeProfileImprovements(formData); // Analyze the potentially edited data
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
      if (newSkills.length > 0 || newCertifications.length > 0) {
        alert(`Synced Successfully from ${platform}!\n\nAdded Skills: ${newSkills.join(', ') || 'None'}\nAdded Certifications: ${newCertifications.join(', ') || 'None'}`);
      } else {
        alert(`Sync Complete. No new relevant data found to add from your ${platform} profile based on current context.`);
      }
  };

  const toggleReminder = () => {
      const newState = !reminderEnabled;
      setReminderEnabled(newState);
      if (newState) {
        alert("📅 Monthly Reminder Set! We will notify you to re-run your profile analysis in 30 days.");
      } else {
        alert("Monthly reminder cancelled.");
      }
  };

  const handleSave = () => {
    // In a real app, dispatch an update action to the backend here
    console.log("Saving user data:", formData);
    setIsEditing(false);
    // Invalidate analysis since data changed
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
        socialLinks: {
            ...prev.socialLinks,
            [key]: value
        }
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

  const exportCSV = () => {
      // Create CSV content
      const headers = ['Name', 'Role', 'Email', 'Department', 'Company', 'Job Title', 'Skills', 'Certifications', 'Bio', 'LinkedIn', 'GitHub'];
      const skillsStr = formData.skills.join('; ');
      const certsStr = (formData.certifications || []).join('; ');
      const row = [
          `"${formData.name}"`,
          `"${formData.role}"`,
          `"${formData.email}"`,
          `"${formData.department || ''}"`,
          `"${formData.company || ''}"`,
          `"${formData.jobTitle || ''}"`,
          `"${skillsStr}"`,
          `"${certsStr}"`,
          `"${formData.bio.replace(/"/g, '""')}"`, // Escape quotes in bio
          `"${formData.socialLinks?.linkedin || ''}"`,
          `"${formData.socialLinks?.github || ''}"`
      ];

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), row.join(',')].join('\n');
      
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", csvContent);
      downloadAnchorNode.setAttribute("download", `alumnexus_profile_${formData.name.replace(/\s+/g, '_').toLowerCase()}.csv`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = 20;

    // Title / Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(formData.name, margin, yPos);
    yPos += 10;

    // Subtitle / Role
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100);
    const roleText = `${formData.role}${formData.jobTitle ? ` | ${formData.jobTitle}` : ''}`;
    doc.text(roleText, margin, yPos);
    yPos += 6;
    if (formData.company) {
        doc.text(`@ ${formData.company}`, margin, yPos);
        yPos += 6;
    }
    yPos += 4;

    // Contact
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Email: ${formData.email}`, margin, yPos);
    yPos += 6;
    if (formData.location) {
        doc.text(`Location: ${formData.location}`, margin, yPos);
        yPos += 6;
    }
    
    // Bio
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Professional Summary", margin, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    const splitBio = doc.splitTextToSize(formData.bio, 170); // Wrap text
    doc.text(splitBio, margin, yPos);
    yPos += (splitBio.length * 5) + 10;

    // Skills
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Skills", margin, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(formData.skills.join(", "), margin, yPos);
    yPos += 15;

    // Certifications
    if (formData.certifications && formData.certifications.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Certifications", margin, yPos);
        yPos += 8;
    
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.text(formData.certifications.join(", "), margin, yPos);
        yPos += 15;
    }

    doc.save(`alumnexus_profile_${formData.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Read Only Header */}
      {isReadOnly && onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-2 font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Directory
          </button>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-visible">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl"></div>
        <div className="absolute top-4 right-4 flex gap-2">
            <button 
                onClick={exportPDF}
                className="bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 text-sm font-medium border border-white/20 shadow-sm"
                title="Export Profile as PDF"
            >
                <FileText className="w-4 h-4" />
                PDF
            </button>
            <button 
                onClick={exportCSV}
                className="bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 text-sm font-medium border border-white/20 shadow-sm"
                title="Export Profile Data as CSV"
            >
                <Download className="w-4 h-4" />
                CSV
            </button>
        </div>
        
        <div className="relative pt-16 flex flex-col md:flex-row items-end gap-6">
          <img 
            src={formData.avatar} 
            alt={formData.name} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
          />
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{formData.name}</h1>
            
            {isEditing ? (
              <div className="flex gap-2 mt-2">
                 <input 
                  type="text" 
                  value={formData.jobTitle || ''} 
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  placeholder="Job Title"
                  className="px-2 py-1 border border-slate-300 rounded text-sm w-full md:w-auto"
                />
                <span className="text-slate-400 py-1">•</span>
                 <input 
                  type="text" 
                  value={formData.company || ''} 
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Company"
                  className="px-2 py-1 border border-slate-300 rounded text-sm w-full md:w-auto"
                />
              </div>
            ) : (
              <p className="text-slate-600 font-medium">{formData.jobTitle || formData.role} {formData.company && `• ${formData.company}`} • Class of {formData.graduationYear}</p>
            )}

            {/* Unique ID Display */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs font-mono text-slate-600" title="This is your unique platform ID">
                <Fingerprint className="w-3.5 h-3.5" />
                <span>ID: {formData.id}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mb-2">
            {!isReadOnly && (
                isEditing ? (
                <>
                    <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                    <Save className="w-4 h-4" /> Save
                    </button>
                    <button 
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                    <X className="w-4 h-4" /> Cancel
                    </button>
                </>
                ) : (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
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
               <textarea
                 value={formData.bio}
                 onChange={(e) => handleChange('bio', e.target.value)}
                 className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm leading-relaxed"
                 placeholder="Tell us about yourself..."
               />
             ) : (
               <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{formData.bio}</p>
             )}
             
             {/* Social Links Section */}
             <div className="mt-6">
                 <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Online Presence</h3>
                 <div className="flex flex-col gap-2">
                     {isEditing ? (
                         <>
                             <div className="flex items-center gap-2">
                                 <Linkedin className="w-4 h-4 text-slate-400" />
                                 <input 
                                    className="flex-1 px-2 py-1 text-sm border rounded border-slate-200" 
                                    placeholder="LinkedIn URL"
                                    value={formData.socialLinks?.linkedin || ''}
                                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                />
                                <button 
                                    onClick={() => handleSync('LinkedIn', formData.socialLinks?.linkedin || '')}
                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                                    title="Sync Skills from LinkedIn"
                                >
                                    <RefreshCw className={`w-4 h-4 ${syncing === 'LinkedIn' ? 'animate-spin' : ''}`} />
                                </button>
                             </div>
                             <div className="flex items-center gap-2">
                                 <Github className="w-4 h-4 text-slate-400" />
                                 <input 
                                    className="flex-1 px-2 py-1 text-sm border rounded border-slate-200" 
                                    placeholder="GitHub URL"
                                    value={formData.socialLinks?.github || ''}
                                    onChange={(e) => handleSocialChange('github', e.target.value)}
                                />
                                <button 
                                    onClick={() => handleSync('GitHub', formData.socialLinks?.github || '')}
                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                                    title="Sync Skills from GitHub"
                                >
                                    <RefreshCw className={`w-4 h-4 ${syncing === 'GitHub' ? 'animate-spin' : ''}`} />
                                </button>
                             </div>
                             <div className="flex items-center gap-2">
                                 <Globe className="w-4 h-4 text-slate-400" />
                                 <input 
                                    className="flex-1 px-2 py-1 text-sm border rounded border-slate-200" 
                                    placeholder="Portfolio URL"
                                    value={formData.socialLinks?.portfolio || ''}
                                    onChange={(e) => handleSocialChange('portfolio', e.target.value)}
                                />
                             </div>
                         </>
                     ) : (
                         <div className="flex gap-4">
                             {formData.socialLinks?.linkedin && <a href={`https://${formData.socialLinks.linkedin}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-600"><Linkedin className="w-5 h-5" /></a>}
                             {formData.socialLinks?.github && <a href={`https://${formData.socialLinks.github}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900"><Github className="w-5 h-5" /></a>}
                             {formData.socialLinks?.twitter && <a href={`https://${formData.socialLinks.twitter}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-sky-500"><Twitter className="w-5 h-5" /></a>}
                             {formData.socialLinks?.portfolio && <a href={`https://${formData.socialLinks.portfolio}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-emerald-600"><Globe className="w-5 h-5" /></a>}
                             {!formData.socialLinks && <span className="text-sm text-slate-400 italic">No social links added</span>}
                         </div>
                     )}
                 </div>
             </div>
          </div>
          
          <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Department</h3>
                <p className="text-slate-800">{formData.department}</p>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={formData.skills.join(', ')} 
                      onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                      placeholder="React, TypeScript, Design (comma separated)"
                    />
                    <p className="text-xs text-slate-400">Separate skills with commas</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                              {skill}
                          </span>
                      ))}
                  </div>
                )}
            </div>
            
            <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                   <Award className="w-4 h-4" /> Certifications
                </h3>
                {isEditing ? (
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={(formData.certifications || []).join(', ')} 
                      onChange={(e) => handleChange('certifications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                      placeholder="AWS Certified, Google Data Analytics (comma separated)"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                      {formData.certifications && formData.certifications.length > 0 ? (
                          formData.certifications.map((cert, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                  {cert}
                              </div>
                          ))
                      ) : (
                          <p className="text-sm text-slate-400 italic">No certifications added</p>
                      )}
                  </div>
                )}
            </div>

            {/* Privacy Settings - Hide in Read Only */}
            {!isReadOnly && (
                <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Privacy Settings
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Show Email</span>
                            {isEditing ? (
                                <input 
                                    type="checkbox" 
                                    checked={formData.privacySettings?.showEmail ?? true}
                                    onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                                />
                            ) : (
                                (formData.privacySettings?.showEmail ?? true) ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Show Company</span>
                            {isEditing ? (
                                <input 
                                    type="checkbox" 
                                    checked={formData.privacySettings?.showCompany ?? true}
                                    onChange={(e) => handlePrivacyChange('showCompany', e.target.checked)}
                                />
                            ) : (
                                (formData.privacySettings?.showCompany ?? true) ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />
                            )}
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      {formData.projects && formData.projects.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                 <FolderGit2 className="w-6 h-6 text-indigo-600" />
                 Projects & Portfolio
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {formData.projects.map(project => (
                     <div key={project.id} className="border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        {project.imageUrl && (
                            <div className="h-40 bg-slate-100 relative">
                                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-slate-900 mb-1">{project.title}</h3>
                                {project.link && (
                                    <a href={`https://${project.link}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                     </div>
                 ))}
             </div>
          </div>
      )}

      {/* AI Summary Section - Hide Buttons in Read Only if needed, but summary usually public-ish. Let's show existing summary but hide regen */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
         <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <Brain className="w-6 h-6 text-violet-500" />
             Professional Summary
           </h2>
           {!isReadOnly && (
             <button 
                onClick={handleGenerateSummary}
                disabled={generatingSummary}
                className="text-sm text-violet-600 font-medium hover:text-violet-700 disabled:opacity-50"
             >
                {generatingSummary ? 'Generating...' : summary ? 'Regenerate Summary' : 'Generate with AI'}
             </button>
           )}
         </div>
         
         {summary ? (
           <div className="p-4 bg-violet-50 rounded-xl border border-violet-100 text-slate-700 leading-relaxed relative">
             <Sparkles className="w-4 h-4 text-violet-400 absolute top-4 left-4" />
             <p className="pl-6">{summary}</p>
           </div>
         ) : (
           <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <p className="text-slate-500 text-sm">
               {isReadOnly ? "No summary available." : "Use Gemini AI to instantly create a professional summary based on your profile details."}
             </p>
           </div>
         )}
      </div>

      {/* AI Analysis Section - Only for Owner */}
      {!isReadOnly && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                        AI Profile Optimization
                    </h2>
                    <p className="text-slate-400 mt-1">Get personalized suggestions to improve your profile visibility for recruiters and mentors.</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Reminder Toggle */}
                    <button
                        onClick={toggleReminder}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                            reminderEnabled 
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' 
                            : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                        }`}
                        title="Schedule a monthly reminder to re-run AI analysis"
                    >
                        <CalendarClock className="w-4 h-4" />
                        {reminderEnabled ? 'Reminder Active' : 'Set Monthly Reminder'}
                    </button>

                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className={`
                            px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold shadow-lg transition-all active:scale-95 flex items-center gap-2
                            ${analyzing ? 'opacity-75 cursor-wait' : ''}
                        `}
                    >
                        {analyzing ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {analysis ? 'Re-Analyze Profile' : 'Analyze My Profile'}
                    </button>
                </div>
            </div>

            {analysis && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in relative z-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex flex-col items-center justify-center">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-slate-700"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                                <path
                                    className={`${analysis.completeness > 80 ? 'text-emerald-500' : analysis.completeness > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                    strokeDasharray={`${analysis.completeness}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                            </svg>
                            <span className="absolute text-2xl font-bold">{analysis.completeness}%</span>
                        </div>
                        <span className="mt-2 font-medium text-slate-300">Profile Completeness</span>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        {analysis.suggestions.length > 0 && (
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-indigo-300">
                                    <Sparkles className="w-4 h-4" /> Suggested Improvements
                                </h3>
                                <ul className="space-y-4">
                                    {analysis.suggestions.map((s, i) => (
                                        <li key={i} className="flex flex-col gap-2">
                                            <div className="flex items-start gap-3 text-slate-300 text-sm">
                                                <span className="mt-1 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0"></span>
                                                {s.text}
                                            </div>
                                            {s.relatedSkills && s.relatedSkills.length > 0 && (
                                                <div className="pl-5 flex flex-wrap gap-2">
                                                    {s.relatedSkills.map(skill => (
                                                        <button 
                                                            key={skill}
                                                            onClick={() => onNavigateToDirectory && onNavigateToDirectory(skill)}
                                                            className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 rounded text-xs text-indigo-200 transition-colors"
                                                        >
                                                            <Search className="w-3 h-3" />
                                                            Find Alumni with "{skill}"
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {analysis.missingFields.length > 0 && (
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-rose-300">
                                    <AlertCircle className="w-4 h-4" /> Missing Information
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.missingFields.map((field, i) => (
                                        <span key={i} className="px-2 py-1 bg-rose-500/20 text-rose-200 rounded text-xs border border-rose-500/30">
                                            {field}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {analysis.suggestions.length === 0 && analysis.missingFields.length === 0 && (
                            <div className="bg-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/30 flex items-center gap-4">
                                <CheckCircle className="w-8 h-8 text-emerald-400" />
                                <div>
                                    <h3 className="font-bold text-emerald-100">Excellent Profile!</h3>
                                    <p className="text-emerald-200/80 text-sm">Your profile is comprehensive and stands out.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Profile;
