import React, { useState, useEffect } from 'react';
import { Target, MapPin, Clock, CheckCircle2, AlertTriangle, ArrowLeft, Bookmark, Send, Calendar, Star, HelpCircle } from 'lucide-react';
import { api } from '../api';

interface SkillGapPageProps {
  opportunityId: string;
  savedOpps: any[];
  onBack: () => void;
  onSaveOpportunity: (id: string) => void;
  onUnsaveOpportunity: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({
  opportunityId,
  savedOpps,
  onBack,
  onSaveOpportunity,
  onUnsaveOpportunity,
  onNavigate,
}) => {
  const [opp, setOpp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchOpportunityDetails();
  }, [opportunityId]);

  const fetchOpportunityDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getOpportunityDetails(opportunityId);
      setOpp(data);
      setApplied(data.hasApplied);
    } catch (err: any) {
      setError(err.message || 'Error fetching details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.applyOpportunity(opportunityId);
      setApplied(true);
      alert('Application submitted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const isSaved = () => savedOpps.some(s => s.opportunityId === opportunityId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="font-bold text-slate-500">Calculating skill gaps...</span>
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <h2 className="font-bold text-lg text-brand-900">Error Loading Opportunity</h2>
        <p className="text-slate-500">{error || 'The requested opportunity could not be found.'}</p>
        <button onClick={onBack} className="mt-2 px-4 py-2 bg-brand-900 text-white rounded-lg font-bold text-sm">Back</button>
      </div>
    );
  }

  const matchDetails = opp.matchDetails;
  const scoreColor = matchDetails?.score >= 85 
    ? 'text-green-700 bg-green-50 border-green-200' 
    : matchDetails?.score >= 70 
      ? 'text-blue-700 bg-blue-50 border-blue-200' 
      : 'text-amber-700 bg-amber-50 border-amber-200';

  const scoreLabel = matchDetails?.score >= 85 
    ? 'Excellent Fit' 
    : matchDetails?.score >= 70 
      ? 'Good Fit' 
      : 'Partial Fit';

  // Separate missing skills by priority
  const highPriorityGaps = matchDetails?.missingSkills.filter((m: any) => m.priority === 'High') || [];
  const mediumPriorityGaps = matchDetails?.missingSkills.filter((m: any) => m.priority === 'Medium') || [];
  const lowPriorityGaps = matchDetails?.missingSkills.filter((m: any) => m.priority === 'Low') || [];

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      {/* Header Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-900 font-bold text-sm border border-slate-200 hover:border-slate-300 bg-white px-4 py-2 rounded-xl shadow-sm transition-all w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Opportunities
      </button>

      {/* Main Details Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs bg-brand-50 text-brand-900 font-bold px-3 py-1 rounded-full border border-brand-100 uppercase tracking-wider">
                {opp.type}
              </span>
              <span className="text-xs bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full border border-slate-200 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Posted {new Date(opp.postedDate).toLocaleDateString()}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-brand-900 leading-tight">{opp.title}</h1>
            <span className="font-bold text-lg text-slate-600">{opp.organization}</span>
            
            <div className="flex flex-wrap gap-4 text-slate-500 text-sm font-semibold mt-1">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {opp.location} ({opp.workType})</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {opp.duration}</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-slate-400" /> Experience Level: {opp.experienceLevel}</span>
            </div>
          </div>

          {matchDetails && (
            <div className={`px-5 py-4 border rounded-2xl flex flex-col items-center gap-1 font-bold ${scoreColor} shadow-sm w-36 shrink-0`}>
              <span className="text-3xl leading-none">{matchDetails.score}%</span>
              <span className="text-xs uppercase tracking-wider opacity-90">{scoreLabel}</span>
            </div>
          )}
        </div>

        {/* Opportunity Description */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-lg text-brand-900">Job Description</h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{opp.description}</p>
        </div>

        {/* Dynamic Match Explanation & Sub-scores */}
        {matchDetails && (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col gap-6">
            <h3 className="font-extrabold text-lg text-brand-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" /> Matching Engine Calculation Breakdown
            </h3>
            
            {/* Explanations List */}
            <div className="flex flex-col gap-2">
              {matchDetails.explanations.map((exp: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{exp}</span>
                </div>
              ))}
            </div>

            {/* Score Weights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border-t border-slate-200 pt-6">
              {[
                { label: 'Skills Match', val: matchDetails.breakdown.skillScore, max: 50 },
                { label: 'Education', val: matchDetails.breakdown.educationScore, max: 15 },
                { label: 'Experience', val: matchDetails.breakdown.experienceScore, max: 10 },
                { label: 'Interests', val: matchDetails.breakdown.interestScore, max: 10 },
                { label: 'Career Prefs', val: matchDetails.breakdown.careerScore, max: 15 }
              ].map((sub, idx) => (
                <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col gap-1 text-center shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{sub.label}</span>
                  <span className="text-lg font-extrabold text-brand-900">{sub.val} <span className="text-xs text-slate-400 font-semibold">/ {sub.max}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Gap Analysis */}
        {matchDetails && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Matched Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
              <h4 className="font-extrabold text-green-700 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Matched Skills ({matchDetails.matchedSkills.length})
              </h4>
              
              {matchDetails.matchedSkills.length === 0 ? (
                <span className="text-slate-400 text-sm font-semibold">None of your skills matched the requirements yet.</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {matchDetails.matchedSkills.map((name: string) => (
                    <span key={name} className="px-3.5 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 font-bold text-xs">
                      ✓ {name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills & Gaps */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
              <h4 className="font-extrabold text-amber-700 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Skill Gaps & Missing Competencies ({matchDetails.missingSkills.length})
              </h4>
              
              {matchDetails.missingSkills.length === 0 ? (
                <span className="text-green-600 text-sm font-bold">Excellent! You have no missing required skills.</span>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* High Priority Missing */}
                  {highPriorityGaps.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">High Priority (Required)</span>
                      <div className="flex flex-wrap gap-2">
                        {highPriorityGaps.map((m: any) => (
                          <span key={m.name} className="px-3.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-xs">
                            ⚠ {m.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medium Priority Missing */}
                  {mediumPriorityGaps.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Medium Priority (Preferred)</span>
                      <div className="flex flex-wrap gap-2">
                        {mediumPriorityGaps.map((m: any) => (
                          <span key={m.name} className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs">
                            ⚠ {m.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => onNavigate('learning')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors text-left mt-2 underline cursor-pointer"
                  >
                    View recommended courses and learning paths to resolve these gaps.
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleApply}
            disabled={applied || applying}
            className={`flex-1 w-full py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-sm transition-all hover:scale-[1.01] ${applied ? 'bg-green-100 text-green-700 border border-green-200 shadow-none cursor-not-allowed' : 'bg-brand-900 text-white hover:bg-brand-800 shadow-brand-900/10'}`}
          >
            <Send className="w-4.5 h-4.5" />
            {applying ? 'Submitting...' : applied ? 'Application Submitted!' : 'Apply for Opportunity'}
          </button>
          
          <button
            onClick={() => isSaved() ? onUnsaveOpportunity(opportunityId) : onSaveOpportunity(opportunityId)}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${isSaved() ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            {isSaved() ? 'Remove from Saved' : 'Save Opportunity'}
          </button>
        </div>
      </div>
    </div>
  );
};
