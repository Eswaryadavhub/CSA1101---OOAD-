import React, { useState, useEffect } from 'react';
import { Target, MapPin, Clock, ArrowUpDown, ChevronRight } from 'lucide-react';

interface MatchResultsPageProps {
  opportunities: any[];
  onSelectOpportunity: (id: string) => void;
}

export const MatchResultsPage: React.FC<MatchResultsPageProps> = ({
  opportunities,
  onSelectOpportunity,
}) => {
  const [sortKey, setSortKey] = useState<'score' | 'date' | 'title'>('score');
  const [sortedOpps, setSortedOpps] = useState<any[]>([]);

  useEffect(() => {
    const list = [...opportunities];
    if (sortKey === 'score') {
      list.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortKey === 'date') {
      list.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    } else if (sortKey === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    setSortedOpps(list);
  }, [opportunities, sortKey]);

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-brand-900">Ranked Matching Results</h1>
          <p className="text-slate-500 font-medium">Your profile parsed against all postings, sorted dynamically by compatibility.</p>
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm shrink-0">
          {[
            { id: 'score', label: 'Match Score' },
            { id: 'date', label: 'Date Posted' },
            { id: 'title', label: 'Role Title' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setSortKey(opt.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortKey === opt.id ? 'bg-brand-900 text-white shadow-sm' : 'text-slate-500 hover:text-brand-900'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {sortedOpps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <Target className="w-12 h-12 text-slate-300 animate-pulse" />
          <span className="font-extrabold text-lg text-brand-900">No Match Calculations Found</span>
          <p className="text-slate-400 text-sm max-w-md">Make sure you have skills registered in your inventory, and that opportunities are added to the database.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {sortedOpps.map((opp, index) => {
            const scoreColor = opp.matchScore >= 85 
              ? 'text-green-600 bg-green-50 border-green-200' 
              : opp.matchScore >= 70 
                ? 'text-blue-600 bg-blue-50 border-blue-200' 
                : 'text-amber-600 bg-amber-50 border-amber-200';

            return (
              <div 
                key={opp.id} 
                onClick={() => onSelectOpportunity(opp.id)}
                className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer group"
              >
                <div className="flex items-center gap-5">
                  {/* Rank Indicator */}
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-extrabold text-slate-500 shrink-0 border border-slate-200">
                    #{index + 1}
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-brand-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                        {opp.title}
                      </h3>
                      <span className="text-xs bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200/50">
                        {opp.type}
                      </span>
                    </div>
                    
                    <span className="font-bold text-sm text-slate-500">{opp.organization}</span>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {opp.location} ({opp.workType})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {opp.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <div className={`px-4 py-2 border rounded-xl flex flex-col items-center gap-0.5 font-bold ${scoreColor} shadow-sm w-24`}>
                    <span className="text-xl leading-none">{opp.matchScore}%</span>
                    <span className="text-[8px] uppercase tracking-wider opacity-85">Compatibility</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-slate-100 transition-all shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
