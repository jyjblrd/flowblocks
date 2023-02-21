import React from 'react';
import { useReactFlow } from 'reactflow';
import Button from 'react-bootstrap/Button';
import { useRecoilValue } from 'recoil';
import { cxx } from '../cxx';
import { runOnDevice, stopRunning, disconnectSerial } from '../shared/helpers/serial';
import flowchartToJSON, { saveFlowInstance, loadFlowInstance } from '../shared/helpers/helperFunctions';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';

export default function Toolbar() {
  const reactFlowInstance = useReactFlow();

  const nodeTypes = useRecoilValue(nodeTypesAtom);

  return (
    <div style={{ float: 'right' }}>
      <Button
        variant="outline-dark"
        className="mx-1"
        onClick={() => {
          // console.log("Save")
          const name = 'flowchart2';
          saveFlowInstance(reactFlowInstance, name);
          // save blob
        }}
      >
        Save
      </Button>
      <Button
        variant="outline-dark"
        className="mx-1"
        onClick={() => {
          const name = 'flowchart2';
          loadFlowInstance(reactFlowInstance, name);
        }}
      >
        Load
      </Button>
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={() => {
          console.log(cxx.compile(flowchartToJSON(reactFlowInstance), nodeTypes));
          alert('check console log for code');
        }}
      >
        Compile
      </Button>
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={async () => {
          await runOnDevice(cxx.compile(flowchartToJSON(reactFlowInstance), nodeTypes));
        }}
      >
        Compile and run
      </Button>
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={async () => {
          await stopRunning();
        }}
      >
        Stop running
      </Button>
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={async () => {
          await disconnectSerial();
        }}
      >
        Disconnect
      </Button>
    </div>
  );
}
