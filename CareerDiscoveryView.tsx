
import React, { useState } from 'react';
import { ViewType, UserProfile } from '../types';
import { getCareerDiscoverySuggestions } from '../services/geminiService';
import { Compass, Sparkles, Target, Search, ArrowRight, Loader2, Star } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onNavigate: (view: ViewType) => void;
  onSetTargetRole: (role: string) => void;
}

const CareerDiscoveryView: React.FC<Props> = ({ profile, onNavigate, onSetTargetRole }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [targetRole, setTargetRole] = useState('');

  const discoverPaths = async () => {
    setLoading(true);
    try {
      const results = await getCareerDiscoverySuggestions(profile);
      setSuggestions(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalDriven = (role: string) => {
    onSetTargetRole(role);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center">
        <div className="inline-flex p-3 bg-slate-100 text-navy rounded-2xl mb-4">
          <Compass size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Career Discovery Engine</h2>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">
          Not sure where to head next? Let our AI analyze your profile and market trends to find your perfect professional fit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Flow A: Goal Driven */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-navy transition-all flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 text-navy rounded-lg">
              <Target size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">I have a goal</h3>
          </div>
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            Specify the role you're aiming for. We'll perform a skill-gap analysis and map out your journey.
          </p>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Solutions Architect, Product Lead..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          <button 
            disabled={!targetRole}
            onClick={() => handleGoalDriven(targetRole)}
            className="mt-auto w-full py-3 btn-navy-fade rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            Generate My Roadmap
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Flow B: Exploratory */}
        <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-navy transition-all flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 text-navy rounded-lg">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">I'm exploring</h3>
          </div>
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            Let our AI scan your skills and interests to suggest high-impact career pivots you might have missed.
          </p>
          <div className="flex-1 flex flex-col justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-3 py-10 text-navy">
                <Loader2 size={32} className="animate-spin" />
                <span className="text-sm font-medium">Analyzing profile...</span>
              </div>
            ) : suggestions.length === 0 ? (
              <button 
                onClick={discoverPaths}
                className="w-full py-3 btn-navy-fade rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                Scan My Profile
                <Sparkles size={18} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-6 pt-8 animate-fadeIn">
          <h3 className="text-2xl font-bold text-slate-900">AI Suggested Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((path, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-50 text-navy rounded-xl flex items-center justify-center">
                    <Star size={24} />
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                    {path.matchScore}% Match
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{path.title}</h4>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  {path.reason}
                </p>
                <div className="p-3 bg-slate-50 rounded-lg mb-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Gap Analysis</p>
                  <p className="text-xs text-slate-600">{path.gapAnalysis}</p>
                </div>
                <button 
                  onClick={() => handleGoalDriven(path.title)}
                  className="w-full py-2 text-sm font-bold text-navy border border-navy rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Select Path
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerDiscoveryView;
