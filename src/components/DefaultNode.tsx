import React from 'react';
import {
  Handle, NodeProps, Position,
} from 'reactflow';
import { useRecoilValue } from 'recoil';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import './DefaultNode.scss';

interface DummyNodeProps {
  data: NodeInstance;
}

function calcHandleTop(index: number, numHandles: number) {
  return `${(100 / (numHandles + 1)) * (index + 1)}%`;
}

export default function DefaultNode(
  {
    isDummyNode = false,
    data,
  }: (NodeProps<NodeInstance> | DummyNodeProps) & { isDummyNode?: Boolean },
) {
  const nodeType = useRecoilValue(nodeTypesAtom)[data.nodeTypeId];
  const numInputs = Object.entries(nodeType.inputs).length;
  const numOutputs = Object.entries(nodeType.outputs).length;

  return (
    <>
      {
        Object.entries(nodeType.inputs).map(([key], index) => {
          if (isDummyNode) {
            return (
              <div
                key={key}
                className="react-flow__handle react-flow__handle-left"
                style={{ top: calcHandleTop(index, numInputs) }}
              />
            );
          } else {
            return (
              <Handle
                type="target"
                position={Position.Left}
                id={key}
                key={key}
                style={{ top: calcHandleTop(index, numInputs) }}
              />
            );
          }
        })
      }
      <div
        style={{
          padding: '16px',
          backgroundColor: 'white',
          border: '2px solid grey',
          borderRadius: '10px',
        }}
      >
        <h5 className="m-0">{data.nodeTypeId}</h5>
      </div>
      {
        Object.entries(nodeType.outputs).map(([key], index) => {
          if (isDummyNode) {
            return (
              <div
                key={key}
                className="react-flow__handle react-flow__handle-right"
                style={{ top: calcHandleTop(index, numOutputs) }}
              />
            );
          } else {
            return (
              <Handle
                type="source"
                position={Position.Right}
                id={key}
                key={key}
                style={{ top: calcHandleTop(index, numOutputs) }}
              />
            );
          }
        })
      }
    </>
  );
}
