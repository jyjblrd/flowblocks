import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowBuilder from './components/FlowBuilder';

export default function App() {
  return (
    <div className="App">
      <ReactFlowProvider>
        <FlowBuilder />
      </ReactFlowProvider>
    </div>
  );
}
