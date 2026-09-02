import React from 'react';
import { Bookmark, MapPin, Clock, Trash2, ExternalLink, AlertCircle } from 'lucide-react';

interface SavedOpportunitiesPageProps {
  savedOpps: any[];
  onSelectOpportunity: (id: string) => void;
  onUnsaveOpportunity: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const SavedOpportunitiesPage: React.FC<SavedOpportunitiesPageProps> = ({
  savedOpps,
  onSelectOpportunity,
  onUnsaveOpportunity,
  onNavigate,
}) => {
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-brand-900">Saved Opportunities</h1>
        <p className="text-slate-500 font-medium">Bookmarked internships, jobs, and learning items. Click to analyze gaps and apply.</p>
      </div>

      {savedOpps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <Bookmark className="w-12 h-12 text-slate-300" />
          <span className="font-extrabold text-lg text-brand-900">No Saved Opportunities</span>
          <p className="text-slate-400 text-sm max-w-sm">Browse the listings database and hit the bookmark flag to save items here.</p>
          <button 
            onClick={() => onNavigate('opportunities')} 
            className="mt-2 px-4 py-2 bg-brand-900 text-white rounded-lg font-bold text-sm"
          >
            Explore Opportunities
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {savedOpps.map((item) => {
            const scoreColor = item.matchScore >= 85 
              ? 'bg-green-100 text-green-700' 
              : item.matchScore >= 70 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-amber-100 text-amber-700';

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="inline-block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.type}</span>
                      <h3 
                        className="font-extrabold text-lg text-brand-900 leading-snug hover:text-blue-600 cursor-pointer"
                        onClick={() => onSelectOpportunity(item.opportunityId)}
                      >
                        {item.title}
                      </h3>
                      <span className="font-semibold text-slate-600 text-sm">{item.organization}</span>
                    </div>

                    {item.matchScore > 0 && (
                      <div className={`px-2.5 py-1 rounded-lg ${scoreColor} font-bold text-xs shrink-0 shadow-sm`}>
                        {item.matchScore}% Match
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-slate-500 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.duration}
                    </span>
                  </div>

                  {item.skills && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.skills.map((skillName: string) => (
                        <span key={skillName} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                          {skillName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-5">
                  <button 
                    onClick={() => onSelectOpportunity(item.opportunityId)}
                    className="flex-1 py-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Gaps & Apply
                  </button>
                  
                  <button 
                    onClick={() => onUnsaveOpportunity(item.opportunityId)}
                    className="p-2 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
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
