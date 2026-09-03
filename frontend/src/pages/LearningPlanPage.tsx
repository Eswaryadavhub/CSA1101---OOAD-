import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, AlertTriangle, BookMarked, ExternalLink, RefreshCw } from 'lucide-react';
import { api } from '../api';

export const LearningPlanPage: React.FC = () => {
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Custom completion statuses that persist in localStorage
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchLearningPath();
    try {
      const cached = localStorage.getItem('skillmatch_learning_statuses');
      if (cached) {
        setStatuses(JSON.parse(cached));
      }
    } catch {
      // Ignore cache parse errors
    }
  }, []);

  const fetchLearningPath = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getLearningPath();
      if (Array.isArray(data)) {
        setLearningPath(data);
      } else if (data && Array.isArray((data as any).resources)) {
        setLearningPath((data as any).resources);
      } else {
        setLearningPath([]);
      }
    } catch (err: any) {
      console.error('Error fetching learning plan:', err);
      setError(err.message || 'Unable to generate learning plan at this moment.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (resourceId: string, newStatus: string) => {
    const updated = { ...statuses, [resourceId]: newStatus };
    setStatuses(updated);
    try {
      localStorage.setItem('skillmatch_learning_statuses', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const getSkillName = (skill: any): string => {
    if (!skill) return 'Career Development';
    if (typeof skill === 'string') return skill;
    if (typeof skill === 'object' && skill.name) return String(skill.name);
    return 'Technical';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in-up">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-900 rounded-full animate-spin" />
        <span className="font-bold text-slate-600">Generating personalized learning plan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center gap-4 max-w-xl mx-auto my-12 shadow-sm animate-fade-in-up">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-extrabold text-xl text-brand-900">Error Generating Plan</h2>
        <p className="text-slate-500 text-sm">{error}</p>
        <button 
          onClick={fetchLearningPath} 
          className="mt-2 px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const safeList = Array.isArray(learningPath) ? learningPath : [];

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-brand-900">Personalized Learning Plan</h1>
        <p className="text-slate-500 font-medium">Curated courses, certifications, and resources mapped directly to resolve identified skill gaps across matched opportunities.</p>
      </div>

      {safeList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookMarked className="w-8 h-8" />
          </div>
          <span className="font-extrabold text-xl text-brand-900">No Learning Path Generated</span>
          <p className="text-slate-500 text-sm max-w-md">
            Complete your profile and add skills to generate your personalized learning plan.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {safeList.map((item, idx) => {
            const itemId = item.id || `item_${idx}`;
            const currentStatus = statuses[itemId] || 'Not Started';
            const skillName = getSkillName(item.skill);
            const resourceType = item.type || item.resourceType || 'Course';
            const priority = item.priority || 'Medium';
            const duration = item.duration || 'Self-paced';
            const provider = item.provider || 'Online Resource';
            const courseUrl = item.url || '#';
            
            const badgeClass = priority === 'High' 
              ? 'bg-red-50 text-red-600 border-red-200' 
              : priority === 'Low'
                ? 'bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-amber-50 text-amber-700 border-amber-200';

            const statusColor = currentStatus === 'Completed'
              ? 'bg-green-50 text-green-700 border-green-200'
              : currentStatus === 'In Progress'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-50 text-slate-600 border-slate-200';

            return (
              <div 
                key={itemId} 
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-900 shrink-0">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{skillName} &bull; {resourceType}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${badgeClass}`}>
                        {priority} Priority
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-brand-900 leading-snug">{item.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                      <span>Provider: <span className="text-slate-600">{provider}</span></span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 self-end md:self-center shrink-0 w-full md:w-auto border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
                  {/* Status Dropdown */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                    <select
                      value={currentStatus}
                      onChange={(e) => updateStatus(itemId, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg border font-bold text-xs cursor-pointer ${statusColor}`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Course Action */}
                  <button
                    onClick={() => window.open(courseUrl, '_blank', 'noopener,noreferrer')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-900 text-white rounded-xl hover:bg-brand-800 font-bold text-xs shadow-sm transition-all h-fit mt-3 sm:mt-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Start Course
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
