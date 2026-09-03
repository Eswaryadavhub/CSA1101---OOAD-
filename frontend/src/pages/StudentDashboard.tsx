import React from 'react';
import { User, Award, CheckSquare, Target, MapPin, Clock, Bookmark, ChevronRight, AlertCircle, Briefcase } from 'lucide-react';

interface StudentDashboardProps {
  profile: any;
  skills: any[];
  opportunities: any[];
  savedOpps: any[];
  onNavigate: (page: string) => void;
  onSelectOpportunity: (id: string) => void;
  onSaveOpportunity: (id: string) => void;
  onUnsaveOpportunity: (id: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  skills,
  opportunities,
  savedOpps,
  onNavigate,
  onSelectOpportunity,
  onSaveOpportunity,
  onUnsaveOpportunity,
}) => {
  // Compute some dashboard statistics
  const profileCompletion = () => {
    let fields = [profile?.name, profile?.degree, profile?.department, profile?.university, profile?.interests, profile?.preferredRole];
    let filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const topMatch = opportunities.length > 0 ? opportunities[0].matchScore : 0;
  const totalSkills = skills.length;
  const matchedOpps = opportunities.filter(o => o.matchScore >= 50).length;

  const isSaved = (oppId: string) => savedOpps.some(s => s.opportunityId === oppId);

  // Greet student depending on local time
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-blue-800 text-white rounded-3xl p-8 shadow-xl shadow-brand-900/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div className="flex flex-col gap-2 relative">
          <h1 className="text-3xl md:text-4xl font-extrabold">{getGreeting()}, {profile?.name || 'Student'}</h1>
          <p className="text-blue-100 font-medium">Ready to discover matches? Here is your personalized match status.</p>
        </div>
        <button 
          onClick={() => onNavigate('profile')}
          className="px-5 py-2.5 bg-white text-brand-900 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-slate-50 transition-all flex items-center gap-2 hover:scale-[1.02] text-sm"
        >
          <User className="w-4 h-4" /> Edit Career Profile
        </button>
      </div>

      {/* AI Resume Analyzer Callout */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/70 to-purple-50/50 border border-blue-100 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-extrabold text-base text-brand-900">Import Skills from your Resume</span>
            <span className="text-xs text-slate-500 font-medium">Upload your resume (PDF, DOCX, TXT) to automatically detect skills and instantly recalculate opportunity matches.</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('resume-analyzer')}
          className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 shadow-md shadow-brand-900/10 hover:scale-[1.02]"
        >
          Launch Resume Analyzer <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Award className="w-5 h-5 text-blue-600" />, label: 'Profile Completion', value: `${profileCompletion()}%`, desc: 'Complete profile for matches', onClick: () => onNavigate('profile') },
          { icon: <Target className="w-5 h-5 text-green-600" />, label: 'Top Match Score', value: `${topMatch}%`, desc: 'Highest matches based on skills', onClick: () => onNavigate('matches') },
          { icon: <CheckSquare className="w-5 h-5 text-indigo-600" />, label: 'Skills Registered', value: totalSkills, desc: 'Add skills to matching profile', onClick: () => onNavigate('skills') },
          { icon: <Briefcase className="w-5 h-5 text-purple-600" />, label: 'Matched Opportunities', value: matchedOpps, desc: 'Matched at >= 50% compatibility', onClick: () => onNavigate('opportunities') }
        ].map((card, idx) => (
          <div 
            key={idx} 
            onClick={card.onClick}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-500">{card.label}</span>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-100 transition-all">
                {card.icon}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-extrabold text-brand-900">{card.value}</span>
              <span className="text-xs text-slate-400 font-medium">{card.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Opportunity Matches Section */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-brand-900">Top Opportunity Matches</h2>
          <button 
            onClick={() => onNavigate('opportunities')}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            See All Opportunities <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {opportunities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center gap-3">
            <AlertCircle className="w-8 h-8 text-slate-400" />
            <span className="font-semibold text-slate-600">No opportunities matched yet.</span>
            <p className="text-sm text-slate-400 max-w-sm">Try adding more skills to your profile or adjusting your career preferences to run the Matching Engine.</p>
            <button onClick={() => onNavigate('skills')} className="mt-2 px-4 py-2 bg-brand-900 text-white rounded-lg font-bold text-sm">Add Skills</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {opportunities.slice(0, 4).map((opp) => {
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
                <div key={opp.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="inline-block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{opp.type}</span>
                        <h3 className="font-extrabold text-lg text-brand-900 leading-snug hover:text-blue-600 cursor-pointer" onClick={() => onSelectOpportunity(opp.id)}>{opp.title}</h3>
                        <span className="font-semibold text-slate-600 text-sm">{opp.organization}</span>
                      </div>
                      
                      <div className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl ${scoreColor} font-bold text-xs shrink-0 shadow-sm`}>
                        <span className="text-lg">{opp.matchScore}%</span>
                        <span className="text-[9px] uppercase tracking-wider opacity-90">{scoreLabel}</span>
                      </div>
                    </div>

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

                    <div className="flex flex-col gap-1.5">
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
                      View Match Details
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
    </div>
  );
};
