
import React, { useState, useEffect } from 'react';
import { ViewType, UserProfile } from './types';
import DashboardView from './views/DashboardView';
import ProfileView from './views/ProfileView';
import CareerDiscoveryView from './views/CareerDiscoveryView';
import RoadmapView from './views/RoadmapView';
import LearningResourcesView from './views/LearningResourcesView';
import ResumeAnalyzerView from './views/ResumeAnalyzerView';
import CommunicationLabView from './views/CommunicationLabView';
import MockInterviewView from './views/MockInterviewView';
import ChatBot from './components/ChatBot';
import LiveAssistant from './components/LiveAssistant';
import VertexLogo3D from './components/VertexLogo3D';
import { 
  LayoutDashboard, 
  User, 
  Compass, 
  Map, 
  Library, 
  FileText, 
  MessageSquare, 
  Video,
  LogOut,
  Bell,
  Search,
  Zap,
  Mic
} from 'lucide-react';



const INITIAL_PROFILE: UserProfile = {
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 234 567 890",
  education: "B.S. Computer Science, Stanford University",
  skills: [
    { name: "JavaScript", proficiency: "Intermediate", category: "Programming" },
    { name: "React", proficiency: "Advanced", category: "Web Development" },
    { name: "Python", proficiency: "Beginner", category: "Programming" }
  ],
  certifications: [
    { name: "AWS Certified Solutions Architect", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
    { name: "Google Cloud Associate", url: "https://cloud.google.com/learn/certification/cloud-engineer" }
  ],
  interests: ["Artificial Intelligence", "UI/UX Design", "FinTech"],
  preferredDomains: ["Enterprise Software", "Creative Tech"],
  links: {
    linkedin: "linkedin.com/in/johnsmith",
    github: "github.com/jsmith"
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vertex_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });
  const [targetRole, setTargetRole] = useState<string>('Senior Frontend Engineer');
  const [showLiveAssistant, setShowLiveAssistant] = useState(false);

  useEffect(() => {
    localStorage.setItem('vertex_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const navItems = [
    { type: ViewType.DASHBOARD, label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { type: ViewType.PROFILE, label: "My Profile", icon: <User size={20} /> },
    { type: ViewType.CAREER_DISCOVERY, label: "Career Discovery", icon: <Compass size={20} /> },
    { type: ViewType.ROADMAP, label: "Roadmaps", icon: <Map size={20} /> },
    { type: ViewType.RESOURCES, label: "Resources", icon: <Library size={20} /> },
    { type: ViewType.RESUME_ANALYZER, label: "Resume AI", icon: <FileText size={20} /> },
    { type: ViewType.COMMUNICATION_LAB, label: "Communication Lab", icon: <MessageSquare size={20} /> },
    { type: ViewType.MOCK_INTERVIEW, label: "AI Mock Interview", icon: <Video size={20} /> },
  ];

  const handleSetTargetRole = (role: string) => {
    setTargetRole(role);
    setCurrentView(ViewType.ROADMAP);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewType.DASHBOARD: return <DashboardView onNavigate={setCurrentView} profile={userProfile} targetRole={targetRole} />;
      case ViewType.PROFILE: return <ProfileView profile={userProfile} setProfile={setUserProfile} />;
      case ViewType.CAREER_DISCOVERY: return <CareerDiscoveryView profile={userProfile} onNavigate={setCurrentView} onSetTargetRole={handleSetTargetRole} />;
      case ViewType.ROADMAP: return <RoadmapView profile={userProfile} targetRole={targetRole} />;
      case ViewType.RESOURCES: return <LearningResourcesView />;
      case ViewType.RESUME_ANALYZER: return <ResumeAnalyzerView profile={userProfile} />;
      case ViewType.COMMUNICATION_LAB: return <CommunicationLabView />;
      case ViewType.MOCK_INTERVIEW: return <MockInterviewView />;
      default: return <DashboardView onNavigate={setCurrentView} profile={userProfile} targetRole={targetRole} />;
    }
  };
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const callGemini = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput }), // ✅ now exists
      });

      const data = await res.json();
      setResponse(data.response);
      console.log(data.response);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setResponse("Error calling Gemini API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Made slightly transparent to show background */}
      <aside className="w-72 bg-slate-900/95 backdrop-blur-md text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-2xl">
        <div className="p-8 border-b border-slate-800">
           <VertexLogo3D showText={true} />
        </div>
        
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.type}>
                <button
                  onClick={() => setCurrentView(item.type)}
                  className={`w-full flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
                    currentView === item.type 
                      ? "bg-slate-800/80 text-white border-r-4 border-navy font-medium" 
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
          <button 
            onClick={() => setShowLiveAssistant(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 btn-navy-fade text-white rounded-2xl font-bold text-sm shadow-lg"
          >
            <Mic size={18} />
            Voice Assistant
          </button>
          
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
            {userProfile.profilePicture ? (
              <img 
                src={userProfile.profilePicture} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border border-slate-600 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold border border-slate-600 text-white">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{userProfile.name}</p>
              <p className="text-xs text-slate-500 truncate">Peak Explorer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Semi-transparent background */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/80 backdrop-blur-[2px]">
        {/* Top Header */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search skills, jobs, resources..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Authentic Intelligence</span>
              <span className="text-lg font-black tracking-tight text-slate-800 italic metallic-text">VERTEX</span>
            </div>
            
            <div className="h-12 w-12 flex items-center justify-center opacity-80 scale-75">
              <VertexLogo3D />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">{userProfile.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* View Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            {renderView()}
          </div>
        </div>
      </main>

      <ChatBot />
      {showLiveAssistant && <LiveAssistant onClose={() => setShowLiveAssistant(false)} />}
    </div>
  );
  

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gemini AI Test</h2>

      {/* ✅ INPUT CONNECTED TO userInput */}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "300px" }}
      />

      <br /><br />

      <button onClick={callGemini} disabled={loading}>
        {loading ? "Thinking..." : "Ask Gemini"}
      </button>

      <p><strong>Response:</strong></p>
      <p>{response}</p>
    </div>
  );
};

export default App;
