import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, AlertTriangle, BookMarked, Play, ExternalLink } from 'lucide-react';
import { api } from '../api';

export const LearningPlanPage: React.FC = () => {
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Custom states that persist in localStorage
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchLearningPath();
    const cached = localStorage.getItem('skillmatch_learning_statuses');
    if (cached) {
      setStatuses(JSON.parse(cached));
    }
  }, []);

  const fetchLearningPath = async () => {
    setLoading(true);
    try {
      const data = await api.getLearningPath();
      setLearningPath(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching learning plan.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (resourceId: string, newStatus: string) => {
    const updated = { ...statuses, [resourceId]: newStatus };
    setStatuses(updated);
    localStorage.setItem('skillmatch_learning_statuses', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="font-bold text-slate-500">Generating personalized learning plan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <h2 className="font-bold text-lg text-brand-900">Error Loading Learning Plan</h2>
        <p className="text-slate-500">{error}</p>
        <button onClick={fetchLearningPath} className="mt-2 px-4 py-2 bg-brand-900 text-white rounded-lg font-bold text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-brand-900">Personalized Learning Plan</h1>
        <p className="text-slate-500 font-medium">Courses and materials mapped dynamically to resolve identified skill gaps across matched opportunities.</p>
      </div>

      {learningPath.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <BookMarked className="w-12 h-12 text-slate-300" />
          <span className="font-extrabold text-lg text-brand-900">No Learning Path Generated</span>
          <p className="text-slate-400 text-sm max-w-md">Your profile is a perfect fit for all opportunities or you haven't added skills to match yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {learningPath.map((item) => {
            const currentStatus = statuses[item.id] || 'Not Started';
            
            const badgeClass = item.priority === 'High' 
              ? 'bg-red-50 text-red-600 border-red-100' 
              : 'bg-slate-50 text-slate-500 border-slate-200';

            const statusColor = currentStatus === 'Completed'
              ? 'bg-green-50 text-green-700 border-green-200'
              : currentStatus === 'In Progress'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-50 text-slate-500 border-slate-200';

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{item.skill} &bull; {item.resourceType}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${badgeClass}`}>
                        {item.priority} Priority
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-brand-900 leading-snug">{item.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                      <span>Provider: <span className="text-slate-600">{item.provider}</span></span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 self-end md:self-center shrink-0 w-full md:w-auto border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
                  {/* Status Dropdown */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                    <select
                      value={currentStatus}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg border font-bold text-xs cursor-pointer ${statusColor}`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Course Action */}
                  <button
                    onClick={() => window.open(item.url, '_blank')}
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
