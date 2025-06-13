import React, { useState } from 'react';
import { WorkflowStep as WorkflowStepType, StepEditData } from '../types';
import { useAppContext } from '../context/AppContext';
import { reviseStep } from '../services/aiService';

interface WorkflowStepProps {
  step: WorkflowStepType;
  stepNumber: number;
  totalSteps: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, stepNumber, canMoveUp, canMoveDown }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const [editData, setEditData] = useState<StepEditData>({
    title: step.title,
    description: step.description,
    toolName: step.toolName,
    reasoning: step.reasoning
  });

  const { updateStep, deleteStep, reorderSteps } = useAppContext();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updatedStep: WorkflowStepType = {
      ...step,
      ...editData
    };
    updateStep(step.id, updatedStep);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: step.title,
      description: step.description,
      toolName: step.toolName,
      reasoning: step.reasoning
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this step?')) {
      deleteStep(step.id);
    }
  };

  const handleRevise = async () => {
    if (!revisionPrompt.trim()) return;
    
    setIsRevising(true);
    try {
      const revisedStep = await reviseStep(step.id, revisionPrompt);
      updateStep(step.id, revisedStep);
      setRevisionPrompt('');
    } catch (error) {
      console.error('Failed to revise step:', error);
    } finally {
      setIsRevising(false);
    }
  };

  const handleMoveUp = () => {
    if (canMoveUp) {
      reorderSteps(stepNumber - 1, stepNumber - 2);
    }
  };

  const handleMoveDown = () => {
    if (canMoveDown) {
      reorderSteps(stepNumber - 1, stepNumber);
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 text-gray-600 border-gray-200';
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getConfidenceIcon = (confidence?: number) => {
    if (!confidence) return null;
    if (confidence >= 0.8) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    if (confidence >= 0.6) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  const getAgentColor = (agentId?: string) => {
    if (!agentId) return 'bg-gray-100 text-gray-600 border-gray-200';
    const colors = {
      'data-agent': 'bg-blue-100 text-blue-800 border-blue-200',
      'marketing-agent': 'bg-purple-100 text-purple-800 border-purple-200',
      'creative-agent': 'bg-pink-100 text-pink-800 border-pink-200',
      'analytics-agent': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'planning-agent': 'bg-green-100 text-green-800 border-green-200',
      'execution-agent': 'bg-orange-100 text-orange-800 border-orange-200',
      'scoring-agent': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'revision-agent': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[agentId as keyof typeof colors] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getAgentIcon = (agentId?: string) => {
    const icons = {
      'data-agent': (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      'marketing-agent': (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
        </svg>
      ),
      'creative-agent': (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )
    };
    return icons[agentId as keyof typeof icons] || (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    );
  };

  if (isEditing) {
    return (
      <div className="step-card">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="input-field"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tool</label>
            <input
              type="text"
              className="input-field"
              value={editData.toolName}
              onChange={(e) => setEditData(prev => ({ ...prev, toolName: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reasoning</label>
            <textarea
              rows={2}
              className="input-field resize-none"
              value={editData.reasoning}
              onChange={(e) => setEditData(prev => ({ ...prev, reasoning: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveEdit} className="btn-primary">Save</button>
            <button onClick={handleCancelEdit} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="step-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">
            {stepNumber}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{step.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {step.toolName}
              </span>
              {step.agentId && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getAgentColor(step.agentId)}`}>
                  {getAgentIcon(step.agentId)}
                  <span className="ml-1">{step.agentId.replace('-', ' ')}</span>
                </span>
              )}
              {step.confidence && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(step.confidence)}`}>
                  {getConfidenceIcon(step.confidence)}
                  <span className="ml-1">{Math.round(step.confidence * 100)}% confidence</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleMoveUp}
            disabled={!canMoveUp}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title="Move up"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={handleMoveDown}
            disabled={!canMoveDown}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title="Move down"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
            title="Edit step"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
            title="Delete step"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-3 leading-relaxed">{step.description}</p>
      
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4 border border-gray-100">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">AI Reasoning</p>
            <p className="text-sm text-gray-600">{step.reasoning}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI to revise this step..."
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            value={revisionPrompt}
            onChange={(e) => setRevisionPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRevise()}
          />
          <button
            onClick={handleRevise}
            disabled={!revisionPrompt.trim() || isRevising}
            className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors duration-200"
          >
            {isRevising ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                Revising...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Revise
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStep; 