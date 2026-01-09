
import { GoogleGenAI } from "@google/genai";
import { Committee } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateCommitteeRules = async (committee: Committee): Promise<string> => {
  if (!API_KEY) {
    return "Gemini API key not configured. Please set the API_KEY environment variable.";
  }
  
  try {
    const prompt = `
      Generate a simple, clear set of rules for a friendly financial committee (chit fund) in India.
      The rules should be easy for anyone to understand.
      Keep it concise, under 100 words.

      Committee Details:
      - Name: ${committee.name}
      - Monthly Contribution: ₹${committee.monthlyAmount}
      - Number of Members: ${committee.totalMembers}
      - Duration: ${committee.duration} months

      Generate 3-4 bullet points covering payment deadlines, draw dates, and handling of late payments.
      The tone should be encouraging and community-focused.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || 'Could not generate rules at this time.';
  } catch (error) {
    console.error("Error generating committee rules with Gemini:", error);
    return "An error occurred while generating rules. Please try again.";
  }
};
