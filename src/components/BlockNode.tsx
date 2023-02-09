import React, {
  useEffect, useState,
} from 'react';
import {
  Handle, NodeProps, Position, useStore, useUpdateNodeInternals,
} from 'reactflow';
import { NodeTypeData } from '../shared/interfaces/Node.interface';

export default function BlockNode({ id, data }: NodeProps<NodeTypeData>) {
  const size = useStore((s) => {
    const node = s.nodeInternals.get(id);
    return {
      width: node?.width ?? 0,
      height: node?.height ?? 0,
    };
  });

  const [inputs, ,] = useState(data.inputs);
  const [outputs, ,] = useState(data.outputs);

  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => {
    updateNodeInternals(id);
  }, [outputs, inputs]);

  return (
    <>
      {
        Object.entries(inputs).map(([key], index) => <Handle type="target" position={Position.Left} id={key} key={key} style={{ top: (index + 0.5) * (size.height / Object.values(inputs).length) }} />)
      }
      <div className="BlockNode">
        {data.name}
      </div>
      {
        Object.entries(outputs).map(([key], index) => <Handle type="source" position={Position.Right} id={key} key={key} style={{ top: (index + 0.5) * (size.height / Object.values(outputs).length) }} />)
      }
    </>
  );
}
