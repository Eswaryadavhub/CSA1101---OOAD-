import React, { useState, useEffect } from 'react';
import { Save, User, BookOpen, Briefcase, Heart, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../api';

interface ProfilePageProps {
  initialProfile: any;
  onProfileUpdated: () => void;
}

const INTERESTS_OPTIONS = [
  'Software Development',
  'Data Science',
  'AI/ML',
  'Web Development',
  'Cybersecurity',
  'Cloud Computing',
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ initialProfile, onProfileUpdated }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'experience' | 'preferences'>('personal');
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    location: '',
    degree: '',
    department: '',
    university: '',
    graduationYear: '',
    experienceLevel: 'Entry',
    projects: '',
    internshipExperience: '',
    interests: '',
    preferredRole: '',
    preferredIndustry: '',
    preferredLocation: '',
    workType: 'Remote',
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        name: initialProfile.name || '',
        email: initialProfile.user?.email || '',
        phone: initialProfile.phone || '',
        location: initialProfile.location || '',
        degree: initialProfile.degree || '',
        department: initialProfile.department || '',
        university: initialProfile.university || '',
        graduationYear: initialProfile.graduationYear || '',
        experienceLevel: initialProfile.experienceLevel || 'Entry',
        projects: initialProfile.projects || '',
        internshipExperience: initialProfile.internshipExperience || '',
        interests: initialProfile.interests || '',
        preferredRole: initialProfile.preferredRole || '',
        preferredIndustry: initialProfile.preferredIndustry || '',
        preferredLocation: initialProfile.preferredLocation || '',
        workType: initialProfile.workType || 'Remote',
      });
    }
  }, [initialProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    let list = formData.interests ? formData.interests.split(',').map((i: string) => i.trim()) : [];
    if (list.includes(interest)) {
      list = list.filter((i: string) => i !== interest);
    } else {
      list.push(interest);
    }
    setFormData((prev: any) => ({ ...prev, interests: list.join(',') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    if (!formData.name) {
      setMsg({ type: 'error', text: 'Full Name is a required field.' });
      setSaving(false);
      return;
    }

    try {
      await api.updateProfile(formData);
      setMsg({ type: 'success', text: 'Your career profile has been updated successfully!' });
      onProfileUpdated();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const isInterestSelected = (interest: string) => {
    const list = formData.interests ? formData.interests.split(',').map((i: string) => i.trim().toLowerCase()) : [];
    return list.includes(interest.toLowerCase());
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-brand-900">Career Profile Management</h1>
        <p className="text-slate-500 font-medium">Keep your career goals, experience, and studies updated to synchronize match scores.</p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {msg.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
          <span className="font-semibold text-sm leading-relaxed">{msg.text}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Profile Tabs Sidebar */}
        <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50/50 p-4 flex flex-col gap-2 shrink-0">
          {[
            { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
            { id: 'education', label: 'Education & Degree', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'experience', label: 'Experience & Projects', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'preferences', label: 'Career Preferences', icon: <Settings className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-left transition-all ${activeTab === tab.id ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/10' : 'text-slate-600 hover:text-brand-900 hover:bg-slate-100'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-8">
          {activeTab === 'personal' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-brand-900 border-b border-slate-100 pb-3">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address (Primary)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 font-semibold cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                    placeholder="e.g. +1 (555) 012-3456"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-brand-900 border-b border-slate-100 pb-3">Education Background</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Degree Type</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department / Major</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">University / School</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                    placeholder="e.g. State University"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Graduation Year</label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                    placeholder="e.g. 2027"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-brand-900 border-b border-slate-100 pb-3">Professional Experience</h2>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 w-fit">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-bold bg-white cursor-pointer text-brand-900 text-sm"
                  >
                    <option value="Entry">Entry Level / Student</option>
                    <option value="Intermediate">Intermediate Level</option>
                    <option value="Advanced">Advanced Level</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    Projects Description
                  </label>
                  <textarea
                    name="projects"
                    value={formData.projects}
                    onChange={handleChange}
                    rows={4}
                    className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium text-sm leading-relaxed"
                    placeholder="Describe major projects you have worked on. List details clearly (e.g. 1. Portfolio website...)"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Internship Experience</label>
                  <textarea
                    name="internshipExperience"
                    value={formData.internshipExperience}
                    onChange={handleChange}
                    rows={3}
                    className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium text-sm leading-relaxed"
                    placeholder="Provide descriptions of any previous internships or jobs."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-brand-900 border-b border-slate-100 pb-3">Career Goals & Preferences</h2>
              
              {/* Interest Tags Selection */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-red-500" /> Career Fields of Interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map((interest) => {
                    const selected = isInterestSelected(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${selected ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Desired Job Role</label>
                  <input
                    type="text"
                    name="preferredRole"
                    value={formData.preferredRole}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                    placeholder="e.g. Software Developer"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Industry</label>
                  <input
                    type="text"
                    name="preferredIndustry"
                    value={formData.preferredIndustry}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                    placeholder="e.g. Technology"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Location</label>
                  <input
                    type="text"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                    placeholder="e.g. San Francisco, CA or Remote"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Work Style</label>
                  <select
                    name="workType"
                    value={formData.workType}
                    onChange={handleChange}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-bold bg-white cursor-pointer text-brand-900 text-sm"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-6 mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-brand-900 text-white hover:bg-brand-800 font-bold shadow-lg shadow-brand-900/10 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
