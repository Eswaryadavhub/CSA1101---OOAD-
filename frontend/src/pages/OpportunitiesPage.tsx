import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Bookmark, AlertCircle, Sparkles, Filter, X } from 'lucide-react';
import { api } from '../api';

interface OpportunitiesPageProps {
  opportunities: any[];
  savedOpps: any[];
  onSelectOpportunity: (id: string) => void;
  onSaveOpportunity: (id: string) => void;
  onUnsaveOpportunity: (id: string) => void;
  onFilterChange: (filters: { type?: string; search?: string; skill?: string }) => void;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({
  opportunities,
  savedOpps,
  onSelectOpportunity,
  onSaveOpportunity,
  onUnsaveOpportunity,
  onFilterChange,
}) => {
  const [typeFilter, setTypeFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onFilterChange({
      type: typeFilter || undefined,
      search: searchFilter || undefined,
      skill: skillFilter || undefined,
    });
  };

  const handleClearFilters = () => {
    setTypeFilter('');
    setSearchFilter('');
    setSkillFilter('');
    onFilterChange({});
  };

  const isSaved = (oppId: string) => savedOpps.some(s => s.opportunityId === oppId);

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-brand-900">Discover Opportunities</h1>
        <p className="text-slate-500 font-medium">Explore jobs, internships, projects, and learning resources mapped directly to your skills.</p>
      </div>

      {/* Filters Form */}
      <form onSubmit={handleApplyFilters} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid md:grid-cols-4 gap-4 items-end">
        {/* Search */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Keyword</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Title, company, role..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold"
            />
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opportunity Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-bold bg-white text-brand-900 cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Job">Job</option>
            <option value="Project">Project</option>
            <option value="Course">Course</option>
          </select>
        </div>

        {/* Skill */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter by Skill Name</label>
          <input
            type="text"
            placeholder="e.g. Java, Python, SQL"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 py-2.5 bg-brand-900 text-white rounded-xl font-bold hover:bg-brand-800 shadow-sm text-sm flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" /> Filter Matches
          </button>
          
          {(typeFilter || searchFilter || skillFilter) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="p-2.5 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-xl font-bold text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Opportunities Grid */}
      {opportunities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <AlertCircle className="w-12 h-12 text-slate-300" />
          <span className="font-extrabold text-lg text-brand-900">No Opportunities Found</span>
          <p className="text-slate-400 text-sm max-w-md">No postings matched your filters. Clear filters to explore all entries, or add more skills to matching profile.</p>
          <button onClick={handleClearFilters} className="mt-2 px-4 py-2 bg-brand-900 text-white rounded-lg font-bold text-sm">Clear Filters</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {opportunities.map((opp) => {
            const scoreColor = opp.matchScore >= 85 
              ? 'bg-green-100 text-green-700' 
              : opp.matchScore >= 70 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-amber-100 text-amber-700';

            const scoreLabel = opp.matchScore >= 85 
              ? 'Excellent Match' 
              : opp.matchScore >= 70 
                ? 'Good Match' 
                : 'Partial Match';

            return (
              <div key={opp.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="inline-block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{opp.type}</span>
                      <h3 
                        className="font-extrabold text-lg text-brand-900 leading-snug hover:text-blue-600 cursor-pointer" 
                        onClick={() => onSelectOpportunity(opp.id)}
                      >
                        {opp.title}
                      </h3>
                      <span className="font-semibold text-slate-600 text-sm">{opp.organization}</span>
                    </div>
                    
                    {opp.matchScore > 0 && (
                      <div className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl ${scoreColor} font-bold text-xs shrink-0 shadow-sm`}>
                        <span className="text-lg">{opp.matchScore}%</span>
                        <span className="text-[9px] uppercase tracking-wider opacity-90">{scoreLabel}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{opp.description}</p>

                  <div className="flex flex-wrap gap-4 text-slate-500 text-xs font-semibold">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.location} ({opp.workType})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.skills?.filter((os: any) => os.isRequired).map((os: any) => (
                        <span key={os.id} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold">
                          {os.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-5 mt-5">
                  <button 
                    onClick={() => onSelectOpportunity(opp.id)}
                    className="flex-1 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-sm shadow-sm transition-all"
                  >
                    View Details & Gaps
                  </button>
                  <button 
                    onClick={() => isSaved(opp.id) ? onUnsaveOpportunity(opp.id) : onSaveOpportunity(opp.id)}
                    className={`p-2.5 rounded-xl border ${isSaved(opp.id) ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' : 'bg-white border-slate-300 text-slate-400 hover:text-slate-600 hover:bg-slate-50'} transition-all`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
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
