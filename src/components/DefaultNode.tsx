import React from 'react';
import {
  Handle, NodeProps, Position,
} from 'reactflow';
import { NodeTypeData } from '../shared/interfaces/NodeTypes.interface';
import './DefaultNode.scss';

interface DummyNodeProps {
  data: NodeTypeData;
}

function calcHandleTop(index: number, numHandles: number) {
  return `${(100 / (numHandles + 1)) * (index + 1)}%`;
}

export default function DefaultNode(
  {
    isDummyNode = false,
    data,
  }: (NodeProps<NodeTypeData> | DummyNodeProps) & { isDummyNode?: Boolean },
) {
  const numInputs = Object.entries(data.inputs).length;
  const numOutputs = Object.entries(data.outputs).length;

  return (
    <>
      {
        Object.entries(data.inputs).map(([key], index) => {
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
        {data.nodeTypeId}
      </div>
      {
        Object.entries(data.outputs).map(([key], index) => {
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
