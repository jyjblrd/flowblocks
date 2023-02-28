import React from 'react';
import { useReactFlow } from 'reactflow';
import Button from 'react-bootstrap/Button';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { cxx } from '../cxx';
import { runOnDevice, stopRunning, disconnectSerial } from '../shared/helpers/serial';
import flowchartToJSON, {
  saveFlowInstance, loadFlowInstance, ppKnownCharts, compileCircuit,
} from '../shared/helpers/helperFunctions';
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
          // startTutorial();
        }}
      >
        Tutorial
      </Button>
      <Button
        variant="outline-dark"
        className="mx-1"
        onClick={() => {
          // console.log("Save")
          setSaveModal((prevSaveModal) => ({
            ...prevSaveModal,
            isOpen: true,
            saveChart: (name) => { saveFlowInstance(reactFlowInstance, name); },
          }));

          // save blob
        }}
      >
        Save
      </Button>
      <Button
        variant="outline-dark"
        className="mx-1"
        onClick={() => {
          const knownNames = ppKnownCharts();
          setLoadModal((prevLoadModal) => ({
            ...prevLoadModal,
            isOpen: true,
            loadChart: (name) => { loadFlowInstance(reactFlowInstance, name); },
            knownNames,
          }));
          // loadFlowInstance(reactFlowInstance, name);
        }}
      >
        Load
      </Button>
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={() => {
          const result = cxx.compile(flowchartToJSON(reactFlowInstance), nodeTypes);
          if (result.ok()) {
            setCodeModal((prevCodeModal) => ({
              ...prevCodeModal,
              isOpen: true,
              code: result.code(),
            }));
          } else {
            // TODO: replace console log errors with error box / other system at a later date
            console.log(`Error: ${result.error()}`);
          }
          result.delete();
        }}
      >
        Show code
      </Button>
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={async () => {
          const result = cxx.compile(flowchartToJSON(reactFlowInstance), nodeTypes);
          if (result.ok()) {
            await runOnDevice(result.code());
          } else {
            // TODO: replace console log errors with error box / other system at a later date
            console.log(`Error: ${result.error()}`);
          }
          result.delete();
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
      <Button
        className="mx-1"
        variant="outline-dark"
        onClick={async () => {
          compileCircuit(reactFlowInstance.getNodes());
        }}
      >
        Generate Circut
      </Button>
    </div>
  );
}
