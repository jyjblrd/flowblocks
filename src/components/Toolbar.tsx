import React from 'react';
import { Edge, Node } from 'reactflow';
import { cxx } from '../cxx';
import { NodeTypeData } from '../shared/interfaces/Node.interface';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';
import labelToVertexKind from '../shared/helpers/helperFunctions';

type ToolbarProps = {
  nodes: Array<Node<NodeTypeData>>,
  edges: Array<Edge>,
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setModalText: React.Dispatch<React.SetStateAction<string>>,
};

export default function Toolbar({
  nodes, edges, setModalIsOpen, setModalText,
} : ToolbarProps) {
  const project: Record<string, NodeInstance> = {};

  nodes.forEach((node) => {
    project[node.id] = {
      node_id: labelToVertexKind(node.data.name),
      connections: {},
    };
  });

  edges.forEach((edge) => {
    if (edge.targetHandle && edge.sourceHandle) {
      project[edge.target]
        .connections[edge.targetHandle] = {
          connected_node_id: edge.source,
          connected_node_output_id: edge.sourceHandle,
        };
    }
  });

  console.log(JSON.stringify(project, null, 4));

  return (
    <div className="Toolbar">
      <button type="button" className="toolbar">Save</button>
      <button type="button" className="toolbar">Load</button>
      <button type="button" className="toolbar" onClick={() => { setModalText(cxx.compile(project)); setModalIsOpen(true); }}>Compile</button>
    </div>
  );
}
