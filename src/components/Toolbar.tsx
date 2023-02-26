import React from 'react';
import { useReactFlow } from 'reactflow';
import Button from 'react-bootstrap/Button';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { cxx } from '../cxx';
import { runOnDevice, stopRunning, disconnectSerial } from '../shared/helpers/serial';
import flowchartToJSON, { saveFlowInstance, loadFlowInstance, ppKnownCharts } from '../shared/helpers/helperFunctions';
//import { startTutorial } from '../shared/helpers/tutorial';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import { codeModalAtom } from '../shared/recoil/atoms/codeModalAtom';
import { saveModalAtom } from '../shared/recoil/atoms/saveModalAtom';
import { loadModalAtom } from '../shared/recoil/atoms/loadModalAtom';

export default function Toolbar() {
  const reactFlowInstance = useReactFlow();

  const nodeTypes = useRecoilValue(nodeTypesAtom);
  const setCodeModal = useSetRecoilState(codeModalAtom);
  const setSaveModal = useSetRecoilState(saveModalAtom);
  const setLoadModal = useSetRecoilState(loadModalAtom);

  return (
    <div style={{ float: 'right' }}>
      <Button
        variant="outline-dark"
        className="mx-1"
        onClick={() => {
          //startTutorial();
        }}
      >
        Tutorial
      </Button>
      <Button
        variant="outline-dark"
        className="mx-1"
        onClick={() => {
          // console.log("Save")
          const name = 'flowchart2';
          setSaveModal((prevSaveModal) => ({ ...prevSaveModal, isOpen: true, saveChart: (name) => {saveFlowInstance(reactFlowInstance, name)} }));
          
          // save blob
        }}
      >
        Save
      </Button>
      <Button
        variant="outline-dark"
        className="mx-1"
        onClick={() => {
          const name = 'default';
          const knownNames = ppKnownCharts();
          setLoadModal((prevLoadModal) => ({ ...prevLoadModal, isOpen: true, loadChart: (name) => {loadFlowInstance(reactFlowInstance, name)}, knownNames: knownNames }));
          //loadFlowInstance(reactFlowInstance, name);
        }}
      >
        Load
      </Button>
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={() => {
          const code = cxx.compile(flowchartToJSON(reactFlowInstance), nodeTypes);
          setCodeModal((prevCodeModal) => ({ ...prevCodeModal, isOpen: true, code }));
        }}
      >
        Show code
      </Button>
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={async () => {
          await runOnDevice(cxx.compile(flowchartToJSON(reactFlowInstance), nodeTypes));
        }}
      >
        Run
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
