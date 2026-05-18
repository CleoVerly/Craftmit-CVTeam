// src/openrouter.ts

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function generateCommitMessage(diff: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is not configured in your .env file.");
  }

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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("Error generating commit message:", error);
    throw new Error(`Failed to generate message: ${error.message}`);
  }
}