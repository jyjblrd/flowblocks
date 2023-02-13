import { ReactFlowInstance } from 'reactflow';
import { NodeInstance } from '../interfaces/NodeInstance.interface';
import { AttributeTypes } from '../interfaces/NodeTypes.interface';

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
    project[node.id] = JSON.parse(JSON.stringify(node.data));

    // TODO: please make the c++ backend consistent so I can get rid of this
    project[node.id].nodeTypeId = jsNodeTypeIdToVertexKind(project[node.id].nodeTypeId);
  });

  // Populate node connections
  edges.forEach((edge) => {
    if (edge.targetHandle && edge.sourceHandle) {
      project[edge.target]
        .connections[edge.targetHandle] = {
          connectedNodeId: edge.source,
          connectedNodeOutputId: edge.sourceHandle,
        };
    }
  });

  console.log(JSON.stringify(project, null, 4));

  return project;
}

export function attributeGenerator(attributeType: AttributeTypes): string {
  switch (attributeType) {
    case AttributeTypes.PinInNum:
      return '14';
    case AttributeTypes.PinOutNum:
      return '25';
    default:
      return 'error';
  }
}
