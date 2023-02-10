import React from 'react';
import { useRecoilValue } from 'recoil';
import { useReactFlow, Node } from 'reactflow';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import { cxx } from '../cxx';
import flowchartToJSON from '../shared/helpers/helperFunctions';

export default function Toolbar() {
  const nodeTypes = useRecoilValue(nodeTypesAtom);

  const reactFlowInstance = useReactFlow();

  function createNewNodeInstance(nodeTypeId: string) {
    const newNodeData = { ...nodeTypes[nodeTypeId], nodeTypeId };

    const nodes = reactFlowInstance.getNodes();
    const nextNodeInstanceId = nodes.length === 0
      ? '0'
      : (Math.max(...nodes.map((node) => parseInt(node.id, 10))) + 1).toString();

    const newNode: Node = {
      id: nextNodeInstanceId,
      position: { x: 0, y: 0 },
      data: newNodeData,
      type: 'defaultNode',
    };
    reactFlowInstance.addNodes(newNode);
  }

  return (
    <div style={{ float: 'right' }}>
      {
        Object.keys(nodeTypes).map((nodeTypeId) =>
          <button type="button" key={nodeTypeId} onClick={() => createNewNodeInstance(nodeTypeId)}>{ nodeTypeId }</button>)
      }
      <button type="button" className="toolbar">Save</button>
      <button type="button" className="toolbar">Load</button>
      <button
        type="button"
        className="toolbar"
        onClick={() => {
          console.log(cxx.compile(flowchartToJSON(reactFlowInstance)));
          alert('check console log for code');
        }}
      >
        Compile
      </button>
    </div>
  );
}
