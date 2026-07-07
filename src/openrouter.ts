export const MAX_CHARS = 400000;

export type AIAction = 'commit' | 'review' | 'explain' | 'pr';

export async function askAI(diff: string, action: AIAction = 'commit'): Promise<string> {
  const processedDiff = diff;
  if (processedDiff.length > MAX_CHARS) {
    throw new Error(`Diff is too large. Maximum allowed characters is ${MAX_CHARS}.`);
  }

  let prompt = "";
  
  if (action === 'commit') {
    prompt = `
      Based on the following git diff, please generate a concise and clear commit message in English.
      The message should follow the Conventional Commits specification.
      Summarize the main changes in a title, and then provide a bulleted list of the key changes.

      Here is the git diff:
      \`\`\`diff
      ${processedDiff}
      \`\`\`
    `;
  } else if (action === 'review') {
    prompt = `
      Review the following git diff as a Senior Software Engineer.
      Look for:
      1. Potential bugs or edge cases not handled.
      2. Performance issues.
      3. Security vulnerabilities.
      4. Code style and best practices violations.
      
      Format the output clearly with headings and bullet points. If everything looks good, say so.

      Here is the git diff:
      \`\`\`diff
      ${processedDiff}
      \`\`\`
    `;
  } else if (action === 'explain') {
    prompt = `
      Explain the following git diff to a junior developer.
      Break down what changes were made, file by file or feature by feature.
      Explain the "why" behind these changes based on context clues.

      Here is the git diff:
      \`\`\`diff
      ${processedDiff}
      \`\`\`
    `;
  } else if (action === 'pr') {
    prompt = `
      Generate a professional Pull Request description based on the following git diff.
      Include:
      - ## Overview (Summary of the PR)
      - ## Changes (List of specific changes)
      - ## Impact (What parts of the system are affected)
      
      Here is the git diff:
      \`\`\`diff
      ${processedDiff}
      \`\`\`
    `;
  }

  try {
    const response = await fetch("/api/openrouter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server API error (${response.status})`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      console.error("Unexpected API response:", data);
      throw new Error(`Server returned an unexpected response: ${JSON.stringify(data)}`);
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error asking AI:", error);
    throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : String(error)}`);
  }
}