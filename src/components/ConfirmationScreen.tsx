import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from './Modal';

const ConfirmationScreen: React.FC = () => {
  const [isApproving, setIsApproving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { state, setCurrentScreen, resetApp } = useAppContext();

  if (!state.currentWorkflow) {
    return null;
  }

  const handleBackToWorkflow = () => {
    setCurrentScreen('workflow');
  };

  const handleApprove = async () => {
    setIsApproving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsApproving(false);
    setShowSuccessModal(true);
  };

  const handleSuccessModalConfirm = () => {
    setShowSuccessModal(false);
    resetApp();
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this workflow?')) {
      resetApp();
    }
  };

  const totalSteps = state.currentWorkflow.steps.length;
  const uniqueTools = new Set(state.currentWorkflow.steps.map(step => step.toolName));
  const uniqueAgents = new Set(state.currentWorkflow.steps.map(step => step.agentId));
  
  const averageConfidence = state.currentWorkflow.steps.reduce((sum, step) => {
    return sum + (step.confidence || 0);
  }, 0) / state.currentWorkflow.steps.length;

  const estimatedTime = totalSteps * 15;

  const createdDate = typeof state.currentWorkflow.createdAt === 'string' 
    ? new Date(state.currentWorkflow.createdAt) 
    : state.currentWorkflow.createdAt;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Final Review</h1>
            <p className="text-lg text-gray-600">
              Please review your workflow before approval
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Workflow Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{state.currentWorkflow.title}</h3>
              <p className="text-gray-600 mb-4">{state.currentWorkflow.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Original Request:</span>
                  <span className="text-sm text-gray-900 font-medium">"{state.originalPrompt}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm text-gray-900">
                    {createdDate.toLocaleDateString()} at {createdDate.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Workflow Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Steps:</span>
                    <span className="text-sm font-medium">{totalSteps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tools Required:</span>
                    <span className="text-sm font-medium">{uniqueTools.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">AI Agents:</span>
                    <span className="text-sm font-medium">{uniqueAgents.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estimated Time:</span>
                    <span className="text-sm font-medium">{Math.floor(estimatedTime / 60)}h {estimatedTime % 60}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className={`text-sm font-medium ${
                      averageConfidence >= 0.8 ? 'text-green-600' : 
                      averageConfidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round(averageConfidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tools Required</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(uniqueTools).map(tool => (
                  <span
                    key={tool}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI Agents Involved</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(uniqueAgents).map(agent => (
                  <span
                    key={agent}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {agent?.replace('-', ' ') || 'Unknown Agent'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Steps Overview</h2>
          
          <div className="space-y-4">
            {state.currentWorkflow.steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {step.toolName}
                    </span>
                    {step.confidence && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        step.confidence >= 0.8 ? 'bg-green-100 text-green-800' :
                        step.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {Math.round(step.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Ready to execute?</h3>
              <p className="text-sm text-gray-600">
                Once approved, this workflow will be submitted for execution.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleBackToWorkflow}
                className="btn-secondary"
              >
                ← Back to Edit
              </button>
              
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                Cancel
              </button>
              
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Approving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve & Execute
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalConfirm}
        title="Workflow Approved!"
        message="Your workflow has been successfully approved and submitted for execution."
        type="success"
        confirmText="Continue"
        onConfirm={handleSuccessModalConfirm}
      />
    </div>
  );
};

export default ConfirmationScreen; 