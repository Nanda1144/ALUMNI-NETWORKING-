
import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { Search, MapPin, Briefcase, GraduationCap, Mail, Building2, Trash2 } from 'lucide-react';

interface AlumniDirectoryProps {
  initialSearch?: string;
  currentUser: User;
  onViewProfile?: (user: User) => void;
}

const AlumniDirectory: React.FC<AlumniDirectoryProps> = ({ initialSearch = '', currentUser, onViewProfile }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  // Update search term if prop changes
  useEffect(() => {
    if(initialSearch) setSearchTerm(initialSearch);
  }, [initialSearch]);

  const targetUsers = useMemo(() => {
    if (currentUser.role === UserRole.STUDENT) {
      // Students want to find Alumni
      return MOCK_USERS.filter(u => u.role === UserRole.ALUMNI);
    } else if (currentUser.role === UserRole.ALUMNI) {
      // Alumni/Companies want to find Students (Talent)
      return MOCK_USERS.filter(u => u.role === UserRole.STUDENT);
    } else {
      // Admins see everyone
      return MOCK_USERS.filter(u => u.id !== currentUser.id);
    }
  }, [currentUser]);

  const filteredUsers = useMemo(() => {
    return targetUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // If filtering students (who might not have job titles), filter by Department instead of "Industry"
      let matchesFilter = true;
      if (selectedIndustry !== 'All') {
        if (user.role === UserRole.ALUMNI) {
           matchesFilter = !!user.jobTitle && user.jobTitle.includes(selectedIndustry);
        } else {
           matchesFilter = !!user.department && user.department.includes(selectedIndustry); 
        }
      }

      return matchesSearch && matchesFilter;
    });
  }, [targetUsers, searchTerm, selectedIndustry]);

  const isLookingForStudents = currentUser.role !== UserRole.STUDENT;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={isLookingForStudents ? "Search students by name or skill..." : "Search alumni by name, company, or skill..."}
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
          <option value="All">{isLookingForStudents ? 'All Departments' : 'All Industries'}</option>
          {isLookingForStudents ? (
             <>
              <option value="Computer Science">Computer Science</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
             </>
          ) : (
            <>
              <option value="Engineer">Engineering</option>
              <option value="Manager">Management</option>
              <option value="Designer">Design</option>
              <option value="Finance">Finance</option>
            </>
          )}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group relative">
            
            {/* Admin Delete Action */}
            {currentUser.role === UserRole.ADMIN && (
               <button className="absolute top-2 right-2 p-2 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <Trash2 className="w-4 h-4" />
               </button>
            )}

            <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 relative">
              <div className="absolute -bottom-8 left-6">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-4 border-white object-cover" />
              </div>
            </div>
            <div className="pt-10 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</h3>
                  {user.role === UserRole.ALUMNI ? (
                    <>
                      <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                        <Briefcase className="w-3 h-3" /> {user.jobTitle}
                      </p>
                      <p className="text-slate-500 text-sm flex items-center gap-1">
                        <span className="font-semibold text-slate-700">@{user.company}</span>
                      </p>
                    </>
                  ) : (
                     <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                        <GraduationCap className="w-3 h-3" /> Student
                      </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                 <p className="text-slate-500 text-xs flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" /> 
                    {user.department} • Class of {user.graduationYear}
                  </p>
                  {user.location && (
                    <p className="text-slate-500 text-xs flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> 
                      {user.location}
                    </p>
                  )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {user.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                    {skill}
                  </span>
                ))}
                {user.skills.length > 3 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                    +{user.skills.length - 3}
                  </span>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                <button 
                  onClick={() => onViewProfile && onViewProfile(user)}
                  className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                >
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
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No matching users found.</p>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;
