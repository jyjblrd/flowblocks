import React from 'react';
import { useReactFlow } from 'reactflow';
import Button from 'react-bootstrap/Button';
import { cxx } from '../cxx';
import runOnDevice from '../shared/helpers/serial';
import flowchartToJSON from '../shared/helpers/helperFunctions';

export default function Toolbar() {
  const reactFlowInstance = useReactFlow();

  return (
    <div style={{ float: 'right' }}>
      <Button variant="outline-dark" className="mx-1">Save</Button>
      <Button variant="outline-dark" className="mx-1">Load</Button>
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={() => {
          console.log(cxx.compile(flowchartToJSON(reactFlowInstance)));
          alert('check console log for code');
        }}
      >
        Compile
      </Button>
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={async () => {
          await runOnDevice(cxx.compile(flowchartToJSON(reactFlowInstance)));
        }}
      >
        Compile and run
      </Button>
    </div>
  );
}
