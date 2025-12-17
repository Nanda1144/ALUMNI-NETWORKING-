
import React, { useMemo } from 'react';
import { Feedback, UserRole } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MessageSquare, Star, TrendingUp, Users } from 'lucide-react';

interface CreatorAnalyticsProps {
  feedback: Feedback[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const CreatorAnalytics: React.FC<CreatorAnalyticsProps> = ({ feedback }) => {
  
  const stats = useMemo(() => {
    const total = feedback.length;
    const avgRating = total > 0 ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) : '0.0';
    
    // Role Distribution
    const studentCount = feedback.filter(f => f.userRole === UserRole.STUDENT).length;
    const alumniCount = feedback.filter(f => f.userRole === UserRole.ALUMNI).length;
    const companyCount = feedback.filter(f => f.userRole === UserRole.ADMIN).length; // Assuming Admin represents company/staff

    // Sentiment (Simplified by Rating)
    const positive = feedback.filter(f => f.rating >= 4).length;
    const neutral = feedback.filter(f => f.rating === 3).length;
    const negative = feedback.filter(f => f.rating < 3).length;

    return { total, avgRating, studentCount, alumniCount, companyCount, positive, neutral, negative };
  }, [feedback]);

  const roleData = [
    { name: 'Students', value: stats.studentCount },
    { name: 'Alumni', value: stats.alumniCount },
    { name: 'Company/Admin', value: stats.companyCount },
  ];

  const sentimentData = [
    { name: 'Positive (4-5★)', value: stats.positive, color: '#10b981' },
    { name: 'Neutral (3★)', value: stats.neutral, color: '#f59e0b' },
    { name: 'Negative (1-2★)', value: stats.negative, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Creator Dashboard</h2>
        <p className="text-slate-400">Project Update Feedback & Platform Analytics</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><MessageSquare className="w-5 h-5" /></div>
                <span className="text-slate-500 font-medium">Total Feedback</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Star className="w-5 h-5" /></div>
                <span className="text-slate-500 font-medium">Avg Rating</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.avgRating}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                <span className="text-slate-500 font-medium">Positive Rate</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
                {stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0}%
            </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
                <span className="text-slate-500 font-medium">Top Responder</span>
            </div>
            <p className="text-xl font-bold text-slate-900 mt-1">Students</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Feedback by Role</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Sentiment Analysis</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={sentimentData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {sentimentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
                {sentimentData.map((entry) => (
                    <div key={entry.name} className="flex items-center text-xs">
                        <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></span>
                        {entry.name}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Detailed List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Recent Feedback</h3>
          </div>
          <div className="divide-y divide-slate-100">
              {feedback.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                  item.userRole === UserRole.STUDENT ? 'bg-blue-100 text-blue-700' :
                                  item.userRole === UserRole.ALUMNI ? 'bg-indigo-100 text-indigo-700' :
                                  'bg-slate-100 text-slate-700'
                              }`}>
                                  {item.userRole}
                              </span>
                              <span className="font-medium text-slate-900">{item.userName}</span>
                          </div>
                          <div className="flex items-center text-yellow-400 gap-1">
                              <span className="text-slate-400 text-xs mr-2">{item.date}</span>
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-bold text-slate-700">{item.rating}</span>
                          </div>
                      </div>
                      <div className="mb-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-2">Category: {item.category}</span>
                      </div>
                      <p className="text-slate-600">{item.comment}</p>
                  </div>
              ))}
              {feedback.length === 0 && (
                  <div className="p-12 text-center text-slate-500">No feedback submitted yet.</div>
              )}
          </div>
      </div>
    </div>
  );
};

export default CreatorAnalytics;
