import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import WorkflowStep from './WorkflowStep';

const WorkflowScreen: React.FC = () => {
  const { 
    state, 
    setCurrentScreen, 
    resetApp, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      } else if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  if (!state.currentWorkflow) {
    return null;
  }

  const handleContinueToReview = () => {
    setCurrentScreen('confirmation');
  };

  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to start over? This will clear your current workflow.')) {
      resetApp();
    }
  };

  const getLastActionDescription = () => {
    if (state.history.length === 0) return null;
    const lastAction = state.history[state.historyIndex];
    return lastAction?.description || null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {state.currentWorkflow.title}
              </h1>
              <p className="text-gray-600">{state.currentWorkflow.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Original request: "{state.originalPrompt}"
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Undo (Ctrl+Z)"
                >
                  ↶ Undo
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Redo (Ctrl+Y)"
                >
                  ↷ Redo
                </button>
              </div>
              
              <button
                onClick={handleStartOver}
                className="btn-secondary"
              >
                Start Over
              </button>
              
              <button
                onClick={handleContinueToReview}
                className="btn-primary"
              >
                Continue to Review
              </button>
            </div>
          </div>
          
          {getLastActionDescription() && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Last action:</span> {getLastActionDescription()}
                {canUndo && <span className="ml-2 text-blue-600">(Press Ctrl+Z to undo)</span>}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {state.currentWorkflow.steps.map((step, index) => (
            <WorkflowStep
              key={step.id}
              step={step}
              stepNumber={index + 1}
              totalSteps={state.currentWorkflow!.steps.length}
              canMoveUp={index > 0}
              canMoveDown={index < state.currentWorkflow!.steps.length - 1}
            />
          ))}
        </div>

        {state.currentWorkflow.steps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No steps in workflow</h3>
            <p className="text-gray-600">All steps have been removed. Consider starting over.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowScreen; 