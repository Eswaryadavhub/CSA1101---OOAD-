import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, CheckCircle, Plus, X, Sparkles, TrendingUp, 
  Award, BookOpen, Briefcase, GraduationCap, ArrowRight, 
  Check, AlertCircle, RefreshCw, Eye
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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
          Natural Language Resume Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">AI Resume Analyzer</h1>
        <p className="text-slate-500 font-medium">
          Upload your resume in PDF, DOCX, or TXT format. Our parser extracts your technical capabilities, education, and project background to instantly boost your match scores and recommendations.
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
          {/* Resume Match Summary Widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resume Strength</span>
                <span className="text-3xl font-extrabold text-brand-900">{result.resumeStrength}%</span>
                <span className="text-[11px] font-semibold text-green-600">Well Optimized</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills Detected</span>
                <span className="text-3xl font-extrabold text-brand-900">{result.detectedSkills.length}</span>
                <span className="text-[11px] font-semibold text-slate-500">Across All Categories</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opportunities Improved</span>
                <span className="text-3xl font-extrabold text-blue-600">+{result.opportunitiesImproved}</span>
                <span className="text-[11px] font-semibold text-slate-500">Higher Match Rates</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Gaps Identified</span>
                <span className="text-3xl font-extrabold text-amber-600">{result.skillGapsIdentified}</span>
                <span className="text-[11px] font-semibold text-slate-500">Target for Learning</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Detected Skills Action Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-brand-900">Skills Detected from Your Resume</h2>
                <p className="text-slate-500 text-sm font-medium">Review the detected skills below. You can confirm adding each skill to your profile or ignore it.</p>
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

          {/* Structured Analysis Results Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Technical Skills Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-blue-600 font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
                <Award className="w-4 h-4" /> Technical Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {result.technicalSkills.length > 0 ? (
                  result.technicalSkills.map(sk => (
                    <span key={sk} className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-medium">None detected</span>
                )}
              </div>
            </div>

            {/* Soft Skills Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
                <Sparkles className="w-4 h-4" /> Soft Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {result.softSkills.length > 0 ? (
                  result.softSkills.map(sk => (
                    <span key={sk} className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-100">
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-medium">None detected</span>
                )}
              </div>
            </div>

            {/* Education Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
                <GraduationCap className="w-4 h-4" /> Education
              </div>
              <ul className="flex flex-col gap-2 text-xs font-semibold text-slate-600 list-disc list-inside">
                {result.education.map((edu, idx) => (
                  <li key={idx} className="leading-relaxed">{edu}</li>
                ))}
              </ul>
            </div>

            {/* Experience Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-purple-600 font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
                <Briefcase className="w-4 h-4" /> Experience
              </div>
              <ul className="flex flex-col gap-2 text-xs font-semibold text-slate-600 list-disc list-inside">
                {result.experience.map((exp, idx) => (
                  <li key={idx} className="leading-relaxed">{exp}</li>
                ))}
              </ul>
            </div>

            {/* Projects Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4" /> Projects
              </div>
              <ul className="flex flex-col gap-2 text-xs font-semibold text-slate-600 list-disc list-inside">
                {result.projects.map((proj, idx) => (
                  <li key={idx} className="leading-relaxed">{proj}</li>
                ))}
              </ul>
            </div>

            {/* Certifications Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-cyan-600 font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
                <CheckCircle className="w-4 h-4" /> Certifications
              </div>
              <ul className="flex flex-col gap-2 text-xs font-semibold text-slate-600 list-disc list-inside">
                {result.certifications.map((cert, idx) => (
                  <li key={idx} className="leading-relaxed">{cert}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-extrabold">Recommended Next Steps</h3>
              <p className="text-slate-300 text-sm">Follow these action items to maximize your opportunity matches with your updated skills:</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => onNavigate('skills')}
                className="bg-white/10 hover:bg-white/15 p-5 rounded-2xl border border-white/10 flex flex-col justify-between gap-4 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Step 1</span>
                  <span className="font-extrabold text-sm">Add Detected Skills to Profile</span>
                  <p className="text-xs text-slate-300 leading-relaxed">Save detected skills to increase your registered technical breadth.</p>
                </div>
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1">Go to Skills <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>

              <div 
                onClick={() => onNavigate('opportunities')}
                className="bg-white/10 hover:bg-white/15 p-5 rounded-2xl border border-white/10 flex flex-col justify-between gap-4 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-green-300 uppercase tracking-wider">Step 2</span>
                  <span className="font-extrabold text-sm">View Updated Opportunities</span>
                  <p className="text-xs text-slate-300 leading-relaxed">Browse newly recalculated match scores across internships and jobs.</p>
                </div>
                <span className="text-xs font-bold text-green-300 flex items-center gap-1">Explore Matches <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>

              <div 
                onClick={() => onNavigate('learning-plan')}
                className="bg-white/10 hover:bg-white/15 p-5 rounded-2xl border border-white/10 flex flex-col justify-between gap-4 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Step 3</span>
                  <span className="font-extrabold text-sm">Generate Learning Plan</span>
                  <p className="text-xs text-slate-300 leading-relaxed">Close remaining skill gaps with direct course and certification recommendations.</p>
                </div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">Open Learning Plan <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>

              <div 
                onClick={() => onNavigate('career-paths')}
                className="bg-white/10 hover:bg-white/15 p-5 rounded-2xl border border-white/10 flex flex-col justify-between gap-4 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Step 4</span>
                  <span className="font-extrabold text-sm">Track Career Paths</span>
                  <p className="text-xs text-slate-300 leading-relaxed">Inspect your readiness percentage for target tech industry roles.</p>
                </div>
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1">View Careers <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          </div>

          {/* Raw Text Preview Toggle */}
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
