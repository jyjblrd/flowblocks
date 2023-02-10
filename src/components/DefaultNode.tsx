import React from 'react';
import {
  Handle, NodeProps, Position,
} from 'reactflow';
import { NodeTypeData } from '../shared/interfaces/NodeTypes.interface';

export default function DefaultNode({ id, data }: NodeProps<NodeTypeData>) {
  const numInputs = Object.entries(data.inputs).length;
  const numOutputs = Object.entries(data.outputs).length;

  return (
    <>
      {
        Object.entries(data.inputs).map(([key], index) => (
          <Handle
            type="target"
            position={Position.Left}
            id={key}
            key={key}
            style={{ top: `${(100 / (numInputs + 1)) * (index + 1)}%` }}
          />
        ))
      }
      <div style={{
        padding: '16px', backgroundColor: 'white', border: '2px solid grey', borderRadius: '10px',
      }}
      >
        {id}
      </div>
      {
        Object.entries(data.outputs).map(([key], index) => (
          <Handle
            type="source"
            position={Position.Right}
            id={key}
            key={key}
            style={{ top: `${(100 / (numOutputs + 1)) * (index + 1)}%` }}
          />
        ))
      }
    </>
  );
}
