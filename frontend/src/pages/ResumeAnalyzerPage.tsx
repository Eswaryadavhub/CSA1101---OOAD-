import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Upload, CheckCircle, Plus, X, Sparkles, TrendingUp, 
  Award, BookOpen, Briefcase, GraduationCap, ArrowRight, 
  Check, AlertCircle, RefreshCw, Eye, Target, Compass, ArrowUpRight,
  Code2, Database, Cloud, Wrench, ChevronRight
} from 'lucide-react';
import { extractResumeText } from '../utils/resumeExtractor';
import { analyzeResume } from '../utils/resumeAnalyzer';
import type { ResumeAnalysisResult, DetectedSkill } from '../utils/resumeAnalyzer';
import { api } from '../api';

interface ResumeAnalyzerPageProps {
  currentSkills: any[];
  onSkillsUpdated: () => void;
  onNavigate: (page: string) => void;
}

export const ResumeAnalyzerPage: React.FC<ResumeAnalyzerPageProps> = ({
  currentSkills,
  onSkillsUpdated,
  onNavigate,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [addedSkillNames, setAddedSkillNames] = useState<string[]>([]);
  const [ignoredSkillNames, setIgnoredSkillNames] = useState<string[]>([]);
  const [addingSkillName, setAddingSkillName] = useState<string | null>(null);
  const [showRawText, setShowRawText] = useState(false);
  const [recommendedOpps, setRecommendedOpps] = useState<any[]>([]);
  const [recommendedPlan, setRecommendedPlan] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load previously analyzed resume profile if present
    const existing = api.getResumeProfile ? api.getResumeProfile() : null;
    if (existing) {
      setResult(existing);
      loadPreviews();
    }
  }, []);

  const loadPreviews = async () => {
    try {
      const [opps, plan] = await Promise.all([
        api.getOpportunities(),
        api.getLearningPath(),
      ]);
      setRecommendedOpps((opps || []).slice(0, 3));
      setRecommendedPlan((plan || []).slice(0, 3));
    } catch (err) {
      console.error('Error loading previews:', err);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const ext = selectedFile.name.toLowerCase();
    if (!ext.endsWith('.pdf') && !ext.endsWith('.docx') && !ext.endsWith('.txt')) {
      setError('Please upload a supported file format: PDF, DOCX, or TXT.');
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please choose or drag & drop a resume file first.');
      return;
    }

    setAnalyzing(true);
    setError('');
    try {
      const rawText = await extractResumeText(file);
      if (!rawText || rawText.trim().length < 20) {
        throw new Error('Unable to extract sufficient text from the resume. Please ensure the document contains readable text.');
      }
      
      const analysis = analyzeResume(rawText, currentSkills);
      setResult(analysis);
      setAddedSkillNames([]);
      setIgnoredSkillNames([]);

      // AUTOMATIC RESUME-BASED PROFILE INTEGRATION
      // Save this structured profile as the active resume profile
      const storedProfile = {
        ...analysis,
        fileName: file.name,
      };
      api.setResumeProfile(storedProfile);

      // Notify parent to refresh Student Dashboard, Skills, Opportunities, Matches, Gaps, Career Paths, and Learning Plan
      onSkillsUpdated();

      // Refresh opportunity matches and learning plan previews
      const [opps, plan] = await Promise.all([
        api.getOpportunities(),
        api.getLearningPath(),
      ]);
      setRecommendedOpps((opps || []).slice(0, 3));
      setRecommendedPlan((plan || []).slice(0, 3));
    } catch (err: any) {
      console.error('Resume analysis error:', err);
      setError(err.message || 'An error occurred during resume analysis. Please try again or upload a TXT/DOCX copy.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddSkill = async (skill: DetectedSkill) => {
    setAddingSkillName(skill.name);
    try {
      await api.addSkill({
        skillName: skill.name,
        category: skill.category,
        proficiency: skill.proficiency || 'Intermediate',
      });
      setAddedSkillNames(prev => [...prev, skill.name]);
      onSkillsUpdated();
      loadPreviews();
    } catch (err: any) {
      console.error('Error adding detected skill:', err);
    } finally {
      setAddingSkillName(null);
    }
  };

  const handleIgnoreSkill = (skillName: string) => {
    setIgnoredSkillNames(prev => [...prev, skillName]);
  };

  const handleAddAllSkills = async () => {
    if (!result) return;
    const pendingSkills = result.detectedSkills.filter(
      s => !s.isExisting && !addedSkillNames.includes(s.name) && !ignoredSkillNames.includes(s.name)
    );

    for (const skill of pendingSkills) {
      try {
        await api.addSkill({
          skillName: skill.name,
          category: skill.category,
          proficiency: skill.proficiency,
        });
        setAddedSkillNames(prev => [...prev, skill.name]);
      } catch (err) {
        console.error('Error in batch adding skill:', skill.name, err);
      }
    }
    onSkillsUpdated();
    loadPreviews();
  };

  const visibleSkills = result?.detectedSkills.filter(
    s => !ignoredSkillNames.includes(s.name)
  ) || [];

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-xs w-fit">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Autonomous Resume-Based Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">AI Resume Analyzer</h1>
        <p className="text-slate-500 font-medium">
          Upload your resume in PDF, DOCX, or TXT format. The system automatically creates your Resume Profile and updates your Skills, Opportunity Matches, Skill Gaps, and Personalized Learning Plan.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col gap-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
            dragOver 
              ? 'border-blue-600 bg-blue-50/50' 
              : file 
                ? 'border-green-500 bg-green-50/30' 
                : 'border-slate-300 hover:border-brand-900 hover:bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
          />

          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${file ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
            {file ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8 text-blue-600" />}
          </div>

          <div className="flex flex-col gap-1">
            {file ? (
              <>
                <span className="font-extrabold text-lg text-brand-900">{file.name}</span>
                <span className="text-xs font-semibold text-slate-400">{(file.size / 1024).toFixed(1)} KB &bull; Click or drop another file to replace</span>
              </>
            ) : (
              <>
                <span className="font-extrabold text-lg text-brand-900">Drag and Drop Resume Here</span>
                <span className="text-sm font-semibold text-slate-500">or <span className="text-blue-600 underline">Choose File</span> from your computer</span>
                <span className="text-xs text-slate-400 mt-2 font-medium">Supported file formats: PDF, DOCX, TXT</span>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <span className="text-xs text-slate-400 font-medium">
            Safe in-browser parsing. Your resume is analyzed securely on your device.
          </span>

          <button
            onClick={handleAnalyze}
            disabled={!file || analyzing}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
              !file || analyzing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-brand-900 hover:bg-brand-800 text-white shadow-brand-900/20 hover:scale-[1.02]'
            }`}
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-400" />
                Analyze Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="flex flex-col gap-8 animate-fade-in-up">
          {/* Resume Profile Summary Card */}
          <div className="bg-gradient-to-br from-brand-900 via-slate-900 to-blue-950 text-white rounded-3xl p-8 shadow-xl flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-blue-500/25 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                    Structured Resume Profile
                  </span>
                  <span className="text-xs text-slate-400">Synchronized with Student Profile</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight">
                  Career Direction: <span className="text-blue-300">{result.careerDirection || 'Full Stack Software Developer'}</span>
                </h2>
              </div>

              {/* Primary CTA button requested by user */}
              <button
                onClick={() => onNavigate('learning')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                Generate Personalized Learning Plan
              </button>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
              {result.summary}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resume Strength</span>
                <span className="text-3xl font-black text-white mt-1">{result.resumeStrength}%</span>
                <span className="text-[10px] text-green-400 font-semibold mt-0.5">High Potential</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Skills</span>
                <span className="text-3xl font-black text-white mt-1">{result.detectedSkills.length}</span>
                <span className="text-[10px] text-blue-300 font-semibold mt-0.5">Categorized</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opportunities Improved</span>
                <span className="text-3xl font-black text-blue-400 mt-1">+{result.opportunitiesImproved}</span>
                <span className="text-[10px] text-slate-300 font-semibold mt-0.5">Recalculated</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Gaps Identified</span>
                <span className="text-3xl font-black text-amber-400 mt-1">{result.skillGapsIdentified}</span>
                <span className="text-[10px] text-amber-200/80 font-semibold mt-0.5">Targeted in Plan</span>
              </div>
            </div>
          </div>

          {/* Strong Skills, Skills to Improve, Missing Skills Comparison Card */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Strong Skills */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-extrabold text-sm text-brand-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" /> Strong Skills
                </span>
                <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200">
                  {result.strongSkills.length} Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Demonstrated with solid foundation or intermediate/advanced proficiency in your resume.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.strongSkills.map(sk => (
                  <span key={sk} className="px-3 py-1 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs font-bold">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills to Improve */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-extrabold text-sm text-brand-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" /> Skills to Improve
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  {result.skillsToImprove.length} In Progress
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Detected with entry-level or foundational exposure. Advancing these will expand match eligibility.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.skillsToImprove.length > 0 ? (
                  result.skillsToImprove.map(sk => (
                    <span key={sk} className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold">
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-medium">All detected skills possess intermediate+ proficiency.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-extrabold text-sm text-brand-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-600" /> Missing Target Skills
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                  {result.missingSkills.length} Prioritized
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Core requirements across matched opportunities in your {result.careerDirection} path.</p>
              <div className="flex flex-col gap-2 pt-1">
                {result.missingSkills.map(m => (
                  <div key={m.name} className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs">
                    <span className="font-bold text-amber-900">{m.name}</span>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{m.priority} Priority</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detected Skills Action Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-brand-900">Skills Detected from Your Resume</h2>
                <p className="text-slate-500 text-sm font-medium">
                  Review and confirm individual detected skills. All confirmed skills dynamically boost your compatibility scores.
                </p>
              </div>

              {visibleSkills.some(s => !s.isExisting && !addedSkillNames.includes(s.name)) && (
                <button
                  onClick={handleAddAllSkills}
                  className="px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add All New Skills
                </button>
              )}
            </div>

            {visibleSkills.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No new skills to review. All detected skills have been added or dismissed.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleSkills.map((skill) => {
                  const isAdded = addedSkillNames.includes(skill.name) || skill.isExisting;
                  const isPending = addingSkillName === skill.name;

                  return (
                    <div
                      key={skill.name}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                        isAdded
                          ? 'bg-slate-50 border-slate-200 opacity-90'
                          : 'bg-white border-blue-100 shadow-sm hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-base text-brand-900 leading-snug">{skill.name}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{skill.category}</span>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isAdded 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {isAdded ? 'In Profile' : skill.proficiency}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        {isAdded ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600">
                            <Check className="w-3.5 h-3.5" /> Added to Inventory
                          </span>
                        ) : (
                          <div className="flex items-center gap-2 w-full justify-end">
                            <button
                              onClick={() => handleIgnoreSkill(skill.name)}
                              className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              Ignore
                            </button>
                            <button
                              onClick={() => handleAddSkill(skill)}
                              disabled={isPending}
                              className="px-3.5 py-1.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-[1.02]"
                            >
                              {isPending ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                              + Add to My Skills
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Categorized Skills Breakdown Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-3">
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> Languages & Web
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[...result.programmingLanguages, ...result.frameworks].map(s => (
                  <span key={s} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-3">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4" /> Databases & Storage
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.databases.length > 0 ? (
                  result.databases.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">None detected</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-3">
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                <Cloud className="w-4 h-4" /> Cloud & DevOps
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.cloudTechnologies.length > 0 ? (
                  result.cloudTechnologies.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">None detected</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-3">
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4" /> Tools & Libraries
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[...result.libraries, ...result.developerTools].length > 0 ? (
                  [...result.libraries, ...result.developerTools].map(s => (
                    <span key={s} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">None detected</span>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Opportunities & Learning Plan Live Previews */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Opportunities Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-extrabold text-lg text-brand-900">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Recommended Opportunities
                  </div>
                  <button 
                    onClick={() => onNavigate('opportunities')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {recommendedOpps.map((opp) => (
                    <div 
                      key={opp.id} 
                      onClick={() => onNavigate('opportunities')}
                      className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/70 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-extrabold text-sm text-brand-900">{opp.title}</span>
                        <span className="text-xs text-slate-400 font-semibold">{opp.organization} &bull; {opp.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-blue-600">{opp.matchScore || 85}%</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('opportunities')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-brand-900 font-bold text-xs rounded-xl transition-all text-center"
              >
                Browse All Matched Opportunities
              </button>
            </div>

            {/* Recommended Learning Plan Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-extrabold text-lg text-brand-900">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Recommended Learning Plan
                  </div>
                  <button 
                    onClick={() => onNavigate('learning')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Open Plan <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {recommendedPlan.map((res) => (
                    <div 
                      key={res.id}
                      className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{res.skill}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {res.source}
                        </span>
                      </div>
                      <span className="font-extrabold text-sm text-brand-900 leading-snug">{res.title}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{res.whyRecommended}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('learning')}
                className="w-full py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-brand-900/10"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                Generate Personalized Learning Plan
              </button>
            </div>
          </div>

          {/* Raw Text Toggle */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowRawText(!showRawText)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> {showRawText ? 'Hide Extracted Resume Text' : 'View Extracted Resume Text'}
            </button>
          </div>

          {showRawText && (
            <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre-wrap border border-slate-800">
              {result.rawTextPreview}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
