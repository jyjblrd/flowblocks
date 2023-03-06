import React from 'react';
import { useReactFlow } from 'reactflow';
import Button from 'react-bootstrap/Button';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { cxx } from '../cxx';
import { runOnDevice, stopRunning, disconnectSerial } from '../shared/helpers/serial';
import flowchartToJSON, {
  saveFlowInstance, loadFlowInstance, ppKnownCharts, compileCircuit,
} from '../shared/helpers/helperFunctions';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import { codeModalAtom } from '../shared/recoil/atoms/codeModalAtom';
import { saveModalAtom } from '../shared/recoil/atoms/saveModalAtom';
import { loadModalAtom } from '../shared/recoil/atoms/loadModalAtom';
import { NotificationKind, notificationListAtom } from '../shared/recoil/atoms/notificationListAtom';

export default function Toolbar() {
  const reactFlowInstance = useReactFlow();

  const [nodeTypes, setNodeTypes] = useRecoilState(nodeTypesAtom);
  const setCodeModal = useSetRecoilState(codeModalAtom);
  const setSaveModal = useSetRecoilState(saveModalAtom);
  const setLoadModal = useSetRecoilState(loadModalAtom);

  const setNotificationList = useSetRecoilState(notificationListAtom);

  const pushErrorNotification = (message: string) => {
    setNotificationList(
      (notificationListOld) => {
        const notifications = [...notificationListOld.notifications];
        notifications.push({ kind: NotificationKind.Error, message });
        return { ...notificationListOld, notifications };
      },
    );
  };

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
            saveChart: (name) => { saveFlowInstance(reactFlowInstance, nodeTypes, name); },
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
          const knownnames = ppKnownCharts();
          setLoadModal((prevLoadModal) => ({
            ...prevLoadModal,
            isOpen: true,
            loadChart: (name) => { loadFlowInstance(reactFlowInstance, setNodeTypes, name); },
            knownNames: knownnames,
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
            pushErrorNotification(result.error());
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
            pushErrorNotification(result.error());
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
          compileCircuit(reactFlowInstance.getNodes(), nodeTypes);
        }}
      >
        Generate Circuit
      </Button>
    </div>
  );
}
