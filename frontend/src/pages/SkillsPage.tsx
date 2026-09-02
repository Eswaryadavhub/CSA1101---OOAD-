import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shield, Search, Award, HelpCircle, CheckCircle } from 'lucide-react';
import { api } from '../api';

interface SkillsPageProps {
  skills: any[];
  onSkillsUpdated: () => void;
}

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const CATEGORIES = [
  'Programming',
  'Database',
  'Web Development',
  'Cloud',
  'AI/ML',
  'Soft Skills',
  'Tools',
];

export const SkillsPage: React.FC<SkillsPageProps> = ({ skills, onSkillsUpdated }) => {
  const [masterSkills, setMasterSkills] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Programming');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMasterSkills();
  }, [skills]);

  const fetchMasterSkills = async () => {
    try {
      const data = await api.getSkills();
      // Filter out skills the student already added
      const addedIds = new Set(skills.map(s => s.skillId));
      setMasterSkills(data.masterSkills.filter((ms: any) => !addedIds.has(ms.id)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedSkillId && !customName) {
      setError('Please select a skill from the list or write a custom skill name.');
      return;
    }

    try {
      await api.addSkill({
        skillId: selectedSkillId || undefined,
        skillName: selectedSkillId ? undefined : customName,
        category: selectedSkillId ? undefined : customCategory,
        proficiency,
      });

      // Reset form
      setSelectedSkillId('');
      setCustomName('');
      setProficiency('Intermediate');
      setAdding(false);
      onSkillsUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to save skill.');
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (confirm('Are you sure you want to remove this skill from your profile?')) {
      try {
        await api.removeSkill(skillId);
        onSkillsUpdated();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Group student skills by category
  const skillsByCategory: Record<string, any[]> = {};
  CATEGORIES.forEach(cat => {
    skillsByCategory[cat] = skills.filter(s => s.category === cat);
  });

  const getProficiencyPercentage = (prof: string) => {
    if (prof === 'Beginner') return 30;
    if (prof === 'Intermediate') return 60;
    if (prof === 'Advanced') return 85;
    return 100;
  };

  const getProficiencyColor = (prof: string) => {
    if (prof === 'Beginner') return 'bg-blue-400';
    if (prof === 'Intermediate') return 'bg-blue-600';
    if (prof === 'Advanced') return 'bg-indigo-600';
    return 'bg-brand-900';
  };

  // Filter master skills based on search term
  const filteredMaster = masterSkills.filter(ms => 
    ms.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-brand-900">Your Skills Inventory</h1>
          <p className="text-slate-500 font-medium">Add, update, and manage your competencies to calculate precise opportunity match scores.</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="px-5 py-2.5 rounded-xl bg-brand-900 text-white font-bold shadow-lg shadow-brand-900/10 hover:bg-brand-800 transition-all flex items-center gap-2 text-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* Add Skill Panel / Modal */}
      {adding && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md flex flex-col gap-6 animate-fade-in-up">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-brand-900">Add Skill to Profile</h2>
            <button onClick={() => setAdding(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Cancel</button>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleAddSkillSubmit} className="grid md:grid-cols-3 gap-6 items-end">
            {/* Search and Select Skill */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Predefined Skill</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search existing skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold"
                />
              </div>
              <select
                value={selectedSkillId}
                onChange={(e) => {
                  setSelectedSkillId(e.target.value);
                  if (e.target.value) setCustomName(''); // clear custom name if predefined is selected
                }}
                className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-bold bg-white"
              >
                <option value="">-- Or Select from list --</option>
                {filteredMaster.map(ms => (
                  <option key={ms.id} value={ms.id}>{ms.name} ({ms.category})</option>
                ))}
              </select>
            </div>

            {/* Custom Skill Creation */}
            <div className="flex flex-col gap-2 border-l border-slate-200 md:pl-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Or Add Custom Skill</label>
              <input
                type="text"
                placeholder="Skill Name (e.g. React Native)"
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value);
                  if (e.target.value) setSelectedSkillId(''); // clear predefined selection
                }}
                className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                disabled={!!selectedSkillId}
                className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-bold bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Proficiency and Submit */}
            <div className="flex flex-col gap-5 md:pl-6 border-l border-slate-200">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proficiency Level</label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-bold bg-white"
                >
                  {PROFICIENCIES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-900 text-white font-bold hover:bg-brand-800 shadow-sm text-sm"
              >
                Add Skill to Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills Grouped by Category */}
      {skills.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <Award className="w-12 h-12 text-slate-300" />
          <span className="font-extrabold text-lg text-brand-900">Your Skills Inventory is Empty</span>
          <p className="text-slate-400 text-sm max-w-md">Click the "Add Skill" button above to populate your profile with programming, database, soft skills, and more.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {CATEGORIES.map(category => {
            const list = skillsByCategory[category];
            if (list.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
                <h3 className="font-bold text-lg text-brand-900 border-b border-slate-100 pb-2">{category}</h3>
                
                <div className="flex flex-col gap-4">
                  {list.map(sk => {
                    const percentage = getProficiencyPercentage(sk.proficiency);
                    const color = getProficiencyColor(sk.proficiency);
                    
                    return (
                      <div key={sk.id} className="flex flex-col gap-2 group">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-900 text-sm">{sk.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                              {sk.proficiency}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveSkill(sk.skillId)}
                            className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                          <div 
                            className={`h-full ${color} rounded-full transition-all duration-500`} 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
