import React from 'react';
import { useReactFlow } from 'reactflow';
import Button from 'react-bootstrap/Button';
import { cxx } from '../cxx';
import runOnDevice from '../serial';
import flowchartToJSON from '../shared/helpers/helperFunctions';

export default function Toolbar() {
  const reactFlowInstance = useReactFlow();

  return (
    <div style={{ float: 'right' }}>
      <Button variant="outline-primary">Save</Button>
      <Button variant="outline-primary">Load</Button>
      <Button
        variant="outline-primary"
        onClick={() => {
          console.log(cxx.compile(flowchartToJSON(reactFlowInstance)));
          alert('check console log for code');
        }}
      >
        Compile
      </Button>
      <Button
        variant="outline-primary"
        onClick={async () => {
          await runOnDevice(cxx.compile(flowchartToJSON(reactFlowInstance)));
        }}
      >
        Compile and run
      </Button>
    </div>
  );
}
