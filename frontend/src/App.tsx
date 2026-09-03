import React, { useState, useEffect } from 'react';
import { 
  Home, User, Award, Briefcase, Target, AlertTriangle, 
  TrendingUp, BookOpen, Bookmark, LogOut, Menu, X, Lock, 
  MapPin, ShieldAlert, Sparkles, Send, Award as SkillsIcon,
  FileText
} from 'lucide-react';
import { api } from './api';

// Page Imports
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { SkillsPage } from './pages/SkillsPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { MatchResultsPage } from './pages/MatchResultsPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { CareerPathsPage } from './pages/CareerPathsPage';
import { LearningPlanPage } from './pages/LearningPlanPage';
import { SavedOpportunitiesPage } from './pages/SavedOpportunitiesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';

// App-wide ErrorBoundary to ensure white screen never occurs
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('SkillMatch UI Error Boundary caught an issue:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center gap-4 max-w-md shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-brand-900">Rendering Safeguard</h2>
            <p className="text-sm text-slate-500">A display issue was detected. Click below to return to the active view.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-sm transition-all"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // App-wide persistent state
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [savedOpps, setSavedOpps] = useState<any[]>([]);
  
  // Selected opportunity for gap analysis view
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);

  // Filters for opportunities
  const [oppFilters, setOppFilters] = useState<any>({});

  // Mobile sidebar collapsible
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    // Check if token exists in storage
    const token = localStorage.getItem('skillmatch_token');
    const cachedUser = localStorage.getItem('skillmatch_user');
    
    if (token && cachedUser) {
      const parsedUser = JSON.parse(cachedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'ADMIN') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('dashboard');
      }
    }
  }, []);

  useEffect(() => {
    if (user && user.role === 'STUDENT') {
      fetchStudentData();
    }
  }, [user, oppFilters]);

  const fetchStudentData = async () => {
    try {
      const profData = await api.getProfile();
      setProfile(profData);

      const skillData = await api.getSkills();
      setSkills(skillData.studentSkills);

      const oppsData = await api.getOpportunities(oppFilters);
      setOpportunities(oppsData);

      const savedData = await api.getSavedOpportunities();
      setSavedOpps(savedData);
    } catch (err) {
      console.error('Error fetching student data:', err);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const data = await api.login(email, password);
      localStorage.setItem('skillmatch_token', data.token);
      localStorage.setItem('skillmatch_user', JSON.stringify(data.user));
      
      setUser(data.user);
      setLoginModalOpen(false);
      setEmail('');
      setPassword('');

      if (data.user.role === 'ADMIN') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('dashboard');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('skillmatch_token');
    localStorage.removeItem('skillmatch_user');
    setUser(null);
    setProfile(null);
    setSkills([]);
    setOpportunities([]);
    setSavedOpps([]);
    setSelectedOppId(null);
    setCurrentPage('landing');
    setSidebarOpen(false);
  };

  const handleSaveOpportunity = async (id: string) => {
    try {
      await api.saveOpportunity(id);
      const savedData = await api.getSavedOpportunities();
      setSavedOpps(savedData);
      
      // Update details in local opportunities list
      setOpportunities(prev => prev.map(o => o.id === id ? { ...o, isSaved: true } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsaveOpportunity = async (id: string) => {
    try {
      await api.unsaveOpportunity(id);
      const savedData = await api.getSavedOpportunities();
      setSavedOpps(savedData);

      // Update details in local opportunities list
      setOpportunities(prev => prev.map(o => o.id === id ? { ...o, isSaved: false } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const triggerOpportunityView = (id: string) => {
    setSelectedOppId(id);
    setCurrentPage('gap');
    setSidebarOpen(false);
  };

  // Sidebar navigation configuration
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
    { id: 'skills', label: 'My Skills', icon: <Award className="w-5 h-5" /> },
    { id: 'resume-analyzer', label: 'AI Resume Analyzer', icon: <FileText className="w-5 h-5" /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'matches', label: 'Match Results', icon: <Target className="w-5 h-5" /> },
    { id: 'career', label: 'Career Paths', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'learning', label: 'Learning Plan', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'saved', label: 'Saved Items', icon: <Bookmark className="w-5 h-5" /> },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* LANDING PAGE ROUTE */}
      {currentPage === 'landing' && (
        <LandingPage 
          onNavigate={(page) => setCurrentPage(page)}
          onOpenLogin={() => {
            setLoginError('');
            setLoginModalOpen(true);
          }}
        />
      )}

      {/* DASHBOARDS WRAPPERS */}
      {currentPage !== 'landing' && user && (
        <div className="flex flex-1 relative">
          
          {/* Header Mobile Bar */}
          <header className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex md:hidden items-center justify-between z-30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-900 flex items-center justify-center font-bold text-white text-base">S</div>
              <span className="font-extrabold text-brand-900 text-base">SkillMatch AI</span>
            </div>
            
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </header>

          {/* Sidebar Drawer */}
          <aside className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-brand-900 text-slate-300 flex flex-col justify-between border-r border-brand-800 shadow-xl transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col gap-6 p-6">
              {/* Logo / Org Header */}
              <div className="flex items-center gap-2 border-b border-brand-800 pb-5">
                <div className="w-10 h-10 rounded-xl bg-white text-brand-900 flex items-center justify-center font-black text-xl shadow-md">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-white text-lg tracking-tight">SkillMatch AI</span>
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Capstone System</span>
                </div>
              </div>

              {/* Sidebar Menu Items */}
              {user.role === 'STUDENT' ? (
                <nav className="flex flex-col gap-1">
                  {sidebarItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-left transition-all ${currentPage === item.id ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              ) : (
                <nav className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setCurrentPage('admin');
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-left transition-all ${currentPage === 'admin' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <Home className="w-5 h-5" /> Admin Dashboard
                  </button>
                </nav>
              )}
            </div>

            {/* User Logged-in Footer info */}
            <div className="p-6 border-t border-brand-800 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5 max-w-[150px]">
                <span className="text-sm font-bold text-white truncate">{user.name || 'User'}</span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{user.role} Account</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl hover:bg-white/5 hover:text-white transition-colors text-slate-400"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </aside>

          {/* Main Layout Area */}
          <main className="flex-1 min-h-screen flex flex-col md:pl-0 pt-16 md:pt-0">
            <div className="max-w-7xl mx-auto w-full p-6 md:p-8 flex-1">
              {/* RENDERING DYNAMIC SCREENS */}
              {currentPage === 'dashboard' && user.role === 'STUDENT' && (
                <StudentDashboard 
                  profile={profile}
                  skills={skills}
                  opportunities={opportunities}
                  savedOpps={savedOpps}
                  onNavigate={(page) => setCurrentPage(page)}
                  onSelectOpportunity={triggerOpportunityView}
                  onSaveOpportunity={handleSaveOpportunity}
                  onUnsaveOpportunity={handleUnsaveOpportunity}
                />
              )}

              {currentPage === 'profile' && user.role === 'STUDENT' && (
                <ProfilePage 
                  initialProfile={profile}
                  onProfileUpdated={fetchStudentData}
                />
              )}

              {currentPage === 'skills' && user.role === 'STUDENT' && (
                <SkillsPage 
                  skills={skills}
                  onSkillsUpdated={fetchStudentData}
                />
              )}

              {currentPage === 'resume-analyzer' && user.role === 'STUDENT' && (
                <ResumeAnalyzerPage 
                  currentSkills={skills}
                  onSkillsUpdated={fetchStudentData}
                  onNavigate={(page) => setCurrentPage(page)}
                />
              )}

              {currentPage === 'opportunities' && user.role === 'STUDENT' && (
                <OpportunitiesPage 
                  opportunities={opportunities}
                  savedOpps={savedOpps}
                  onSelectOpportunity={triggerOpportunityView}
                  onSaveOpportunity={handleSaveOpportunity}
                  onUnsaveOpportunity={handleUnsaveOpportunity}
                  onFilterChange={(filters) => setOppFilters(filters)}
                />
              )}

              {currentPage === 'matches' && user.role === 'STUDENT' && (
                <MatchResultsPage 
                  opportunities={opportunities}
                  onSelectOpportunity={triggerOpportunityView}
                />
              )}

              {currentPage === 'gap' && user.role === 'STUDENT' && selectedOppId && (
                <SkillGapPage 
                  opportunityId={selectedOppId}
                  savedOpps={savedOpps}
                  onBack={() => {
                    setSelectedOppId(null);
                    setCurrentPage('opportunities');
                  }}
                  onSaveOpportunity={handleSaveOpportunity}
                  onUnsaveOpportunity={handleUnsaveOpportunity}
                  onNavigate={(page) => setCurrentPage(page)}
                />
              )}

              {currentPage === 'career' && user.role === 'STUDENT' && (
                <CareerPathsPage 
                  onNavigate={(page) => setCurrentPage(page)}
                />
              )}

              {currentPage === 'learning' && user.role === 'STUDENT' && (
                <LearningPlanPage 
                  onNavigate={(page) => setCurrentPage(page)}
                />
              )}

              {currentPage === 'saved' && user.role === 'STUDENT' && (
                <SavedOpportunitiesPage 
                  savedOpps={savedOpps}
                  onSelectOpportunity={triggerOpportunityView}
                  onUnsaveOpportunity={handleUnsaveOpportunity}
                  onNavigate={(page) => setCurrentPage(page)}
                />
              )}

              {currentPage === 'admin' && user.role === 'ADMIN' && (
                <AdminDashboard />
              )}
            </div>
          </main>
        </div>
      )}

      {/* LOGIN MODAL CONTAINER */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 md:p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-900 text-white flex items-center justify-center font-bold text-base shadow-md">S</div>
                <span className="font-extrabold text-brand-900 text-base">Sign in to SkillMatch AI</span>
              </div>
              <button 
                onClick={() => setLoginModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                Close
              </button>
            </div>

            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 font-semibold text-xs rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="student@skillmatch.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 bg-brand-900 text-white font-bold hover:bg-brand-800 rounded-xl shadow-lg shadow-brand-900/10 flex items-center justify-center gap-2 mt-2 transition-all hover:scale-[1.01] text-sm disabled:opacity-75"
              >
                <Lock className="w-4 h-4" />
                {loggingIn ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            {/* Demo Accounts Box info */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 text-xs text-slate-500 font-semibold">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Demo Accounts Credentials
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col border-r border-slate-200 pr-4">
                  <span className="text-[10px] text-slate-400">STUDENT ROLE</span>
                  <span className="font-bold text-slate-600 truncate">student@skillmatch.com</span>
                  <span>pass: student123</span>
                </div>
                <div className="flex flex-col pl-2">
                  <span className="text-[10px] text-slate-400">ADMIN ROLE</span>
                  <span className="font-bold text-slate-600 truncate">admin@skillmatch.com</span>
                  <span>pass: admin123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}
