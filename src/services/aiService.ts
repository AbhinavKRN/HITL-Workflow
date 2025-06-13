import { AIResponse, Workflow, WorkflowStep } from '../types';

// Sample workflow data for different types of prompts
const sampleWorkflows: Record<string, Workflow> = {
  'crm': {
    id: 'wf_crm_cleanup',
    title: 'CRM Data Cleanup Workflow',
    description: 'Comprehensive cleanup and organization of CRM data',
    status: 'draft',
    createdAt: new Date(),
    steps: [
      {
        id: 'step_1',
        title: 'Export and Backup Current Data',
        description: 'Create a complete backup of existing CRM data before making any changes',
        toolName: 'Salesforce',
        reasoning: 'Always backup data before cleanup operations to prevent data loss',
        confidence: 0.95,
        agentId: 'data-agent'
      },
      {
        id: 'step_2',
        title: 'Identify Duplicate Contacts',
        description: 'Scan for duplicate contacts based on email, phone, and company name',
        toolName: 'Salesforce',
        reasoning: 'Duplicates create confusion and waste storage space, need to be removed first',
        confidence: 0.88,
        agentId: 'data-agent'
      },
      {
        id: 'step_3',
        title: 'Merge Duplicate Records',
        description: 'Consolidate duplicate contacts, keeping the most complete information',
        toolName: 'Salesforce',
        reasoning: 'Merging preserves valuable data while eliminating redundancy',
        confidence: 0.82,
        agentId: 'data-agent'
      },
      {
        id: 'step_4',
        title: 'Standardize Contact Information',
        description: 'Normalize phone numbers, addresses, and company names to consistent formats',
        toolName: 'Salesforce',
        reasoning: 'Standardized data improves searchability and reporting accuracy',
        confidence: 0.91,
        agentId: 'data-agent'
      },
      {
        id: 'step_5',
        title: 'Update Lead Scoring',
        description: 'Recalculate lead scores based on current engagement and profile data',
        toolName: 'Salesforce',
        reasoning: 'Updated scoring ensures sales team focuses on highest-quality prospects',
        confidence: 0.86,
        agentId: 'scoring-agent'
      }
    ]
  },
  'email': {
    id: 'wf_email_campaign',
    title: 'Email Marketing Campaign Workflow',
    description: 'Setup and launch targeted email marketing campaign',
    status: 'draft',
    createdAt: new Date(),
    steps: [
      {
        id: 'step_1',
        title: 'Segment Target Audience',
        description: 'Create customer segments based on demographics and behavior',
        toolName: 'HubSpot',
        reasoning: 'Segmentation ensures relevant messaging and higher engagement rates',
        confidence: 0.93,
        agentId: 'marketing-agent'
      },
      {
        id: 'step_2',
        title: 'Design Email Templates',
        description: 'Create responsive email templates with compelling subject lines',
        toolName: 'HubSpot',
        reasoning: 'Professional templates improve open rates and brand consistency',
        confidence: 0.87,
        agentId: 'creative-agent'
      },
      {
        id: 'step_3',
        title: 'Setup A/B Testing',
        description: 'Configure tests for subject lines and call-to-action buttons',
        toolName: 'HubSpot',
        reasoning: 'A/B testing optimizes campaign performance through data-driven decisions',
        confidence: 0.89,
        agentId: 'analytics-agent'
      }
    ]
  },
  'default': {
    id: 'wf_generic',
    title: 'Custom Workflow',
    description: 'AI-generated workflow based on your request',
    status: 'draft',
    createdAt: new Date(),
    steps: [
      {
        id: 'step_1',
        title: 'Analyze Requirements',
        description: 'Break down the task into actionable components',
        toolName: 'Generic Tool',
        reasoning: 'Understanding requirements is essential for successful execution',
        confidence: 0.75,
        agentId: 'planning-agent'
      },
      {
        id: 'step_2',
        title: 'Execute Primary Action',
        description: 'Perform the main task as requested',
        toolName: 'Generic Tool',
        reasoning: 'Core execution step to achieve the primary objective',
        confidence: 0.68,
        agentId: 'execution-agent'
      }
    ]
  }
};

export const generateWorkflow = async (prompt: string): Promise<AIResponse> => {
  // Simulate processing delay
  const processingTime = Math.random() * 2000 + 1000; // 1-3 seconds
  await new Promise(resolve => setTimeout(resolve, processingTime));

  // Determine workflow type based on prompt
  let workflowType = 'default';
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes('crm') || lowercasePrompt.includes('salesforce') || lowercasePrompt.includes('contact')) {
    workflowType = 'crm';
  } else if (lowercasePrompt.includes('email') || lowercasePrompt.includes('marketing') || lowercasePrompt.includes('campaign')) {
    workflowType = 'email';
  }

  // Simulate occasional errors or low confidence
  const shouldFail = Math.random() < 0.05; // 5% chance of failure
  const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence

  if (shouldFail) {
    return {
      workflow: sampleWorkflows.default,
      success: false,
      error: 'Unable to generate workflow. Please try rephrasing your request.',
      confidence: 0.3,
      processingTime
    };
  }

  const selectedWorkflow = { ...sampleWorkflows[workflowType] };
  selectedWorkflow.title = workflowType === 'default' 
    ? `Workflow for: ${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}`
    : selectedWorkflow.title;

  return {
    workflow: selectedWorkflow,
    success: true,
    confidence,
    processingTime
  };
};

export const reviseStep = async (stepId: string, instruction: string): Promise<WorkflowStep> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

  // Generate a revised step (in real implementation, this would call the AI)
  return {
    id: stepId,
    title: `Revised: ${instruction.slice(0, 30)}...`,
    description: `Updated step based on your feedback: ${instruction}`,
    toolName: 'Updated Tool',
    reasoning: 'Revised based on user input to better meet requirements',
    confidence: 0.85,
    agentId: 'revision-agent'
  };
}; 