import { GoogleGenAI, Chat, Type } from "@google/genai";
import { NewsArticle } from '../types.ts';

// The API key is sourced directly from the environment.
// The execution environment (e.g., AI Studio) is expected to provide process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = ai.models;

export const fetchRecentNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await model.generateContent({
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

  } catch (error)
 {
    console.error("Error fetching UFO news:", error);
    // The UI handles the empty array case with a message.
    return [];
  }
};

export const initChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a highly intelligent research assistant specializing in UFOlogy, UAP phenomena, and analysis of government documents. Your goal is to help the user find connections, analyze data, draft Freedom of Information Act (FOIA) requests, and explore hypotheses. Be objective, analytical, and cite sources when possible.',
    },
  });
};

export const generateSocialPostIdeas = async (topic: string): Promise<string> => {
    if (!topic) return "Please provide a topic.";
    try {
        const response = await model.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 5 creative and engaging social media post ideas about ${topic}. Include a mix of formats like questions, facts, and story prompts. Format the output as a markdown list.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating social media posts:", error);
        return "An error occurred while generating ideas. Please check your API key and try again.";
    }
};

export const analyzeFileContent = async (fileName: string, content: string): Promise<string> => {
    try {
        const response = await model.generateContent({
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
        return "Failed to analyze the document. This could be due to an API key issue. Please try again.";
    }
};