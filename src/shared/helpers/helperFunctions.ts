import { ReactFlowInstance } from 'reactflow';
import { NodeInstance } from '../interfaces/NodeInstance.interface';

// Pls fix the c++ side to not need this ugly conversion
function jsNodeTypeIdToVertexKind(nodeTypeId: string) {
  switch (nodeTypeId) {
    case 'Button':
      return 'DigitalPinInPullDown';
    case 'And':
      return 'Conjunction';
    case 'LED':
      return 'DigitalPinOut';
    default:
      return '';
  }
}

export default function flowchartToJSON(
  reactFlowInstance: ReactFlowInstance,
): Record<string, NodeInstance> {
  const nodes = reactFlowInstance.getNodes();
  const edges = reactFlowInstance.getEdges();

  const project: Record<string, NodeInstance> = {};

  nodes.forEach((node) => {
    project[node.id] = {
      node_id: jsNodeTypeIdToVertexKind(node.id),
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

  return project;
}
