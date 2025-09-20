import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { NewsArticle } from '../types';

// IMPORTANT: REPLACE 'YOUR_API_KEY_HERE' WITH YOUR ACTUAL GEMINI API KEY
// You can get a key from Google AI Studio: https://aistudio.google.com/app/apikey
const API_KEY = 'YOUR_API_KEY_HERE';

export const isApiKeySet = API_KEY && API_KEY !== 'AIzaSyDphIwJtRocdSeGz_spQrE-8kuNW5i07ho';

let ai: GoogleGenAI | null = null;
if (isApiKeySet) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("API Key is not set. Please configure it in services/geminiService.ts");
}

export const fetchRecentNews = async (): Promise<NewsArticle[]> => {
  if (!ai) return [];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "List the top 5 most significant news articles or developments about UFOs or UAPs from the last week. For each, provide a title, a direct URL, and a one or two-sentence summary.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  uri: { type: Type.STRING },
                  summary: { type: Type.STRING },
                },
                required: ["title", "uri", "summary"],
              }
            }
          }
        }
      },
    });

    const parsedResponse = JSON.parse(response.text);
    return parsedResponse.articles || [];

  } catch (error) {
    console.error("Error fetching UFO news:", error);
    return [];
  }
};

export const initChat = (): Chat | null => {
  if (!ai) return null;
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a highly intelligent research assistant specializing in UFOlogy, UAP phenomena, and analysis of government documents. Your goal is to help the user find connections, analyze data, draft Freedom of Information Act (FOIA) requests, and explore hypotheses. Be objective, analytical, and cite sources when possible.',
    },
  });
};

export const generateSocialPostIdeas = async (topic: string): Promise<string> => {
    if (!ai) return "API key not configured. Please set it in the service file.";
    if (!topic) return "Please provide a topic.";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 5 creative and engaging social media post ideas about ${topic}. Include a mix of formats like questions, facts, and story prompts. Format the output as a markdown list.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating social media posts:", error);
        return "An error occurred while generating ideas. Please try again.";
    }
};

export const analyzeFileContent = async (fileName: string, content: string): Promise<string> => {
    if (!ai) return "API key not configured. Please set it in the service file.";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `As a UFO research analyst, analyze the following document named "${fileName}". Provide a concise summary that includes:
1. Key entities (people, places, organizations).
2. A brief timeline of events if applicable.
3. Any potential connections to other known UAP cases, technologies, or phenomena.
4. An overall assessment of the document's significance.

Document Content:
---
${content}
---
`,
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing file content:", error);
        return "Failed to analyze the document. Please try again.";
    }
};
