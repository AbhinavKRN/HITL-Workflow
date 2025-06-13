export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  toolName: string;
  reasoning: string;
  confidence?: number;
  agentId?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
  status: 'draft' | 'approved' | 'running' | 'completed' | 'failed';
  createdAt: Date;
}

export interface AIResponse {
  workflow: Workflow;
  success: boolean;
  error?: string;
  confidence: number;
  processingTime: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  action: string;
  previousState: Workflow;
  description: string;
}

export interface AppState {
  currentWorkflow: Workflow | null;
  isLoading: boolean;
  error: string | null;
  currentScreen: 'input' | 'workflow' | 'confirmation';
  originalPrompt: string;
  history: HistoryEntry[];
  historyIndex: number;
}

export interface StepEditData {
  title: string;
  description: string;
  toolName: string;
  reasoning: string;
} 