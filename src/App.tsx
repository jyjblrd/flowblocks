import React from 'react';
import FlowBuilder from './components/FlowBuilder';
import Toolbar from './components/Toolbar';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Toolbar />
      <FlowBuilder />
    </div>
  );
}
