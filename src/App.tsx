import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import Toolbar from './components/Toolbar';
import FlowBuilder from './components/FlowBuilder';

export default function App() {
  return (
    <div className="App">
      <ReactFlowProvider>
        <FlowBuilder />
      </ReactFlowProvider>
      <Toolbar />
    </div>
  );
}
