import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Award, TrendingUp, Plus, Trash2, Edit2, AlertCircle, BarChart2, Check } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { api } from '../api';

const COLORS = ['#102a43', '#1976d2', '#00b0ff', '#4caf50', '#ff9800', '#9c27b0'];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'stats' | 'opportunities' | 'students'>('stats');

  // Modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<any>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [org, setOrg] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('Internship');
  const [loc, setLoc] = useState('');
  const [dur, setDur] = useState('');
  const [exp, setExp] = useState('Entry');
  const [workType, setWorkType] = useState('Remote');
  const [reqSkills, setReqSkills] = useState('');
  const [prefSkills, setPrefSkills] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const statsData = await api.getAdminStatistics();
      setStats(statsData);
      
      const studData = await api.getAdminStudents();
      setStudents(studData);

      const oppData = await api.getOpportunities({});
      setOpportunities(oppData);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve admin dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingOpp(null);
    setTitle('');
    setOrg('');
    setDesc('');
    setType('Internship');
    setLoc('');
    setDur('');
    setExp('Entry');
    setWorkType('Remote');
    setReqSkills('');
    setPrefSkills('');
    setModalOpen(true);
  };

  const openEditModal = (opp: any) => {
    setEditingOpp(opp);
    setTitle(opp.title);
    setOrg(opp.organization);
    setDesc(opp.description);
    setType(opp.type);
    setLoc(opp.location);
    setDur(opp.duration);
    setExp(opp.experienceLevel);
    setWorkType(opp.workType);
    
    // Skills mapping from opp skills list
    const req = opp.skills?.filter((s: any) => s.isRequired).map((s: any) => s.skill.name).join(', ') || '';
    const pref = opp.skills?.filter((s: any) => !s.isRequired).map((s: any) => s.skill.name).join(', ') || '';
    
    setReqSkills(req);
    setPrefSkills(pref);
    setModalOpen(true);
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this opportunity posting?')) {
      try {
        await api.deleteOpportunity(id);
        alert('Opportunity deleted successfully.');
        fetchAdminData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete opportunity.');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const oppPayload = {
      title,
      organization: org,
      description: desc,
      type,
      location: loc,
      duration: dur,
      experienceLevel: exp,
      workType,
      requiredSkills: reqSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: prefSkills.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (editingOpp) {
        await api.updateOpportunity(editingOpp.id, oppPayload);
        alert('Opportunity updated successfully!');
      } else {
        await api.createOpportunity(oppPayload);
        alert('Opportunity created successfully!');
      }
      setModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save opportunity details.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="font-bold text-slate-500">Loading admin statistics database...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <h2 className="font-bold text-lg text-brand-900">Error Loading Admin Portal</h2>
        <p className="text-slate-500">{error}</p>
        <button onClick={fetchAdminData} className="mt-2 px-4 py-2 bg-brand-900 text-white rounded-lg font-bold text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      {/* Header Area */}
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-brand-900">System Administration</h1>
          <p className="text-slate-500 font-medium font-sans">Manage database postings, audit student profiles, and examine platform matching metrics.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-brand-900 text-white font-bold shadow-lg shadow-brand-900/10 hover:bg-brand-800 transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Create Opportunity
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        {[
          { id: 'stats', label: 'Analytics Dashboard', icon: <BarChart2 className="w-4 h-4" /> },
          { id: 'opportunities', label: 'Manage Opportunities', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'students', label: 'Student Accounts', icon: <Users className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all -mb-px ${activeTab === tab.id ? 'border-brand-900 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Statistics Dashboard Panel */}
      {activeTab === 'stats' && stats && (
        <div className="flex flex-col gap-8">
          {/* Metrics summary widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Students', value: stats.summary?.totalStudents ?? stats.totalStudents ?? 0, icon: <Users className="w-5 h-5 text-blue-600" /> },
              { label: 'Total Postings', value: stats.summary?.totalOpportunities ?? stats.totalOpportunities ?? 0, icon: <Briefcase className="w-5 h-5 text-green-600" /> },
              { label: 'Skills Database', value: stats.summary?.totalSkills ?? stats.totalSkills ?? 33, icon: <Award className="w-5 h-5 text-indigo-600" /> },
              { label: 'Average Match Score', value: `${stats.charts?.averageMatchScore ?? stats.averageMatchScore ?? 75}%`, icon: <TrendingUp className="w-5 h-5 text-purple-600" /> }
            ].map((wid, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-slate-500">{wid.label}</span>
                  <span className="text-2xl font-extrabold text-brand-900">{wid.value}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {wid.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pie Chart: Opp Types */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
              <h3 className="font-bold text-lg text-brand-900 border-b border-slate-50 pb-2">Opportunity Type Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.charts?.opportunityTypes || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(stats.charts?.opportunityTypes || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Popular Skills */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
              <h3 className="font-bold text-lg text-brand-900 border-b border-slate-50 pb-2">Most Registered Student Skills</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.charts?.popularSkills || []}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Career recommendations */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm lg:col-span-2">
              <h3 className="font-bold text-lg text-brand-900 border-b border-slate-50 pb-2">Popular Career Path Recommendations (Match Ratio &ge; 50%)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.charts?.careerPathRecommendations || []}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="students" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Opportunities Panel */}
      {activeTab === 'opportunities' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="p-4">Opportunity</th>
                  <th className="p-4">Org</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Exp. Level</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {opportunities.map(opp => (
                  <tr key={opp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-brand-900">{opp.title}</td>
                    <td className="p-4">{opp.organization}</td>
                    <td className="p-4">
                      <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-bold">{opp.type}</span>
                    </td>
                    <td className="p-4">{opp.location} ({opp.workType})</td>
                    <td className="p-4">{opp.experienceLevel}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(opp)}
                        className="p-2 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        title="Edit posting"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        className="p-2 border border-slate-200 hover:border-red-200 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Delete posting"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student List Panel */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="p-4">Student</th>
                  <th className="p-4">Education</th>
                  <th className="p-4">Registered Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {students.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-900">{st.name}</span>
                        <span className="text-xs text-slate-400 font-medium">{st.user?.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span>{st.degree} &bull; {st.department}</span>
                        <span className="text-xs text-slate-400 font-medium">{st.university} ({st.graduationYear})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {st.skills?.length === 0 ? (
                          <span className="text-slate-400 font-semibold text-xs">No skills registered.</span>
                        ) : (
                          st.skills?.map((sk: any) => (
                            <span key={sk.id} className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded font-bold">
                              {sk.skill.name} ({sk.proficiency})
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Creation/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-xl font-extrabold text-brand-900">{editingOpp ? 'Edit Opportunity Posting' : 'Create Opportunity Posting'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Close</button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opportunity Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                    placeholder="e.g. Software Developer Intern"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organization / Company *</label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    required
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                    placeholder="e.g. TechNova Solutions"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-bold bg-white text-brand-900"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Job">Job</option>
                    <option value="Project">Project</option>
                    <option value="Course">Course</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experience level *</label>
                  <select
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-bold bg-white text-brand-900"
                  >
                    <option value="Entry">Entry</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location *</label>
                  <input
                    type="text"
                    value={loc}
                    onChange={(e) => setLoc(e.target.value)}
                    required
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                    placeholder="e.g. Austin, TX or Remote"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Work Style *</label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-bold bg-white text-brand-900"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration / Contract</label>
                  <input
                    type="text"
                    value={dur}
                    onChange={(e) => setDur(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                    placeholder="e.g. 3 months, 6 months, Full-time"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium"
                  placeholder="Describe the opportunity role details..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Required Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={reqSkills}
                    onChange={(e) => setReqSkills(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                    placeholder="Java, SQL, Git"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={prefSkills}
                    onChange={(e) => setPrefSkills(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                    placeholder="React, Docker, TypeScript"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 font-bold text-sm rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-900 text-white hover:bg-brand-800 font-bold text-sm rounded-xl flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> {editingOpp ? 'Update Posting' : 'Publish Posting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
