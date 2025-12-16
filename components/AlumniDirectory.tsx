import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { Search, MapPin, Briefcase, GraduationCap, Mail } from 'lucide-react';

interface AlumniDirectoryProps {
  initialSearch?: string;
}

const AlumniDirectory: React.FC<AlumniDirectoryProps> = ({ initialSearch = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  // Update search term if prop changes
  useEffect(() => {
    if(initialSearch) setSearchTerm(initialSearch);
  }, [initialSearch]);

  const alumni = useMemo(() => MOCK_USERS.filter(u => u.role === UserRole.ALUMNI), []);

  const filteredAlumni = useMemo(() => {
    return alumni.filter(alum => {
      const matchesSearch = alum.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            alum.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            alum.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesIndustry = selectedIndustry === 'All' || (alum.jobTitle && alum.jobTitle.includes(selectedIndustry)); // Simple mock filter logic

      return matchesSearch && matchesIndustry;
    });
  }, [alumni, searchTerm, selectedIndustry]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, company, or skill..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
        >
          <option value="All">All Industries</option>
          <option value="Engineer">Engineering</option>
          <option value="Manager">Management</option>
          <option value="Designer">Design</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((alum) => (
          <div key={alum.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 relative">
              <div className="absolute -bottom-8 left-6">
                <img src={alum.avatar} alt={alum.name} className="w-16 h-16 rounded-full border-4 border-white object-cover" />
              </div>
            </div>
            <div className="pt-10 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{alum.name}</h3>
                  <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                    <Briefcase className="w-3 h-3" /> {alum.jobTitle}
                  </p>
                  <p className="text-slate-500 text-sm flex items-center gap-1">
                    <span className="font-semibold text-slate-700">@{alum.company}</span>
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                 <p className="text-slate-500 text-xs flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" /> 
                    Class of {alum.graduationYear} • {alum.department}
                  </p>
                  <p className="text-slate-500 text-xs flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> 
                    {alum.location}
                  </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {alum.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                    {skill}
                  </span>
                ))}
                {alum.skills.length > 3 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                    +{alum.skills.length - 3}
                  </span>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors">
                  View Profile
                </button>
                <button className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAlumni.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No alumni found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;