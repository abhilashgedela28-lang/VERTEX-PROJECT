
import React, { useState } from 'react';
import { analyzeCommunication, generateGrammarQuiz, generateCommunicationVideo } from '../services/geminiService';
import { MessageSquare, Book, Mic, Play, ChevronRight, CheckCircle2, AlertCircle, Sparkles, Loader2, Award, ArrowRight, XCircle, ExternalLink, Video, Layout, X } from 'lucide-react';

const CommunicationLabView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grammar' | 'analysis' | 'courses' | 'video'>('grammar');
  const [analysisText, setAnalysisText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Video Generation states
  const [videoPrompt, setVideoPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Quiz states
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizStep, setQuizStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  // YouTube Player State
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!analysisText) return;
    setLoading(true);
    try {
      const res = await analyzeCommunication(analysisText);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;
    
    if (typeof (window as any).aistudio !== 'undefined') {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    setGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    try {
      const videoUrl = await generateCommunicationVideo(videoPrompt, aspectRatio);
      setGeneratedVideoUrl(videoUrl);
    } catch (e) {
      console.error(e);
      alert("Video generation failed. Please ensure you have selected a valid paid API key.");
    } finally {
      setGeneratingVideo(false);
    }
  };

  const startQuiz = async (difficulty: string) => {
    setQuizLoading(true);
    setQuizFinished(false);
    setQuizStep(0);
    setUserAnswers([]);
    try {
      const questions = await generateGrammarQuiz(difficulty);
      console.log("Questions fetched successfully");
      setQuizQuestions(questions);
    } catch (e) {
      console.error(e);
    } finally {
      setQuizLoading(false);
    }
  };

  const submitQuizAnswer = (answer: string) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const calculateQuizScore = () => {
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === quizQuestions[idx].correctAnswer) score++;
    });
    return (score / quizQuestions.length) * 100;
  };

  const featuredCourses = [
    { 
      title: "Executive Communication: Think Fast, Talk Smart", 
      instructor: "Stanford Graduate School of Business", 
      platform: "YouTube",
      videoId: "HAnw168huqA",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400"
    },
    { 
      title: "Business English Masterclass: Vocabulary & Phrasal Verbs", 
      instructor: "English with Lucy", 
      platform: "YouTube",
      videoId: "gh5mAtmeRyc",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400"
    },
    { 
      title: "Advanced English for Meetings and Negotiations", 
      instructor: "Oxford Online English", 
      platform: "YouTube",
      videoId: "Fj2F6j0_7kI",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400"
    },
    { 
      title: "Professional Pronunciation and Fluency Training", 
      instructor: "Rachel's English", 
      platform: "YouTube",
      videoId: "7uV_V07iK3o",
      image: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&q=80&w=400"
    },
    { 
      title: "Nuances of Workplace English Grammar", 
      instructor: "BBC Learning English", 
      platform: "YouTube",
      videoId: "K37G29L5q-k",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400"
    },
    { 
      title: "English for Management and Corporate Leadership", 
      instructor: "Learn English with TV Series", 
      platform: "YouTube",
      videoId: "D-vM8uYlFio",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Video Modal */}
      {selectedVideoId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 md:p-10 animate-fadeIn">
          <button 
            onClick={() => setSelectedVideoId(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
          >
            <X size={24} />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
          <MessageSquare size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Communication Skills Lab</h2>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">
          Master the art of professional communication. Perfect your English grammar, speaking fluency, and executive presence.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'grammar', label: 'Grammar Quizzes', icon: <Book size={16} /> },
            { id: 'analysis', label: 'Speaking Analysis', icon: <Mic size={16} /> },
            { id: 'video', label: 'AI Video Gen', icon: <Video size={16} /> },
            { id: 'courses', label: 'English & Pro Courses', icon: <Play size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fadeIn">
        {activeTab === 'grammar' && (
          <div className="space-y-8">
            {!quizQuestions.length && !quizLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { level: "Beginner", title: "Foundations of Business English", lessons: 12 },
                 { level: "Intermediate", title: "Sentence Clarity & Structure", lessons: 15 },
                 { level: "Advanced", title: "Executive Persuasion Techniques", lessons: 10 },
               ].map((course, i) => (
                 <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                       course.level === 'Beginner' ? 'bg-emerald-50 text-emerald-600' :
                       course.level === 'Intermediate' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                     }`}>
                       {course.level}
                     </span>
                     <span className="text-xs text-slate-400">{course.lessons} Lessons</span>
                   </div>
                   <h4 className="text-lg font-bold text-slate-800 mb-6">{course.title}</h4>
                   <button 
                     onClick={() => startQuiz(course.level)}
                     className="mt-auto w-full py-3 btn-navy-fade rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                   >
                     Take Grammar Quiz <ArrowRight size={16} />
                   </button>
                 </div>
               ))}
             </div>
            ) : quizLoading ? (
              <div className="bg-white p-20 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-4">
                <Loader2 size={48} className="animate-spin text-indigo-600" />
                <p className="text-slate-600 font-medium">Generating AI Grammar Quiz...</p>
              </div>
            ) : quizFinished ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-fadeIn">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold mb-4 ${
                    calculateQuizScore() >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {calculateQuizScore()}%
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Quiz Completed!</h3>
                  <p className="text-slate-500">Here is your detailed grammar performance report.</p>
                </div>

                <div className="space-y-4">
                  {quizQuestions.map((q, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl border ${
                      userAnswers[idx] === q.correctAnswer ? 'border-emerald-100 bg-emerald-50/30' : 'border-red-100 bg-red-50/30'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-bold text-slate-800">Question {idx + 1}: {q.question}</p>
                        {userAnswers[idx] === q.correctAnswer ? <CheckCircle2 size={20} className="text-emerald-500" /> : <XCircle size={20} className="text-red-500" />}
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-bold">Your answer:</span> {userAnswers[idx]}</p>
                        {userAnswers[idx] !== q.correctAnswer && <p><span className="font-bold text-emerald-600">Correct answer:</span> {q.correctAnswer}</p>}
                        <div className="p-3 bg-white/50 rounded-lg mt-2 italic text-slate-600">
                          {q.explanation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setQuizQuestions([])}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            ) : (
              <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto animate-fadeIn">
                <div className="mb-8">
                   <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                     <span>Question {quizStep + 1} of {quizQuestions.length}</span>
                     <span>{Math.round(((quizStep + 1) / quizQuestions.length) * 100)}% Complete</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all" style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}></div>
                   </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-8">{quizQuestions[quizStep].question}</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {quizQuestions[quizStep].options.map((opt: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => submitQuizAnswer(opt)}
                      className="p-4 border border-slate-200 rounded-2xl text-left hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                    >
                      <span className="font-medium text-slate-700 group-hover:text-indigo-700">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-600" />
                Analyze Your Delivery
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Paste a paragraph you've written or record yourself reading one. Our AI will analyze your grammar, fluency, and tone.
              </p>
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-48 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste your professional email, speech script, or paragraph here..."
                value={analysisText}
                onChange={(e) => setAnalysisText(e.target.value)}
              />
              <div className="flex gap-4">
                <button 
                  onClick={handleAnalyze}
                  disabled={loading || !analysisText}
                  className="flex-1 py-3 btn-navy-fade rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : "Start Analysis"}
                </button>
                <button className="p-3 bg-slate-100 text-indigo-600 rounded-xl hover:bg-slate-200 transition-colors">
                  <Mic size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {results ? (
                <div className="bg-white p-8 rounded-3xl border border-indigo-200 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-800">Results</h3>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{results.accuracyScore}%</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">{results.fluencyScore}%</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Fluency</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlertCircle size={14} className="text-red-500" /> Detected Mistakes
                      </h4>
                      <div className="space-y-2">
                        {results.mistakes.map((m: string, i: number) => (
                          <div key={i} className="text-sm p-3 bg-red-50 text-red-800 rounded-xl border border-red-100 font-medium">
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Award size={14} className="text-indigo-500" /> Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {results.suggestions.map((s: string, i: number) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-3xl flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100 shadow-sm">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-400">Waiting for input</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-xs">Enter some text to the left to get a detailed AI communication report.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Video size={20} className="text-indigo-600" />
                AI Communication Demonstrator (Veo)
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Describe a professional scenario (e.g., "A CEO delivering a keynote", "A candidate nailing a remote interview") and let AI generate a reference video for you.
              </p>
              
              <div className="space-y-4">
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-32 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe the scenario you want to visualize..."
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                />
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setAspectRatio('16:9')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${aspectRatio === '16:9' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      <Layout size={14} /> 16:9 Landscape
                    </button>
                    <button 
                      onClick={() => setAspectRatio('9:16')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${aspectRatio === '9:16' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      <Layout size={14} className="rotate-90" /> 9:16 Portrait
                    </button>
                  </div>
                  <button 
                    onClick={handleGenerateVideo}
                    disabled={generatingVideo || !videoPrompt}
                    className="flex-1 py-3 btn-navy-fade rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 min-w-[200px]"
                  >
                    {generatingVideo ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                    {generatingVideo ? "Generating Video (may take minutes)..." : "Generate AI Reference Video"}
                  </button>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-[10px] text-blue-700 font-medium">
                  Note: Video generation requires a paid API key. You will be prompted to select one if not already set.
                </div>
              </div>
            </div>

            {generatedVideoUrl && (
              <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-fadeIn">
                <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest">Generated Reference</span>
                  <a href={generatedVideoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                    Download <ExternalLink size={12} />
                  </a>
                </div>
                <video src={generatedVideoUrl} controls className="w-full" />
              </div>
            )}
            
            {generatingVideo && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-3xl text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
                <Loader2 size={48} className="animate-spin text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-800">Your video is being crafted</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Our Veo models are generating a high-quality visualization. This typically takes 60-120 seconds. Please keep this tab open.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-12">
            <div className="bg-slate-900 rounded-3xl overflow-hidden text-white relative group min-h-[400px] cursor-pointer" onClick={() => setSelectedVideoId('HAnw168huqA')}>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200" alt="English Speaking" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-20">
                <span className="px-3 py-1 bg-navy text-xs font-bold rounded uppercase w-fit mb-4 border border-white/20">Featured Tutorial</span>
                <h3 className="text-4xl font-bold mb-4">Elite Executive Communication</h3>
                <p className="text-slate-300 text-lg mb-8 max-w-2xl leading-relaxed">A Stanford GSB masterclass on thinking fast and talking smart. Essential for leaders and high-performers navigating high-stakes professional environments.</p>
                <div className="flex items-center gap-6">
                  <button className="px-8 py-3 btn-navy-fade rounded-xl font-bold flex items-center gap-2 transition-all">
                    <Play size={20} fill="currentColor" /> Play Masterclass
                  </button>
                  <span className="text-sm text-slate-400 font-medium">Free Resources • Verified YouTube Educators</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((c, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedVideoId(c.videoId)}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col group hover:border-navy transition-all overflow-hidden cursor-pointer"
                >
                  <div className="h-44 rounded-2xl overflow-hidden mb-6 relative">
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-navy shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <Play size={28} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 bg-slate-100 text-navy text-[10px] font-bold rounded uppercase">{c.platform}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 group-hover:text-navy transition-colors">{c.title}</h4>
                    <p className="text-sm text-slate-500 text-xs font-semibold">Educator: {c.instructor}</p>
                  </div>
                  <div className="mt-6">
                    <button className="w-full py-2 btn-navy-fade rounded-xl font-bold flex items-center justify-center gap-2 text-sm">
                      <Play size={16} fill="currentColor" /> Watch Playable Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationLabView;
