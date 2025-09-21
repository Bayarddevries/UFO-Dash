import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { NewsArticle } from '../types';

const getApiKey = (): string | null => {
  // For remote hosting, the user provides their own key, stored in localStorage.
  // This approach avoids exposing a hardcoded key in a publicly accessible app.
  return localStorage.getItem('gemini-api-key');
};

export const saveApiKey = (key: string): void => {
  localStorage.setItem('gemini-api-key', key);
};

export const isApiKeySet = (): boolean => {
  const key = getApiKey();
  return !!key && key !== 'YOUR_API_KEY_HERE';
};

const getAiClient = (): GoogleGenAI | null => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("API Key is not set in local storage.");
    return null;
  }
  // This is where the API key from local storage is used to initialize the client.
  return new GoogleGenAI({ apiKey });
};

export const fetchRecentNews = async (): Promise<NewsArticle[]> => {
  const ai = getAiClient();
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
  const ai = getAiClient();
  if (!ai) return null;
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a highly intelligent research assistant specializing in UFOlogy, UAP phenomena, and analysis of government documents. Your goal is to help the user find connections, analyze data, draft Freedom of Information Act (FOIA) requests, and explore hypotheses. Be objective, analytical, and cite sources when possible.',
    },
  });
};

export const generateSocialPostIdeas = async (topic: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "API key not configured. Please set it in the application.";
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
    const ai = getAiClient();
    if (!ai) return "API key not configured. Please set it in the application.";
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
