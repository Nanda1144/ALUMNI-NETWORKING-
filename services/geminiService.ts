
import { GoogleGenAI, Type } from "@google/genai";
import { User, MentorshipMatch, Job, JobMatch, Event, EventMatch } from '../types';

// Ensure API key is present; in a real app, handle this more gracefully
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMentorshipMatches = async (
  student: User,
  alumni: User[],
  focusArea?: string,
  preferences?: { communication?: string; availability?: string }
): Promise<MentorshipMatch[]> => {
  if (!apiKey) {
    console.error("API Key missing");
    return [];
  }

  const alumniContext = alumni.map(a => ({
    id: a.id,
    name: a.name,
    job: a.jobTitle,
    company: a.company,
    skills: a.skills,
    interests: a.interests,
    mentorshipTopics: a.mentorshipTopics,
    bio: a.bio,
    location: a.location
  }));

  const studentContext = {
    name: student.name,
    major: student.department,
    skills: student.skills,
    interests: student.interests,
    bio: student.bio,
    requestedFocus: focusArea || "General Career Advice",
    preferredCommunication: preferences?.communication || "Flexible",
    preferredAvailability: preferences?.availability || "Flexible"
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Act as an expert academic career advisor. 
        Analyze the following student profile and list of alumni. 
        The student is specifically looking for help with: "${studentContext.requestedFocus}".
        
        Preferences:
        - Communication Style: ${studentContext.preferredCommunication}
        - Availability: ${studentContext.preferredAvailability}
        
        Prioritize alumni whose skills directly complement the student's current skills.
        Also consider if the alumni's location or job context might fit the student's communication/availability preferences (e.g. remote workers might be better for virtual, local for in-person).

        Identify the top 3 best mentorship matches for this student.
        
        Student: ${JSON.stringify(studentContext)}
        Alumni Pool: ${JSON.stringify(alumniContext)}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              mentorId: { type: Type.STRING },
              matchScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
              reason: { type: Type.STRING, description: "A concise explanation of why this is a good match, specifically mentioning skill overlaps and fit for preferences." },
              suggestedTopics: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "3 conversation starters or topics related to the focus area" 
              }
            },
            required: ["mentorId", "matchScore", "reason", "suggestedTopics"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as MentorshipMatch[];

  } catch (error) {
    console.error("Gemini matching failed:", error);
    return [];
  }
};

export const generateJobMatches = async (
  student: User,
  jobs: Job[],
  preferences?: { type?: string; location?: string }
): Promise<JobMatch[]> => {
  if (!apiKey) {
      console.error("API Key missing");
      return [];
  }

  const jobContext = jobs.map(j => ({
      id: j.id,
      title: j.title,
      company: j.company,
      description: j.description,
      requirements: j.requirements,
      type: j.type,
      location: j.location
  }));

  const studentContext = {
      skills: student.skills,
      interests: student.interests,
      major: student.department,
      bio: student.bio,
      preferredJobType: preferences?.type || "Any",
      preferredLocation: preferences?.location || "Any"
  };

  try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `
            Act as a recruiter matching candidates to jobs.
            Evaluate the student profile against the available jobs.
            
            Prioritize jobs that match the student's preferred job type (${studentContext.preferredJobType}) and location (${studentContext.preferredLocation}).
            
            Student: ${JSON.stringify(studentContext)}
            Jobs: ${JSON.stringify(jobContext)}

            Return the top suitable jobs with a match score.
          `,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  jobId: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  reason: { type: Type.STRING, description: "A detailed reason explicitly listing which of the student's skills matched the job requirements, and confirming if the job type or location preferences were met. Use a friendly tone." }
                },
                required: ["jobId", "matchScore", "reason"]
              }
            }
          }
      });
      const jsonText = response.text;
      if (!jsonText) return [];
      return JSON.parse(jsonText) as JobMatch[];
  } catch (error) {
      console.error("Job matching failed", error);
      return [];
  }
};

