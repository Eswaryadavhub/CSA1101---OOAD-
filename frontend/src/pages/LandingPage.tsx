import React from 'react';
import { ArrowRight, Target, Sparkles, BookOpen, TrendingUp, ShieldCheck, HelpCircle } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-xl bg-brand-900 flex items-center justify-center shadow-lg shadow-brand-900/20 text-white font-bold text-xl">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight text-brand-900">SkillMatch <span className="text-blue-600">AI</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <a href="#how-it-works" className="hover:text-brand-900 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-brand-900 transition-colors">Features</a>
          <a href="#statistics" className="hover:text-brand-900 transition-colors">Stats</a>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenLogin}
            className="px-5 py-2.5 rounded-xl text-brand-900 font-semibold hover:bg-slate-100 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={onOpenLogin}
            className="px-5 py-2.5 rounded-xl bg-brand-900 text-white font-semibold shadow-lg shadow-brand-900/10 hover:bg-brand-800 transition-all hover:scale-[1.02]"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 text-left animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm w-fit">
            <Sparkles className="w-4 h-4 text-blue-600" />
            AI-Powered Matching Engine
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-900 leading-tight">
            Find the Right Opportunity for Your <span className="text-blue-600">Skills</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
            SkillMatch AI analyzes your skills, interests, and career goals to connect you with opportunities that fit you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button 
              onClick={onOpenLogin}
              className="px-6 py-3.5 rounded-xl bg-brand-900 text-white font-bold shadow-xl shadow-brand-900/20 hover:bg-brand-800 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onOpenLogin}
              className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-brand-900 font-bold hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              Explore Opportunities
            </button>
          </div>
        </div>
        
        {/* Hero Visual Mockup */}
        <div className="relative flex justify-center items-center">
          <div className="w-full max-w-md h-[400px] rounded-3xl bg-gradient-to-tr from-brand-900 to-blue-700 p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">SM</div>
                <span className="font-semibold text-sm">Dashboard Preview</span>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            
            <div className="flex flex-col gap-4 bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-sm opacity-80">Software Developer Match</div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-extrabold">92%</span>
                <span className="text-xs bg-green-500/80 px-2 py-0.5 rounded-full font-bold">Excellent Fit</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-green-400 h-full w-[92%]" />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded">Java</span>
                <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded">SQL</span>
                <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded">Git</span>
              </div>
            </div>

            <div className="flex justify-between text-xs opacity-75">
              <span>Calculating skill gaps...</span>
              <span className="underline cursor-pointer">View analysis</span>
            </div>
          </div>
          {/* Decorative Backdrops */}
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-brand-900/10 rounded-full blur-3xl -z-10" />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20 px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto text-center flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Get matched and grow your career in four simple steps.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Build Your Profile', desc: 'Add your degree, preferences, education, and career interests.' },
              { num: '2', title: 'Analyze Your Skills', desc: 'Input your skills and declare your current proficiency level.' },
              { num: '3', title: 'Match Opportunities', desc: 'Our algorithm computes detailed scores for internships and jobs.' },
              { num: '4', title: 'Grow Your Career', desc: 'Identify skill gaps and follow personalized learning paths.' }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-900 font-extrabold text-lg flex items-center justify-center mb-4 border border-brand-100 group-hover:bg-brand-900 group-hover:text-white transition-all">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg text-brand-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900">Key Platform Features</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Powered by a matching engine tailored to educational programs.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Target className="w-6 h-6 text-blue-600" />, title: 'Intelligent Matching', desc: 'Dynamic calculations weighting skills, experiences, and education.' },
              { icon: <HelpCircle className="w-6 h-6 text-amber-500" />, title: 'Skill Gap Analysis', desc: 'Identifies exactly which required skills are missing and flags priority.' },
              { icon: <TrendingUp className="w-6 h-6 text-green-600" />, title: 'Career Recommendations', desc: 'Maps your unique profile compatibility score against 8 major career tracks.' },
              { icon: <BookOpen className="w-6 h-6 text-indigo-600" />, title: 'Personalized Learning', desc: 'Curates standard learning resources to directly patch identified gaps.' }
            ].map((feat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-lg text-brand-900">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section id="statistics" className="bg-brand-900 py-16 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative">
          {[
            { value: '500+', label: 'Opportunities' },
            { value: '100+', label: 'Skills Tracked' },
            { value: '20+', label: 'Career Paths' },
            { value: '92%', label: 'Matching Accuracy' }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{stat.value}</span>
              <span className="text-sm text-slate-300 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-white text-sm">S</div>
            <span className="font-bold text-white">SkillMatch AI</span>
          </div>
          <div className="text-sm text-center md:text-right">
            &copy; 2026 SkillMatch AI Capstone Project. Structured under OOAD Principles.
          </div>
        </div>
      </footer>
    </div>
  );
};
