
import React, { useState, useEffect, useRef } from 'react';
import { getMockInterviewQuestions, generateSpeech } from '../services/geminiService';
import { Video, Mic, MessageSquare, Send, CheckCircle2, User, Play, Square, Loader2, AlertCircle, Volume2 } from 'lucide-react';
import { decode, decodeAudioData } from '../audioUtils';

const MockInterviewView: React.FC = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [config, setConfig] = useState({
    environment: 'Corporate Office',
    domain: 'Software Engineering',
    techStack: 'React, TypeScript, Node.js',
    experienceLevel: 'Mid-Level',
    language: 'English'
  });
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (sessionStarted && questions.length > 0 && !feedback) {
      readQuestion(questions[currentQuestionIndex]?.question);
    }
    return () => stopReading();
  }, [currentQuestionIndex, sessionStarted]);

  const stopReading = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    setIsReading(false);
  };

  const readQuestion = async (text: string) => {
    if (!text || isReading) return;
    setIsReading(true);
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        const audioData = decode(base64Audio);
        const buffer = await decodeAudioData(audioData, audioCtxRef.current, 24000, 1);
        
        stopReading();
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtxRef.current.destination);
        source.start();
        audioSourceRef.current = source;
        setIsReading(true);
        
        source.onended = () => {
          setIsReading(false);
          audioSourceRef.current = null;
        };
      }
    } catch (e) {
      console.error(e);
      setIsReading(false);
    }
  };

  const handleBoxClick = () => {
    if (questions[currentQuestionIndex]) {
      readQuestion(questions[currentQuestionIndex].question);
    }
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const q = await getMockInterviewQuestions(config);
      setQuestions(q);
      setSessionStarted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      generateFeedback(newAnswers);
    }
  };

  const generateFeedback = (allAnswers: string[]) => {
    setFeedback({
      score: 82,
      strengths: ["Clear technical explanations", "Good use of professional vocabulary", "Direct and concise"],
      improvements: ["Provide more specific examples using STAR method", "Slow down your speech rate", "More emphasis on project outcomes"],
      overallFeedback: "You demonstrated a strong command of React concepts. Your ability to explain the difference between state and props was excellent. Focus on elaborating more on your problem-solving process."
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Mock Interview</h2>
          <p className="text-slate-500 mt-1">Realistic simulation with personalized feedback.</p>
        </div>
        {sessionStarted && !feedback && (
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold animate-pulse flex items-center gap-2 border border-red-100">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              LIVE RECORDING
            </div>
            <button 
              onClick={() => {setSessionStarted(false); setFeedback(null);}}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium"
            >
              Cancel Session
            </button>
          </div>
        )}
      </div>

      {!sessionStarted && !feedback ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Setup Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Interview Environment</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy"
                  value={config.environment}
                  onChange={(e) => setConfig({...config, environment: e.target.value})}
                >
                  <option>Corporate Office</option>
                  <option>Remote (Casual)</option>
                  <option>Startup Loft</option>
                  <option>Panel Boardroom</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Domain</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy"
                    value={config.domain}
                    onChange={(e) => setConfig({...config, domain: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Experience</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-navy"
                    value={config.experienceLevel}
                    onChange={(e) => setConfig({...config, experienceLevel: e.target.value})}
                  >
                    <option>Entry-Level</option>
                    <option>Mid-Level</option>
                    <option>Senior-Level</option>
                    <option>Management</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Technology Stack</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:italic outline-none focus:ring-2 focus:ring-navy"
                  placeholder="e.g. AWS, Node.js, Python..."
                  value={config.techStack}
                  onChange={(e) => setConfig({...config, techStack: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={startInterview}
              disabled={loading}
              className="w-full mt-8 py-4 btn-navy-fade rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <Play size={24} fill="currentColor" />}
              Begin Simulation
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Video size={20} className="text-blue-400" />
                Immersive Experience
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Our AI generates high-fidelity audio interviewers to simulate real human interaction. Read and Listen to questions.
              </p>
              <img src="https://picsum.photos/seed/interview/400/250" alt="Simulation" className="w-full h-40 object-cover rounded-xl opacity-50 grayscale" />
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-500" />
                Preparation Tips
              </h3>
              <ul className="space-y-3">
                {["Ensure your camera is eye-level", "Maintain a neutral background", "Speak clearly and at a moderate pace", "Take 2 seconds to think before answering"].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <span className="text-navy font-bold">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : feedback ? (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-navy/10" style={{ top: `${100-feedback.score}%` }}></div>
              <span className="text-3xl font-bold text-navy z-10">{feedback.score}</span>
              <span className="text-[10px] font-bold text-slate-400 z-10 uppercase">SCORE</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Performance Analysis</h3>
              <p className="text-slate-600 leading-relaxed">{feedback.overallFeedback}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl">
              <h4 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} /> Strengths
              </h4>
              <ul className="space-y-3">
                {feedback.strengths.map((s: string, i: number) => (
                  <li key={i} className="flex gap-3 text-emerald-700 text-sm">
                    <span className="font-bold">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100 border border-slate-200 p-8 rounded-3xl">
              <h4 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-navy" /> Growth Areas
              </h4>
              <ul className="space-y-3">
                {feedback.improvements.map((im: string, i: number) => (
                  <li key={i} className="flex gap-3 text-slate-700 text-sm">
                    <span className="font-bold text-navy">→</span> {im}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button 
            onClick={() => {setSessionStarted(false); setFeedback(null);}}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
          >
            Start New Session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div 
              onClick={handleBoxClick}
              className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative group flex items-center justify-center cursor-pointer hover:ring-4 hover:ring-navy/30 transition-all"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-transparent to-transparent opacity-50"></div>
              
              <div className="flex flex-col items-center gap-6">
                <div className={`w-32 h-32 rounded-full bg-slate-800/80 border-4 ${isReading ? 'border-navy animate-pulse scale-110 shadow-[0_0_30px_rgba(0,0,128,0.5)]' : 'border-slate-700'} flex items-center justify-center transition-all duration-500`}>
                  <Volume2 size={48} className={isReading ? 'text-white' : 'text-slate-600'} />
                </div>
                <div className="text-center">
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Interviewer AI</p>
                   <p className="text-white text-sm opacity-50">{isReading ? "Speaking..." : "Click to read question"}</p>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="p-4 bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-navy text-[10px] font-bold rounded uppercase">Interviewer</span>
                    <span className="text-xs text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
                  </div>
                  <p className="text-lg font-medium leading-snug">
                    {questions[currentQuestionIndex]?.question}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Mic size={20} className="text-navy" />
                <span className="text-sm font-bold text-slate-800">Your Response</span>
              </div>
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 h-32 outline-none focus:ring-2 focus:ring-navy transition-all"
                placeholder="Type your answer or use the microphone icon to record..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <button className="p-3 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
                  <Mic size={24} />
                </button>
                <button 
                  onClick={submitAnswer}
                  className="px-8 py-3 btn-navy-fade text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                  disabled={!currentAnswer.trim()}
                >
                  <Send size={18} />
                  {currentQuestionIndex === questions.length - 1 ? "Finish Interview" : "Submit Answer"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-[500px] flex flex-col">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-navy" />
                Live Transcript
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {answers.map((ans, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Question {i+1}</p>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-700">{ans}</p>
                    </div>
                  </div>
                ))}
                {currentAnswer && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-sm text-navy italic">{currentAnswer}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TrendingUp: React.FC<any> = ({size, className}) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;

export default MockInterviewView;