export const generateEventRecommendations = async (
    user: User,
    events: Event[]
): Promise<EventMatch[]> => {
    if (!apiKey) {
        console.error("API Key missing");
        return [];
    }

    const eventContext = events.map(e => ({
        id: e.id,
        title: e.title,
        type: e.type,
        description: e.description,
        location: e.location,
        date: e.date
    }));

    const userContext = {
        interests: user.interests,
        major: user.department,
        bio: user.bio,
        location: user.location
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
              Act as an event coordinator.
              Recommend relevant upcoming events to the user based on their interests, major, and location.
              
              User Profile: ${JSON.stringify(userContext)}
              Events List: ${JSON.stringify(eventContext)}

              Return a list of events with a match score indicating how relevant they are to the user.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            eventId: { type: Type.STRING },
                            matchScore: { type: Type.NUMBER },
                            reason: { type: Type.STRING, description: "Why this event is relevant to the user." }
                        },
                        required: ["eventId", "matchScore", "reason"]
                    }
                }
            }
        });
        
        const jsonText = response.text;
        if (!jsonText) return [];
        return JSON.parse(jsonText) as EventMatch[];

    } catch (error) {
        console.error("Event matching failed", error);
        return [];
    }
}

export const analyzeProfileImprovements = async (user: User): Promise<{
    completeness: number;
    suggestions: { text: string; relatedSkills: string[] }[];
    missingFields: string[];
}> => {
    if (!apiKey) return { completeness: 0, suggestions: [], missingFields: [] };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
                Analyze this user profile for completeness and attractiveness to recruiters/mentors.
                
                Profile: ${JSON.stringify(user)}
                
                Return a JSON object with:
                1. completeness: A score from 0-100.
                2. suggestions: Array of objects with 'text' (specific actionable advice) and 'relatedSkills' (a list of single-word skills or keywords relevant to the advice, e.g. ["React", "Leadership"]).
                3. missingFields: Array of strings listing any critical missing or under-utilized fields.
            `,
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
        
        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text);
    } catch (e) {
        console.error("Profile analysis failed", e);
        return { completeness: 50, suggestions: [{text: "Could not analyze profile at this time.", relatedSkills: []}], missingFields: [] };
    }
}

export const generateProfileSummary = async (user: User): Promise<string> => {
  if (!apiKey) return "API Key missing";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Generate a concise (2-3 sentences) professional summary for this user, highlighting their key strengths and potential career aspirations.
        Profile: ${JSON.stringify(user)}
      `,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Summary generation failed", error);
    return "Error generating summary.";
  }
};

export const syncExternalProfileData = async (user: User, platform: string, url: string): Promise<{
    newSkills: string[];
    newCertifications: string[];
}> => {
    if (!apiKey) return { newSkills: [], newCertifications: [] };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
                The user has linked their ${platform} profile: ${url}.
                
                User Context:
                - Role: ${user.role}
                - Department/Major: ${user.department}
                - Job Title: ${user.jobTitle || 'N/A'}
                - Company: ${user.company || 'N/A'}
                - Bio: "${user.bio}"
                - Existing Skills: ${JSON.stringify(user.skills)}
                
                Task:
                Simulate a data sync. Identify MISSING, high-value technical skills and certifications that are strongly implied by the user's background.
                
                Strict Guidelines for Accuracy:
                1. **Correctness**: Only suggest skills that are standard for this specific role. Do not add generic or irrelevant skills (e.g., do not add 'Microsoft Word' for a Senior Engineer).
                2. **No Hallucinations**: If the bio/role doesn't strongly imply a skill, do not invent it.
                3. **Deduplication**: Do not return skills already listed in "Existing Skills".
                4. **Limit**: Return max 5 skills and 2 certifications.
                
                Return JSON only.
            `,
            config: {
                temperature: 0.1, // Very low temperature for high accuracy and consistency
                maxOutputTokens: 4000, // Increased significantly to prevent JSON truncation
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        newSkills: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Accurate, missing technical skills."
                        },
                        newCertifications: {
                             type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Relevant professional certifications."
                        }
                    },
                    required: ["newSkills", "newCertifications"]
                }
            }
        });
        
        let text = response.text;
        if (!text) return { newSkills: [], newCertifications: [] };

        // Robust cleanup: remove any Markdown code blocks that might have leaked in
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(text);

    } catch (e) {
        console.error("Sync failed", e);
        return { newSkills: [], newCertifications: [] };
    }
}
