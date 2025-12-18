
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Users, Calendar, Briefcase, GraduationCap, Sparkles, Newspaper, TrendingUp, RefreshCw, ChevronRight } from 'lucide-react';
import { User, UserRole } from '../types';
import { generateCommunityNews, CommunityNews } from '../services/geminiService';

interface DashboardProps {
  users?: User[];
}

const dataEngagement = [
  { name: 'Jan', active: 400 },
  { name: 'Feb', active: 300 },
  { name: 'Mar', active: 600 },
  { name: 'Apr', active: 800 },
  { name: 'May', active: 500 },
  { name: 'Jun', active: 900 },
];

const dataIndustry = [
  { name: 'Tech', value: 400 },
  { name: 'Finance', value: 300 },
  { name: 'Health', value: 300 },
  { name: 'Arts', value: 200 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'];

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ users = [] }) => {
  const [news, setNews] = useState<CommunityNews[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);

  const fetchNews = async () => {
    setLoadingNews(true);
    const results = await generateCommunityNews();
    setNews(results);
    setLoadingNews(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const alumniCount = useMemo(() => users.filter(u => u.role === UserRole.ALUMNI).length, [users]);
  const studentCount = useMemo(() => users.filter(u => u.role === UserRole.STUDENT).length, [users]);

  const displayAlumni = alumniCount > 0 ? alumniCount : 12450; 
  const displayStudents = studentCount > 0 ? studentCount : 8500;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Alumni" value={displayAlumni} icon={Users} color="bg-indigo-600" />
        <StatCard title="Active Students" value={displayStudents} icon={GraduationCap} color="bg-blue-500" />
        <StatCard title="Events This Month" value="8" icon={Calendar} color="bg-emerald-500" />
        <StatCard title="Jobs Posted" value="45" icon={Briefcase} color="bg-pink-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Engagement Trends
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataEngagement}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="active" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Alumni by Industry</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataIndustry}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataIndustry.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {dataIndustry.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-xs">
                  <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Community Highlights */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-indigo-600" /> Community Highlights
                </h3>
                <button 
                  onClick={fetchNews} 
                  disabled={loadingNews}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all disabled:opacity-50"
                  title="Refresh with Gemini"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingNews ? 'animate-spin text-indigo-600' : ''}`} />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
                {loadingNews && news.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse space-y-3 p-4 bg-slate-50 rounded-xl">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ))
                ) : (
                  news.map((item) => (
                    <div key={item.id} className="group p-4 bg-slate-50 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.category === 'Success Story' ? 'bg-indigo-100 text-indigo-600' :
                          item.category === 'Research' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-bold bg-white px-2 py-0.5 rounded-full border border-indigo-100">
                          <Sparkles className="w-2.5 h-2.5" /> Live AI
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-3 mb-3 leading-relaxed">
                        {item.content}
                      </p>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
                         <span className="text-[10px] text-slate-400 italic">By {item.author}</span>
                         <button className="text-[10px] font-bold text-indigo-600 flex items-center gap-0.5 hover:gap-1 transition-all">
                           Read Full <ChevronRight className="w-3 h-3" />
                         </button>
                      </div>
                    </div>
                  ))
                )}
                
                {news.length === 0 && !loadingNews && (
                  <div className="text-center py-12">
                    <p className="text-sm text-slate-400">No highlights currently available.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-auto pt-6">
                <div className="bg-indigo-600 rounded-xl p-4 text-white relative overflow-hidden">
                  <Sparkles className="absolute top-[-10px] right-[-10px] w-24 h-24 opacity-10" />
                  <h4 className="font-bold text-sm mb-1">Weekly Digest</h4>
                  <p className="text-[11px] text-indigo-100 mb-3 opacity-90">Personalized AI insights delivered to your inbox every Monday.</p>
                  <button className="w-full py-1.5 bg-white text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
