
import React, { useMemo } from 'react';
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
import { Users, Calendar, Award, Briefcase, GraduationCap } from 'lucide-react';
import { User, UserRole } from '../types';

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
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
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
  // Calculate dynamic stats
  const alumniCount = useMemo(() => users.filter(u => u.role === UserRole.ALUMNI).length, [users]);
  const studentCount = useMemo(() => users.filter(u => u.role === UserRole.STUDENT).length, [users]);

  // For visual demo purposes, if no users passed (e.g. initial load), use fallback
  const displayAlumni = alumniCount > 0 ? alumniCount : 12450; 
  const displayStudents = studentCount > 0 ? studentCount : 8500;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Alumni" value={displayAlumni} icon={Users} color="bg-indigo-600" />
        <StatCard title="Active Students" value={displayStudents} icon={GraduationCap} color="bg-blue-500" />
        <StatCard title="Events This Month" value="8" icon={Calendar} color="bg-emerald-500" />
        <StatCard title="Jobs Posted" value="45" icon={Briefcase} color="bg-pink-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Engagement Trends</h3>
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
    </div>
  );
};

export default Dashboard;
