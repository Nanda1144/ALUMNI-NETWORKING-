import { GoogleGenAI, Type } from "@google/genai";
import { User, MentorshipMatch, Job, JobMatch, Event, EventMatch } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMentorshipMatches = async (
  student: User,
  alumni: User[],
  focusArea?: string,
  preferences?: { communication?: string; availability?: string }
): Promise<MentorshipMatch[]> => {
  if (!apiKey) return [];
  const alumniContext = alumni.map(a => ({ id: a.id, name: a.name, job: a.jobTitle, company: a.company, skills: a.skills, mentorshipTopics: a.mentorshipTopics }));
  const studentContext = { name: student.name, major: student.department, skills: student.skills, requestedFocus: focusArea };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Match the student with the best alumni mentors. Student: ${JSON.stringify(studentContext)} Alumni: ${JSON.stringify(alumniContext)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              mentorId: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              reason: { type: Type.STRING },
              suggestedTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["mentorId", "matchScore", "reason", "suggestedTopics"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const generateJobMatches = async (student: User, jobs: Job[], preferences?: { type?: string; location?: string }): Promise<JobMatch[]> => {
  if (!apiKey) return [];
  try {
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Match candidate to jobs. Candidate: ${JSON.stringify(student)} Jobs: ${JSON.stringify(jobs)}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  jobId: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                },
                required: ["jobId", "matchScore", "reason"]
              }
            }
          }
      });
      return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const generateEventRecommendations = async (user: User, events: Event[]): Promise<EventMatch[]> => {
    if (!apiKey) return [];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Recommend events. User: ${JSON.stringify(user)} Events: ${JSON.stringify(events)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            eventId: { type: Type.STRING },
                            matchScore: { type: Type.NUMBER },
                            reason: { type: Type.STRING }
                        },
                        required: ["eventId", "matchScore", "reason"]
                    }
                }
            }
        });
        return JSON.parse(response.text || '[]');
    } catch (error) { return []; }
}

export const analyzeProfileImprovements = async (user: User): Promise<{
    completeness: number;
    suggestions: { text: string; relatedSkills: string[] }[];
    missingFields: string[];
}> => {
    if (!apiKey) return { completeness: 0, suggestions: [], missingFields: [] };
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze profile completeness: ${JSON.stringify(user)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        completeness: { type: Type.NUMBER },
                        suggestions: { 
                            type: Type.ARRAY, 
                            items: { 
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING },
                                    relatedSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
                                },
                                required: ["text", "relatedSkills"]
                            } 
                        },
                        missingFields: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["completeness", "suggestions", "missingFields"]
                }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) { return { completeness: 50, suggestions: [], missingFields: [] }; }
}

export const generateProfileSummary = async (user: User): Promise<string> => {
  if (!apiKey) return "";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Professional summary for: ${JSON.stringify(user)}`,
    });
    return response.text || "";
  } catch (error) { return ""; }
};

export const syncExternalProfileData = async (user: User, platform: string, url: string): Promise<{
    newSkills: string[];
    newCertifications: string[];
}> => {
    if (!apiKey) return { newSkills: [], newCertifications: [] };
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Simulate profile sync from ${platform}: ${url}. Current user: ${JSON.stringify(user)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        newSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        newCertifications: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["newSkills", "newCertifications"]
                }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) { return { newSkills: [], newCertifications: [] }; }
};

export const generateSyntheticJobs = async (currentJobs: Job[]): Promise<Job[]> => {
    if (!apiKey) return [];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate 2 realistic tech jobs.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            company: { type: Type.STRING },
                            location: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['Full-time', 'Internship', 'Part-time', 'Contract'] },
                            description: { type: Type.STRING },
                            requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                            applicationUrl: { type: Type.STRING }
                        },
                        required: ["title", "company", "location", "type", "description", "requirements", "applicationUrl"]
                    }
                }
            }
        });
        const rawJobs = JSON.parse(response.text || '[]');
        return rawJobs.map((j: any, i: number) => ({
            id: `ai-job-${Date.now()}-${i}`,
            ...j,
            postedDate: 'Just now',
            isAiGenerated: true,
            companyLogo: `https://logo.clearbit.com/${j.company.replace(/\s+/g, '').toLowerCase()}.com`
        }));
    } catch (e) { return []; }
}
