
import React, { useState, useEffect } from 'react';
import { UserProfile, CareerRoadmapStep } from '../types';
import { generateRoadmap } from '../services/geminiService';
import { Map, Flag, ExternalLink, CheckCircle2, Circle, Loader2, Info } from 'lucide-react';

interface Props {
  profile: UserProfile;
  targetRole: string;
}

const RoadmapView: React.FC<Props> = ({ profile, targetRole }) => {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmapStep[]>([]);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const result = await generateRoadmap(targetRole, profile);
      setRoadmap(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [targetRole]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Career Roadmap</h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            Targeting: <span className="font-bold text-navy">{targetRole}</span>
          </p>
        </div>
        <button 
          onClick={fetchRoadmap}
          className="text-sm font-bold text-slate-500 hover:text-navy flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Map size={16} />}
          Regenerate Path
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
          <Loader2 size={48} className="animate-spin text-navy" />
          <p className="text-lg font-medium">Generating your personalized journey for {targetRole}...</p>
        </div>
      ) : (
        <div className="relative space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-200 z-0"></div>

          {roadmap.length > 0 ? roadmap.map((step, i) => (
            <div key={i} className="relative z-10 pl-12">
              {/* Icon Marker */}
              <div className="absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-20 overflow-hidden">
                {i === 0 ? (
                  <CheckCircle2 size={40} className="text-emerald-500 fill-emerald-50" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    step.level === 'Beginner' ? 'bg-slate-100 text-navy' :
                    step.level === 'Intermediate' ? 'bg-slate-200 text-navy' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className="text-sm font-bold">{i + 1}</span>
                  </div>
                )}
              </div>

              {/* Step Card */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-navy transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      step.level === 'Beginner' ? 'bg-slate-50 text-navy' :
                      step.level === 'Intermediate' ? 'bg-slate-100 text-navy' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {step.level}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 mt-2">{step.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Flag size={14} className="text-slate-300" />
                    {step.milestone}
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {step.description}
                </p>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Curated Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step.resources.map((res, ri) => (
                      <a 
                        key={ri} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 hover:border-navy transition-all text-sm group/link"
                      >
                        <span className="font-medium text-slate-700">{res.name}</span>
                        <ExternalLink size={14} className="text-slate-400 group-hover/link:text-navy" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )) : (
             <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <Info size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No roadmap generated yet. Try clicking "Regenerate Path".</p>
             </div>
          )}

          {roadmap.length > 0 && (
            <div className="bg-navy text-white p-8 rounded-3xl shadow-xl shadow-slate-200 text-center space-y-4">
              <h3 className="text-2xl font-bold">Goal Reached: {targetRole}</h3>
              <p className="text-slate-200 max-w-md mx-auto">You've completed the roadmap. Time to showcase your skills in a mock interview!</p>
              <div className="pt-4">
                <button className="px-8 py-3 bg-white text-navy rounded-xl font-bold hover:bg-slate-100 transition-all btn-navy-fade">
                  Launch {targetRole.split(' ')[0]} Mock Interview
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadmapView;
