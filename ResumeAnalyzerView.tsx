
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { analyzeResumeContent } from '../services/geminiService';
import { FileText, Upload, ShieldCheck, ChevronRight, CheckCircle2, AlertTriangle, Lightbulb, Linkedin, Plus, Loader2 } from 'lucide-react';

interface Props {
  profile: UserProfile;
}

const ResumeAnalyzerView: React.FC<Props> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [targetRole, setTargetRole] = useState('');
  const [resumeText, setResumeText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulated PDF text extraction for demo
    setResumeText(`Experienced Frontend Developer with proficiency in React, Node.js, and Cloud Architecture. 
    Stanford CS Graduate. Built scalable SaaS platforms using TypeScript and AWS. 
    Seeking roles in Enterprise AI software development.`);
  };

  const handleAnalyze = async () => {
    if (!resumeText || !targetRole) return;
    setLoading(true);
    try {
      const result = await analyzeResumeContent(resumeText, targetRole);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center">
        <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Resume Analyzer</h2>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">
          Pass the bots and impress humans. Our ATS-aware AI identifies gaps and enhances your profile for target roles.
        </p>
      </div>

      {!analysis ? (
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-800">Target Role</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Senior Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-800">Upload Resume (PDF/DOC)</label>
              <div className="relative group">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-center gap-3 group-hover:bg-slate-50 transition-colors">
                  <Upload size={20} className="text-slate-400" />
                  <span className="text-sm text-slate-500 font-medium">
                    {resumeText ? "Resume uploaded ✓" : "Drop file or click to browse"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleAnalyze}
            disabled={loading || !resumeText || !targetRole}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={20} />}
            Analyze My Efficiency
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {/* Dashboard Header */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full border-8 border-slate-100 flex items-center justify-center bg-emerald-50 relative">
                <span className="text-3xl font-bold text-emerald-600">{analysis.score}</span>
                <div className="absolute -bottom-2 px-2 py-0.5 bg-emerald-600 text-[10px] text-white font-bold rounded">ATS SCORE</div>
              </div>
              <p className="mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest text-center">Status</p>
              <p className="text-sm text-slate-700 font-medium mt-1">Excellent match</p>
            </div>

            <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-500" />
                Missing & Weak Points
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Skill Gaps</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.map((s: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                        <Plus size={14} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Phrasing & Impact</h4>
                  <ul className="space-y-2">
                    {analysis.weakAreas.map((w: string, i: number) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 text-white p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Lightbulb size={20} className="text-blue-400" />
                Improvement Strategy
              </h3>
              <ul className="space-y-4">
                {analysis.recommendations.map((r: string, i: number) => (
                  <li key={i} className="flex gap-4 group">
                    <div className="w-6 h-6 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold border border-slate-700">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{r}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                <Linkedin size={20} className="text-blue-600" />
                LinkedIn Optimization
              </h3>
              <div className="space-y-4">
                {analysis.linkedInTips.map((tip: string, i: number) => (
                  <div key={i} className="bg-white/60 p-4 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium italic">"{tip}"</p>
                  </div>
                ))}
              </div>
              <button className="mt-8 w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                Apply Suggestions
              </button>
            </div>
          </div>

          <button 
            onClick={() => setAnalysis(null)}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 mx-auto"
          >
            Start over with a different file
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzerView;
