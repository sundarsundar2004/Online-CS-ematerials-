import { GoogleGenAI, Type } from "@google/genai";
import { Message, QuizQuestion } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_FAST = 'gemini-2.5-flash';

export const geminiService = {
  /**
   * Generates the main learning content for a specific topic.
   */
  async generateLessonContent(topicTitle: string, subjectTitle: string, prompt: string): Promise<string> {
    try {
      const fullPrompt = `
        You are an expert Computer Science professor creating high-quality e-learning material.
        Subject: ${subjectTitle}
        Topic: ${topicTitle}
        
        Task: ${prompt}
        
        Format your response in clean Markdown.
        - Use ## for main sections.
        - Use **bold** for key terms.
        - Use code blocks (with language specified) for examples.
        - Include a "Key Takeaways" section at the end.
        - Be concise but comprehensive.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_FAST,
        contents: fullPrompt,
      });

      return response.text || "Failed to generate content.";
    } catch (error) {
      console.error("Error generating lesson:", error);
      throw error;
    }
  },

  /**
   * Generates a streaming response for the chat tutor.
   */
  async *streamChatResponse(history: Message[], newMessage: string, currentContext: string) {
    try {
      // Construct a simple chat history for the prompt context if needed, 
      // but for simplicity in this stateless demo, we'll just send the history as context.
      const chat = ai.chats.create({
        model: MODEL_FAST,
        config: {
          systemInstruction: `You are a helpful AI Tutor for a Computer Science learning platform. 
          The student is currently looking at material regarding: "${currentContext}".
          Answer their questions clearly and encourage critical thinking. Keep answers concise.`,
        }
      });
      
      // Feed history - simplified mapping
      // Note: In a real app, we would map previous messages to the chat history object properly.
      // Here we just send the new message for the stream to keep it robust and simple.
      
      const responseStream = await chat.sendMessageStream({
        message: newMessage,
      });

      for await (const chunk of responseStream) {
        yield chunk.text;
      }

    } catch (error) {
      console.error("Error in chat stream:", error);
      yield "I'm having trouble connecting to the server right now. Please try again.";
    }
  },

  /**
   * Generates a quiz based on the topic.
   */
  async generateQuiz(topicTitle: string): Promise<QuizQuestion[]> {
    try {
        const prompt = `Generate 3 multiple-choice questions about ${topicTitle} for a computer science student.
        Return ONLY a JSON array. 
        Each object should have:
        - "question": string
        - "options": array of 4 strings
        - "correctAnswerIndex": number (0-3)
        - "explanation": string (why the answer is correct)
        `;

        const response = await ai.models.generateContent({
            model: MODEL_FAST,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswerIndex: { type: Type.INTEGER },
                            explanation: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) return [];
        return JSON.parse(text) as QuizQuestion[];

    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
  }
};
