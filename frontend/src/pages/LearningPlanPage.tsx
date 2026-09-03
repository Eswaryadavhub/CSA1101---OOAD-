import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, AlertTriangle, BookMarked, ExternalLink, 
  RefreshCw, Sparkles, CheckCircle2, Award, PlayCircle, 
  FileCode, Layers, ShieldCheck, Compass, ArrowUpRight, UploadCloud
} from 'lucide-react';
import { api } from '../api';

interface LearningPlanPageProps {
  onNavigate?: (page: string) => void;
}

export const LearningPlanPage: React.FC<LearningPlanPageProps> = ({ onNavigate }) => {
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [resumeProfile, setResumeProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // Custom completion statuses that persist in localStorage
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
    try {
      const cached = localStorage.getItem('skillmatch_learning_statuses');
      if (cached) {
        setStatuses(JSON.parse(cached));
      }
    } catch {
      // Ignore cache parse errors
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pathData, rProfile] = await Promise.all([
        api.getLearningPath(),
        api.getResumeProfile ? api.getResumeProfile() : null,
      ]);

      if (Array.isArray(pathData)) {
        setLearningPath(pathData);
      } else if (pathData && Array.isArray((pathData as any).resources)) {
        setLearningPath((pathData as any).resources);
      } else {
        setLearningPath([]);
      }

      setResumeProfile(rProfile);
    } catch (err: any) {
      console.error('Error fetching learning plan:', err);
      setError(err.message || 'Unable to generate learning plan at this moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRefreshing(true);
    try {
      const data = await api.getLearningPath();
      if (Array.isArray(data)) {
        setLearningPath(data);
      }
    } catch (err) {
      console.error('Error regenerating plan:', err);
    } finally {
      setRefreshing(false);
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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'YouTube':
        return <PlayCircle className="w-4 h-4 text-red-600" />;
      case 'freeCodeCamp':
        return <FileCode className="w-4 h-4 text-amber-600" />;
      case 'Coursera':
        return <Award className="w-4 h-4 text-blue-600" />;
      case 'Official Documentation':
      case 'MDN Web Docs':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'AWS Training':
        return <Layers className="w-4 h-4 text-orange-500" />;
      default:
        return <ExternalLink className="w-4 h-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in-up">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-900 rounded-full animate-spin" />
        <span className="font-bold text-slate-600">Analyzing resume & generating dynamic learning recommendations...</span>
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
          onClick={fetchData} 
          className="mt-2 px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const safeList = Array.isArray(learningPath) ? learningPath : [];
  const completedCount = safeList.filter(item => statuses[item.id] === 'Completed').length;
  const inProgressCount = safeList.filter(item => statuses[item.id] === 'In Progress').length;

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-xs w-fit">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Resume-Driven Learning Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">Personalized Learning Plan</h1>
          <p className="text-slate-500 font-medium">
            Dynamic educational roadmap tailored specifically to your uploaded resume, target opportunities, and verified skill gaps.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={refreshing}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Recalculating...' : 'Regenerate Recommendations'}
        </button>
      </div>

      {/* Resume Context Banner */}
      {resumeProfile ? (
        <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                Active Resume Profile
              </span>
              {resumeProfile.fileName && (
                <span className="text-xs text-slate-300 font-mono truncate max-w-xs">&bull; {resumeProfile.fileName}</span>
              )}
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Target Track: <span className="text-blue-300">{resumeProfile.careerDirection || 'Full Stack Software Developer'}</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {resumeProfile.summary || 'Recommendations are dynamically derived from your extracted skills, project history, and target opportunities.'}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="flex flex-col text-center">
              <span className="text-2xl font-black text-white">{safeList.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resources</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col text-center">
              <span className="text-2xl font-black text-amber-400">{inProgressCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col text-center">
              <span className="text-2xl font-black text-green-400">{completedCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-600">
              Want even higher personalization? Upload your resume in the <span className="font-bold text-brand-900">AI Resume Analyzer</span> to target exact missing skills.
            </span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('resume-analyzer')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0"
            >
              <UploadCloud className="w-3.5 h-3.5" /> Upload Resume
            </button>
          )}
        </div>
      )}

      {/* Recommended Learning Items List */}
      {safeList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookMarked className="w-8 h-8" />
          </div>
          <span className="font-extrabold text-xl text-brand-900">No Learning Path Generated</span>
          <p className="text-slate-500 text-sm max-w-md">
            Complete your profile and add skills or upload your resume to generate your personalized learning plan.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {safeList.map((item, idx) => {
            const itemId = item.id || `item_${idx}`;
            const currentStatus = statuses[itemId] || 'Not Started';
            const skillName = typeof item.skill === 'string' ? item.skill : (item.skill?.name || 'Software Development');
            const resourceType = item.resourceType || item.type || 'Video Course';
            const priority = item.priority || 'Medium Priority';
            const source = item.source || item.provider || 'Online Resource';
            const duration = item.duration || 'Self-paced';
            const courseUrl = item.url || '#';
            const actionText = item.actionText || (source === 'YouTube' ? 'Watch on YouTube' : 'Start Learning');
            const whyRecommended = item.whyRecommended || `Recommended to strengthen qualifications for target ${skillName} roles.`;
            const description = item.description || `Comprehensive training resource covering core ${skillName} concepts and industry applications.`;

            // Priority styling
            const isHigh = priority.includes('High');
            const isMedium = priority.includes('Medium');
            const priorityClass = isHigh
              ? 'bg-red-50 text-red-700 border-red-200'
              : isMedium
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200';

            const statusColor = currentStatus === 'Completed'
              ? 'bg-green-50 text-green-700 border-green-200'
              : currentStatus === 'In Progress'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-50 text-slate-600 border-slate-200';

            return (
              <div 
                key={itemId} 
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col gap-6 hover:shadow-md transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 bg-brand-900 text-white rounded-xl text-xs font-bold tracking-tight">
                      {skillName}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${priorityClass}`}>
                      {priority}
                    </span>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold">
                      {getSourceIcon(source)}
                      <span>Source: {source}</span>
                    </div>

                    <span className="text-xs text-slate-400 font-semibold">&bull; {resourceType}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {duration}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-extrabold text-xl text-brand-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Why This is Recommended Callout Box */}
                <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-extrabold text-brand-900 uppercase tracking-wider">Why Recommended for You:</span>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">
                      {whyRecommended}
                    </p>
                  </div>
                </div>

                {/* Footer Controls & Direct Link */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500">Learning Status:</span>
                    <select
                      value={currentStatus}
                      onChange={(e) => updateStatus(itemId, e.target.value)}
                      className={`px-3 py-1.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${statusColor}`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    {currentStatus === 'Completed' && (
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Finished
                      </span>
                    )}
                  </div>

                  {/* Direct Action Link */}
                  <a
                    href={courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-brand-900/15 transition-all hover:scale-[1.02]"
                  >
                    <span>{actionText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
