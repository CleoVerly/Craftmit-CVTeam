// src/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error(
    "VITE_GEMINI_API_KEY is not set. Please add it to your .env file."
  );
}
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

export async function generateCommitMessageFromDiff(diff: string): Promise<string> {
  const prompt = `
    Based on the following git diff, please generate a concise and clear commit message in English.
    The message should follow the Conventional Commits specification.
    Summarize the main changes in a title, and then provide a bulleted list of the key changes.

    Here is the git diff:
    \`\`\`diff
    ${diff}
    \`\`\`
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error("Error generating commit message from Gemini:", error);

    const message = error.message || "An unknown error occurred.";
    throw new Error(`Failed to communicate with the AI model: ${message}`);
  }
}
