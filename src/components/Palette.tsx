import React from 'react';
import { Node } from 'reactflow';
import { BlockNodeData } from './BlockNode';

enum BlockKind {
  Button,
  Conjunction,
  LED,
}

const blockKindInputs: Record<BlockKind, string[]> = {
  [BlockKind.Button]: [],
  [BlockKind.Conjunction]: ['left', 'right'],
  [BlockKind.LED]: ['input'],
};

const blockKindOutputs: Record<BlockKind, string[]> = {
  [BlockKind.Button]: ['output'],
  [BlockKind.Conjunction]: ['output'],
  [BlockKind.LED]: [],
};

export default function Palette({ setNodes }
: { setNodes: React.Dispatch<React.SetStateAction<Node[]>> }) {
  function insertNode(kind: BlockKind) {
    const newLabel = Math.random().toString();

    const newNodeData: BlockNodeData = {
      label: newLabel,
      sources: blockKindInputs[kind],
      targets: blockKindOutputs[kind],
    };

    const newNode = {
      type: 'block',
      id: newLabel,
      position: { x: 0, y: 0 },
      data: newNodeData,
    };
    setNodes((nodes) => nodes.concat([newNode]));
  }

  return (
    <div className="Palette">
      <button type="button" onClick={() => insertNode(BlockKind.Button)}>Button</button>
      <button type="button" onClick={() => insertNode(BlockKind.Conjunction)}>And</button>
      <button type="button" onClick={() => insertNode(BlockKind.LED)}>LED</button>
    </div>
  );
}
