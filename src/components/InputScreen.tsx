import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateWorkflow } from '../services/aiService';

const samplePrompts = [
  "Clean up my CRM data and remove duplicates",
  "Create an email marketing campaign for our new product",
  "Set up automated social media posting schedule",
  "Generate monthly sales reports and send to team",
  "Onboard new employees with training materials"
];

const InputScreen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const { setLoading, setError, setCurrentWorkflow, setCurrentScreen, setOriginalPrompt } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setOriginalPrompt(prompt);

    try {
      const response = await generateWorkflow(prompt);
      
      if (response.success && response.workflow) {
        setCurrentWorkflow(response.workflow);
        setCurrentScreen('workflow');
      } else {
        setError(response.error || 'Failed to generate workflow');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Teammate Workflow Builder
          </h1>
          <p className="text-xl text-gray-600">
            Describe what you need help with, and I'll create a step-by-step workflow for you.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like me to help you with?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the task or process you need help with..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!prompt.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Workflow
            </button>
          </form>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Try these examples:
            </h3>
            <div className="grid gap-2">
              {samplePrompts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleClick(sample)}
                  className="text-left p-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputScreen; 