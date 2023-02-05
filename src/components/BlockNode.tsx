import React, {
  useEffect, useState,
} from 'react';
import {
  Handle, NodeProps, Position, useStore, useUpdateNodeInternals,
} from 'reactflow';

export type BlockNodeData = {
  label: string,
  targets: Array<string>,
  sources: Array<string>,
};

export default function BlockNode({ id, data }: NodeProps<BlockNodeData>) {
  const size = useStore((s) => {
    const node = s.nodeInternals.get(id);
    return {
      width: node?.width ?? 0,
      height: node?.height ?? 0,
    };
  });

  const [targets, ,] = useState(data.targets);
  const [sources, ,] = useState(data.sources);

  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => {
    updateNodeInternals(id);
  }, [sources, targets]);

  return (
    <>
      {
        targets.map((targetID, index) => <Handle type="target" position={Position.Left} id={targetID} key={targetID} style={{ top: (index + 0.5) * (size.height / targets.length) }} />)
      }
      <div className="BlockNode">
        {data.label}
      </div>
      {
        sources.map((sourceID, index) => <Handle type="source" position={Position.Right} id={sourceID} key={sourceID} style={{ top: (index + 0.5) * (size.height / sources.length) }} />)
      }
    </>
  );
}
