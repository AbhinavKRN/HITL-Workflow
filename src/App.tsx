import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import InputScreen from './components/InputScreen';
import WorkflowScreen from './components/WorkflowScreen';
import ConfirmationScreen from './components/ConfirmationScreen';
import LoadingScreen from './components/LoadingScreen';
import ErrorDisplay from './components/ErrorDisplay';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const AppContent: React.FC = () => {
  const { state, setError } = useAppContext();

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (state.error) {
    return (
      <ErrorDisplay 
        error={state.error}
        onRetry={() => setError(null)}
      />
    );
  }

  switch (state.currentScreen) {
    case 'input':
      return <InputScreen />;
    case 'workflow':
      return <WorkflowScreen />;
    case 'confirmation':
      return <ConfirmationScreen />;
    default:
      return <InputScreen />;
  }
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
