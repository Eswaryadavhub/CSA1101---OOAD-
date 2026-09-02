import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, CheckCircle, AlertTriangle, BookOpen, ChevronRight, Award } from 'lucide-react';
import { api } from '../api';

interface CareerPathsPageProps {
  onNavigate: (page: string) => void;
}

export const CareerPathsPage: React.FC<CareerPathsPageProps> = ({ onNavigate }) => {
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  useEffect(() => {
    fetchCareerPaths();
  }, []);

  const fetchCareerPaths = async () => {
    setLoading(true);
    try {
      const data = await api.getCareerPaths();
      setCareerPaths(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching career recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="font-bold text-slate-500">Matching profiles to career paths...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <h2 className="font-bold text-lg text-brand-900">Error Loading Career Paths</h2>
        <p className="text-slate-500">{error}</p>
        <button onClick={fetchCareerPaths} className="mt-2 px-4 py-2 bg-brand-900 text-white rounded-lg font-bold text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-brand-900">Career Path Recommendations</h1>
        <p className="text-slate-500 font-medium">Explore standard industry roles and see how well your profile aligns. Identify courses to close skill gaps.</p>
      </div>

      <div className="flex flex-col gap-6">
        {careerPaths.map((cp) => {
          const isExpanded = expandedPath === cp.id;
          const scoreClass = getScoreColor(cp.matchScore);

          return (
            <div 
              key={cp.id} 
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all"
            >
              {/* Summary Bar */}
              <div 
                onClick={() => setExpandedPath(isExpanded ? null : cp.id)}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-extrabold text-xl text-brand-900 leading-snug">{cp.title}</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200/50 uppercase tracking-wider">
                      {cp.demandLevel} Demand
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">{cp.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                  <div className="flex flex-col gap-0.5 text-right font-semibold text-xs text-slate-400">
                    <span>Avg. Salary</span>
                    <span className="font-bold text-slate-700">{cp.averageSalary}</span>
                  </div>
                  
                  <div className={`px-4 py-2 border rounded-xl flex flex-col items-center gap-0.5 font-bold ${scoreClass} shadow-sm w-28`}>
                    <span className="text-xl leading-none">{cp.matchScore}%</span>
                    <span className="text-[8px] uppercase tracking-wider opacity-85">Match</span>
                  </div>
                </div>
              </div>

              {/* Expanded details (Skill breakdown & resources) */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-slate-100 pt-6 bg-slate-50/50 flex flex-col gap-6 animate-fade-in-up">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Strong Skills */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm">
                      <h4 className="font-bold text-sm text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-4.5 h-4.5" /> Possessed Skills ({cp.strongSkills.length})
                      </h4>
                      {cp.strongSkills.length === 0 ? (
                        <span className="text-xs text-slate-400 font-semibold">You don't have any matching skills for this career yet.</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {cp.strongSkills.map((s: string) => (
                            <span key={s} className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Skills to Improve */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm">
                      <h4 className="font-bold text-sm text-amber-700 flex items-center gap-2">
                        <AlertTriangle className="w-4.5 h-4.5" /> Skills to Build ({cp.toImprove.length})
                      </h4>
                      {cp.toImprove.length === 0 ? (
                        <span className="text-xs text-green-600 font-bold">Awesome! You possess all standard skills for this career path.</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {cp.toImprove.map((s: string) => (
                            <span key={s} className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommended Learning Path */}
                  {cp.learningPath.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-extrabold text-sm text-brand-900 flex items-center gap-1.5">
                        <BookOpen className="w-4.5 h-4.5 text-blue-600" /> Recommended Learning Path
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {cp.learningPath.map((item: any, idx: number) => (
                          <div 
                            key={idx}
                            onClick={() => window.open(item.url, '_blank')}
                            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex justify-between items-start gap-4 cursor-pointer"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{item.skill} ({item.type})</span>
                              <h5 className="font-bold text-sm text-brand-900 leading-snug">{item.title}</h5>
                              <span className="text-xs text-slate-400 font-medium">Provided by {item.provider} &bull; {item.duration}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${item.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                              {item.priority} Priority
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-3">
                    <button 
                      onClick={() => onNavigate('learning')}
                      className="px-4 py-2 bg-brand-900 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-brand-800 transition-all flex items-center gap-1"
                    >
                      Configure Learning Schedule <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
