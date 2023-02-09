import React from 'react';
import { Edge, Node } from 'reactflow';
import { cxx } from '../cxx';
import { BlockNodeData } from './BlockNode';
import { labelToVertexKind, Vertex } from '../vertex';

type ToolbarProps = {
  nodes: Array<Node<BlockNodeData>>,
  edges: Array<Edge>,
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setModalText: React.Dispatch<React.SetStateAction<string>>,
};

export default function Toolbar({
  nodes, edges, setModalIsOpen, setModalText,
} : ToolbarProps) {
  const vertices: Record<string, Vertex> = {};

  nodes.forEach((node) => {
    vertices[node.id] = {
      kind: labelToVertexKind(node.data.label),
      predecessors: {},
    };
  });

  edges.forEach((edge) => {
    if (edge.targetHandle && edge.sourceHandle) {
      vertices[edge.target].predecessors[edge.targetHandle] = {
        id: edge.source,
        output: edge.sourceHandle,
      };
    }
  });

  return (
    <div className="Toolbar">
      <button type="button" className="toolbar">Save</button>
      <button type="button" className="toolbar">Load</button>
      <button type="button" className="toolbar" onClick={() => { setModalText(cxx.compile(vertices)); setModalIsOpen(true); }}>Compile</button>
    </div>
  );
}
