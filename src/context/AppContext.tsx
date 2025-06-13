import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Workflow, WorkflowStep, HistoryEntry } from '../types';

interface AppContextType {
  state: AppState;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  setCurrentScreen: (screen: 'input' | 'workflow' | 'confirmation') => void;
  setOriginalPrompt: (prompt: string) => void;
  updateStep: (stepId: string, updatedStep: WorkflowStep) => void;
  deleteStep: (stepId: string) => void;
  reorderSteps: (sourceIndex: number, destinationIndex: number) => void;
  resetApp: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_WORKFLOW'; payload: Workflow | null }
  | { type: 'SET_CURRENT_SCREEN'; payload: 'input' | 'workflow' | 'confirmation' }
  | { type: 'SET_ORIGINAL_PROMPT'; payload: string }
  | { type: 'UPDATE_STEP'; payload: { stepId: string; updatedStep: WorkflowStep; description: string } }
  | { type: 'DELETE_STEP'; payload: { stepId: string; description: string } }
  | { type: 'REORDER_STEPS'; payload: { sourceIndex: number; destinationIndex: number; description: string } }
  | { type: 'RESET_APP' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const initialState: AppState = {
  currentWorkflow: null,
  isLoading: false,
  error: null,
  currentScreen: 'input',
  originalPrompt: '',
  history: [],
  historyIndex: -1
};

const generateHistoryEntry = (action: string, previousState: Workflow, description: string): HistoryEntry => ({
  id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  timestamp: new Date(),
  action,
  previousState: JSON.parse(JSON.stringify(previousState)),
  description
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_WORKFLOW':
      return { ...state, currentWorkflow: action.payload };
    case 'SET_CURRENT_SCREEN':
      return { ...state, currentScreen: action.payload };
    case 'SET_ORIGINAL_PROMPT':
      return { ...state, originalPrompt: action.payload };
    case 'UPDATE_STEP':
      if (!state.currentWorkflow) return state;
      
      const historyEntryUpdate = generateHistoryEntry(
        'UPDATE_STEP',
        state.currentWorkflow,
        action.payload.description
      );
      
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          steps: state.currentWorkflow.steps.map(step =>
            step.id === action.payload.stepId ? action.payload.updatedStep : step
          )
        },
        history: [...state.history.slice(0, state.historyIndex + 1), historyEntryUpdate],
        historyIndex: state.historyIndex + 1
      };
    case 'DELETE_STEP':
      if (!state.currentWorkflow) return state;
      
      const historyEntryDelete = generateHistoryEntry(
        'DELETE_STEP',
        state.currentWorkflow,
        action.payload.description
      );
      
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          steps: state.currentWorkflow.steps.filter(step => step.id !== action.payload.stepId)
        },
        history: [...state.history.slice(0, state.historyIndex + 1), historyEntryDelete],
        historyIndex: state.historyIndex + 1
      };
    case 'REORDER_STEPS':
      if (!state.currentWorkflow) return state;
      
      const historyEntryReorder = generateHistoryEntry(
        'REORDER_STEPS',
        state.currentWorkflow,
        action.payload.description
      );
      
      const newSteps = [...state.currentWorkflow.steps];
      const [reorderedItem] = newSteps.splice(action.payload.sourceIndex, 1);
      newSteps.splice(action.payload.destinationIndex, 0, reorderedItem);
      
      return {
        ...state,
        currentWorkflow: {
          ...state.currentWorkflow,
          steps: newSteps
        },
        history: [...state.history.slice(0, state.historyIndex + 1), historyEntryReorder],
        historyIndex: state.historyIndex + 1
      };
    case 'UNDO':
      if (state.historyIndex >= 0 && state.history[state.historyIndex]) {
        return {
          ...state,
          currentWorkflow: state.history[state.historyIndex].previousState,
          historyIndex: state.historyIndex - 1
        };
      }
      return state;
    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        const nextHistoryIndex = state.historyIndex + 1;
        if (state.historyIndex + 2 < state.history.length) {
          return {
            ...state,
            currentWorkflow: state.history[state.historyIndex + 2].previousState,
            historyIndex: nextHistoryIndex
          };
        } else {
          return {
            ...state,
            historyIndex: nextHistoryIndex
          };
        }
      }
      return state;
    case 'RESET_APP':
      return initialState;
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const contextValue: AppContextType = {
    state,
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    setCurrentWorkflow: (workflow) => dispatch({ type: 'SET_CURRENT_WORKFLOW', payload: workflow }),
    setCurrentScreen: (screen) => dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen }),
    setOriginalPrompt: (prompt) => dispatch({ type: 'SET_ORIGINAL_PROMPT', payload: prompt }),
    updateStep: (stepId, updatedStep) => {
      const currentStep = state.currentWorkflow?.steps.find(s => s.id === stepId);
      const description = `Updated step: ${currentStep?.title || 'Unknown'} → ${updatedStep.title}`;
      dispatch({ type: 'UPDATE_STEP', payload: { stepId, updatedStep, description } });
    },
    deleteStep: (stepId) => {
      const currentStep = state.currentWorkflow?.steps.find(s => s.id === stepId);
      const description = `Deleted step: ${currentStep?.title || 'Unknown'}`;
      dispatch({ type: 'DELETE_STEP', payload: { stepId, description } });
    },
    reorderSteps: (sourceIndex, destinationIndex) => {
      const step = state.currentWorkflow?.steps[sourceIndex];
      const direction = sourceIndex < destinationIndex ? 'down' : 'up';
      const description = `Moved step "${step?.title || 'Unknown'}" ${direction}`;
      dispatch({ type: 'REORDER_STEPS', payload: { sourceIndex, destinationIndex, description } });
    },
    resetApp: () => dispatch({ type: 'RESET_APP' }),
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
    canUndo: state.historyIndex >= 0,
    canRedo: state.historyIndex < state.history.length - 1
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 