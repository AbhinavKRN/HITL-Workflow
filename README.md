# HITL Interface - AI Teammate Workflow Builder

A Human-in-the-Loop interface for an AI teammate product that allows users to create, edit, and approve AI-generated workflows with natural language input.

## Features

### Core Features
- Natural language input for task descriptions
- AI workflow generation with realistic mock responses
- Full CRUD operations on workflow steps (edit, delete, reorder)
- Individual step revision with AI assistance
- Final confirmation screen for workflow approval
- Comprehensive error handling and loading states
- Responsive design for desktop and mobile

### Bonus Features
- **Undo/Redo System**: Complete history tracking with keyboard shortcuts (Ctrl+Z/Ctrl+Y)
- **Enhanced AI Agent Indicators**: Color-coded badges with unique icons for different agent types
- **Advanced Confidence Display**: Visual confidence indicators with icons and color coding
- **Real-time History**: Shows last action taken with visual feedback

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling and responsive design
- **React Context + useReducer** for centralized state management
- **Error Boundary** for production-ready error handling

### Project Structure
```
src/
├── components/           # React components
│   ├── InputScreen.tsx      # Natural language input interface
│   ├── WorkflowScreen.tsx   # Main workflow editing interface
│   ├── WorkflowStep.tsx     # Individual step component with editing
│   ├── ConfirmationScreen.tsx # Final review and approval
│   ├── LoadingScreen.tsx    # Loading states with animations
│   ├── ErrorDisplay.tsx     # Error handling component
│   └── ErrorBoundary.tsx    # Global error boundary
├── context/             # State management
│   └── AppContext.tsx       # Global app state with undo/redo
├── services/            # External services
│   └── aiService.ts         # Mock AI responses with delays
├── types/               # TypeScript definitions
│   └── index.ts             # All interface definitions
└── App.tsx              # Main application component
```

### State Management
- **AppContext**: Centralized state using React Context + useReducer
- **History System**: Complete undo/redo with action tracking
- **Type Safety**: Full TypeScript coverage for all components and state

### Mock AI Service
- Contextual responses based on input keywords (CRM, email, marketing)
- Realistic processing delays (1-3 seconds)
- Confidence scoring and error simulation
- Agent assignment and tool selection

## User Experience

### Workflow Creation Process
1. **Input Screen**: Natural language task description with sample prompts
2. **Workflow Screen**: Generated steps with editing capabilities
3. **Confirmation Screen**: Final review with workflow statistics

### Interaction Features
- **Step Management**: Edit titles, descriptions, tools, and reasoning
- **Reordering**: Move steps up/down with visual feedback
- **AI Revision**: Ask AI to modify individual steps
- **Undo/Redo**: Complete history with keyboard shortcuts
- **Visual Indicators**: Confidence levels, agent types, and tool assignments

### Visual Design
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Interactive Elements**: Hover states, transitions, and visual feedback
- **Loading States**: Engaging animations during AI processing
- **Error Handling**: User-friendly error messages with retry options

## AI Agent Types
- **Data Agent**: Database and data management tasks
- **Marketing Agent**: Campaign and communication tasks  
- **Creative Agent**: Design and content creation tasks
- **Analytics Agent**: Reporting and analysis tasks
- **Planning Agent**: Strategy and organization tasks
- **Execution Agent**: Implementation and operational tasks

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Build
```bash
npm run build
```

## Future Enhancements

### Potential Improvements
- **Real AI Integration**: Replace mock service with actual AI API
- **Step Templates**: Pre-built step templates for common tasks
- **Workflow Sharing**: Export/import workflows between users
- **Advanced Analytics**: Detailed workflow performance metrics
- **Collaboration**: Multi-user editing with real-time sync
- **Integration Hub**: Connect with external tools and services
- **Smart Suggestions**: AI-powered workflow optimization recommendations

### Technical Improvements
- **Persistent Storage**: Save workflows to localStorage or backend
- **Advanced History**: Branching history with visual timeline
- **Keyboard Navigation**: Full keyboard accessibility
- **Drag & Drop**: Enhanced reordering with drag and drop
- **Bulk Operations**: Select and modify multiple steps at once

## Architecture Benefits

### Maintainability
- **Component Separation**: Clear separation of concerns
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Consistent Patterns**: Standardized component and state patterns

### Scalability
- **Context Pattern**: Easy to extend with additional state
- **Service Layer**: Clean abstraction for AI service integration
- **Component Reusability**: Modular components for future features

### User Experience
- **Responsive Design**: Works on all device sizes
- **Performance**: Efficient re-renders with proper state management
- **Accessibility**: Semantic HTML and keyboard support
