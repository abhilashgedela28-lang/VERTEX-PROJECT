
import React from 'react';
import { ViewType, UserProfile } from '../types';
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Zap,
  Award,
  MessageSquare
} from 'lucide-react';

interface Props {
  onNavigate: (view: ViewType) => void;
  profile: UserProfile;
  targetRole: string;
}

const DashboardView: React.FC<Props> = ({ onNavigate, profile, targetRole }) => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {profile.name.split(' ')[0]}!</h2>
          <p className="text-slate-500 mt-1">Here's your career progress at a glance.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate(ViewType.MOCK_INTERVIEW)}
            className="px-4 py-2 btn-navy-fade rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
          >
            <Zap size={18} />
            Start Mock Interview
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Skill Mastery", value: "72%", icon: <TrendingUp className="text-navy" />, detail: "+5% from last month" },
          { label: "Roadmap Progress", value: "4/12", icon: <Target className="text-navy" />, detail: `Next: ${targetRole.split(' ')[0]} Mastery` },
          { label: "Interview Readiness", value: "Ready", icon: <CheckCircle2 className="text-emerald-500" />, detail: "Mock score: 8.5/10" },
          { label: "Learning Hours", value: "24.5h", icon: <Clock className="text-amber-500" />, detail: "Goal: 30h this month" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Path */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Target size={20} className="text-navy" />
                Active Roadmap: {targetRole}
              </h3>
              <button 
                onClick={() => onNavigate(ViewType.ROADMAP)}
                className="text-sm font-medium text-navy hover:underline flex items-center gap-1"
              >
                View full path <ChevronRight size={16} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {[
                { title: "Foundational Concepts", status: "completed", date: "Jan 12" },
                { title: "Advanced Patterns & Architecture", status: "in-progress", date: "In Progress" },
                { title: "Ecosystem Specialization", status: "upcoming", date: "Next Month" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    step.status === 'completed' ? 'bg-emerald-500' : 
                    step.status === 'in-progress' ? 'bg-navy animate-pulse' : 'bg-slate-200'
                  }`}></div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500">{step.date}</p>
                  </div>
                  {step.status === 'completed' && <CheckCircle2 size={18} className="text-emerald-500" />}
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Overall Progress</span>
                  <span className="font-semibold text-navy">45%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-navy w-[45%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-navy" />
                Communication Tip
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "When answering behavioral questions, use the STAR method: Situation, Task, Action, Result. It helps maintain clarity and impact."
              </p>
              <button className="mt-4 text-xs font-semibold text-navy uppercase tracking-widest hover:underline">
                Practice more
              </button>
            </div>
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Award size={18} className="text-blue-400" />
                Resume Insights
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold">82</div>
                <div className="text-xs text-slate-400">Your current ATS Score is higher than 75% of applicants.</div>
              </div>
              <button 
                onClick={() => onNavigate(ViewType.RESUME_ANALYZER)}
                className="w-full py-2 bg-slate-800 text-white border border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Refine Resume
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Skills Spotlight</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200">
                  {skill.name}
                </span>
              ))}
            </div>
            <button 
              onClick={() => onNavigate(ViewType.PROFILE)}
              className="mt-6 w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Update Profile
            </button>
          </div>

          <div className="bg-gradient-to-br from-navy to-slate-800 p-6 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Explore New Horizons</h3>
            <p className="text-sm text-blue-100 mb-6 leading-relaxed">
              Curious about other roles? Use our AI Career Discovery engine to find your next match.
            </p>
            <button 
              onClick={() => onNavigate(ViewType.CAREER_DISCOVERY)}
              className="w-full py-3 bg-white text-navy rounded-xl font-bold shadow-md hover:bg-blue-50 transition-colors"
            >
              Start Discovery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
