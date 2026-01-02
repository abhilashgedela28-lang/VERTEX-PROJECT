
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserProfile, ResumeAnalysisResult, CareerRoadmapStep, InterviewQuestion, InterviewFeedback } from "../types";

// Always initialize with named parameters as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * QUOTA & LATENCY OPTIMIZATION STRATEGY:
 * 1. Exclusively use 'gemini-3-flash-preview' for text-based reasoning to leverage higher Flash-tier quotas.
 * 2. Set thinkingBudget: 0 for all utility/structured tasks to skip the "thinking" stage, reducing token costs and latency.
 * 3. Use 'gemini-2.5-flash-native-audio-preview-09-2025' for real-time interactions.
 */
const BASE_CONFIG = {
  thinkingConfig: { thinkingBudget: 0 }
};

export const getCareerDiscoverySuggestions = async (profile: UserProfile): Promise<any[]> => {
  const prompt = `Analyze this professional profile and suggest 3-5 suitable career paths with match percentages and reasons: ${JSON.stringify(profile)}. Ground your suggestions in current 2024-2025 market trends and high-growth sectors.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      ...BASE_CONFIG,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            gapAnalysis: { type: Type.STRING },
            marketTrendSource: { type: Type.STRING, description: "Relevant URL or news source found via search" }
          },
          required: ["title", "matchScore", "reason", "gapAnalysis"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const generateRoadmap = async (targetRole: string, currentProfile: UserProfile): Promise<CareerRoadmapStep[]> => {
  const prompt = `Generate a detailed learning roadmap for becoming a ${targetRole} starting from current profile: ${JSON.stringify(currentProfile)}. Focus on 6-8 clear steps. Use Google Search to find REAL, up-to-date courses and documentation from 2024-2025.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      ...BASE_CONFIG,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            level: { type: Type.STRING },
            description: { type: Type.STRING },
            milestone: { type: Type.STRING },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["name", "url"]
              }
            }
          },
          required: ["title", "level", "description", "milestone", "resources"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const analyzeResumeContent = async (text: string, jobRequirement: string): Promise<ResumeAnalysisResult> => {
  const prompt = `Analyze this resume content: "${text}" against requirements: "${jobRequirement}". Provide ATS score, missing skills, and improvement points based on 2024 hiring standards.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      ...BASE_CONFIG,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          linkedInTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "missingSkills", "weakAreas", "recommendations", "linkedInTips"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const getMockInterviewQuestions = async (config: any): Promise<InterviewQuestion[]> => {
  const prompt = `Generate 5 technical and behavioral interview questions for a ${config.domain} role. Use search grounding to ensure questions reflect current 2024-2025 industry standards for ${config.techStack}. Environment: ${config.environment}.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      ...BASE_CONFIG,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            suggestedAnswerPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["question", "suggestedAnswerPoints"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const analyzeCommunication = async (text: string): Promise<any> => {
  const prompt = `Analyze the following professional text for grammar, fluency, and executive clarity: "${text}"`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      ...BASE_CONFIG,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          accuracyScore: { type: Type.NUMBER },
          fluencyScore: { type: Type.NUMBER },
          mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["accuracyScore", "fluencyScore", "mistakes", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const generateGrammarQuiz = async (difficulty: string): Promise<any[]> => {
  const prompt = `Generate a 5-question multiple choice grammar quiz for professional English at ${difficulty} level. Focus on corporate and executive contexts.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      ...BASE_CONFIG,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

/** AI CHATBOT FEATURE **/
export const createCareerChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are Vertex AI Coach. Help users reach their career peak with elite, professional, and results-oriented guidance. Use Google Search for the most up-to-date industry data and job market trends.',
      tools: [{ googleSearch: {} }]
    },
  });
};

/** TEXT TO SPEECH FEATURE **/
export const generateSpeech = async (text: string): Promise<string | undefined> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this question clearly and professionally: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

/** VIDEO GENERATION FEATURE **/
export const generateCommunicationVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  const instance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await instance.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Professional cinematic demonstration of: ${prompt}. High-end corporate aesthetic, realistic lighting, focus on executive presence.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await instance.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

/** LIVE NATIVE AUDIO API SESSION **/
export const connectLiveAudio = (callbacks: any) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'You are a Vertex AI career executive in a live voice strategy session. Provide elite career insights and keep the session focused on reaching the career peak.',
    },
  });
};
