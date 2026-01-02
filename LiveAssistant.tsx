
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Waves, X, Loader2, Sparkles } from 'lucide-react';
import { connectLiveAudio } from '../services/geminiService';
import { createPcmBlob, decode, decodeAudioData } from '../audioUtils';

const LiveAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isTalking, setIsTalking] = useState(false);
  
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionPromiseRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startSession();
    return () => stopSession();
  }, []);

  const startSession = async () => {
    try {
      inputCtxRef.current = new AudioContext({ sampleRate: 16000 });
      outputCtxRef.current = new AudioContext({ sampleRate: 24000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const callbacks = {
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          const source = inputCtxRef.current!.createMediaStreamSource(streamRef.current!);
          const scriptProcessor = inputCtxRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            sessionPromiseRef.current.then((session: any) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtxRef.current!.destination);
        },
        onmessage: async (message: any) => {
          const audioBase64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioBase64) {
            setIsTalking(true);
            const audioData = decode(audioBase64);
            const buffer = await decodeAudioData(audioData, outputCtxRef.current!, 24000, 1);
            const source = outputCtxRef.current!.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtxRef.current!.destination);
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtxRef.current!.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            source.onended = () => {
              if (outputCtxRef.current!.currentTime >= nextStartTimeRef.current - 0.1) {
                setIsTalking(false);
              }
            };
          }
          if (message.serverContent?.interrupted) {
             nextStartTimeRef.current = 0;
             setIsTalking(false);
          }
        },
        onerror: (e: any) => console.error('Live Error:', e),
        onclose: () => setIsActive(false),
      };

      sessionPromiseRef.current = connectLiveAudio(callbacks);
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    streamRef.current?.getTracks().forEach(t => t.stop());
    inputCtxRef.current?.close();
    outputCtxRef.current?.close();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center z-[60] p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col items-center p-12 text-center">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 mx-auto">
            <Waves size={40} className={`text-white ${isActive ? 'animate-pulse' : ''}`} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Voice Assistant</h2>
          <p className="text-slate-500 font-medium">Real-time Career Intelligence</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[200px]">
          {isConnecting ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={40} className="animate-spin text-blue-600" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Initializing Live API...</p>
            </div>
          ) : isActive ? (
            <div className="space-y-12 w-full">
              <div className="flex items-center justify-center gap-4">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 rounded-full bg-blue-500 transition-all duration-300 ${isTalking ? 'animate-bounce h-12' : 'h-4'}`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <p className="text-xl font-bold text-slate-700 h-8">
                {isTalking ? "I'm speaking..." : "I'm listening..."}
              </p>
            </div>
          ) : (
            <div className="text-red-500 font-bold">Failed to connect to Voice Session</div>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-6 w-full">
          <div className="flex items-center justify-center gap-4">
            <button className={`p-6 rounded-full shadow-lg transition-all ${isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-100 text-slate-400'}`} onClick={stopSession}>
              <MicOff size={32} />
            </button>
            <div className="px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold flex items-center gap-2">
              <Sparkles size={18} />
              AI NATIVE AUDIO
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            Have a professional conversation with CareerForge AI. Ask for interview tips, career paths, or general advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;
