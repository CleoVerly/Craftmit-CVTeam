import { useState } from 'react';
import { generateCommitMessageFromDiff } from './gemini';

function App() {
  const [diffInput, setDiffInput] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateCommit = async () => {
    if (!diffInput.trim()) {
      setError('Please paste your git diff content.');
      return;
    }
    setIsLoading(true);
    setError('');
    setCommitMessage('');
    try {
      const generatedMessage = await generateCommitMessageFromDiff(diffInput);
      setCommitMessage(generatedMessage);
    } catch (e: any) {
      setError(e.message || 'Failed to generate commit message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-cyan-400 mb-2">Git Diff to Commit Message</h1>
        <p className="text-center text-gray-400 mb-8">
          Paste your `git diff` below and get a structured commit message.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Diff */}
          <div className="flex flex-col">
            <label htmlFor="diff-input" className="mb-2 font-semibold text-gray-300">Git Diff Input</label>
            <textarea
              id="diff-input"
              value={diffInput}
              onChange={(e) => setDiffInput(e.target.value)}
              className="h-80 p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono text-sm"
              placeholder="Paste the output of 'git diff' here..."
            />
          </div>

          {/* Output Commit Message */}
          <div className="flex flex-col">
            <label htmlFor="commit-output" className="mb-2 font-semibold text-gray-300">Generated Commit Message</label>
            <div
              id="commit-output"
              className="h-80 p-3 bg-gray-800 border border-gray-700 rounded-md font-mono text-sm whitespace-pre-wrap overflow-auto"
            >
              {isLoading ? <span className="text-gray-500">Generating...</span> : commitMessage || <span className="text-gray-500">Your commit message will appear here...</span>}
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="text-center mt-6">
          <button
            onClick={handleGenerateCommit}
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
