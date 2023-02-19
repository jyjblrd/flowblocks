import { ReactFlowInstance } from 'reactflow';
import { NodeInstance } from '../interfaces/NodeInstance.interface';
import { AttributeTypes } from '../interfaces/NodeTypes.interface';

// Pls fix the c++ side to not need this ugly conversion
function jsNodeTypeIdToVertexKind(nodeTypeId: string) {
  switch (nodeTypeId) {
    case 'Button':
      return 'Button';
    case 'And':
      return 'And';
    case 'LED':
      return 'LED';
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


export function saveFlowInstance(reactFlowInstance: ReactFlowInstance): void {
  /*var obj = reactFlowInstance.toObject();
  var json = JSON.stringify(obj);
  var exportData = "data:text/json;charset=utf-8," + json;
  var blob = new Blob([json], {type: "application/json"});
  var newWindow = window.open(encodeURI(exportData));
  */
  //downloadObjectAsJson(reactFlowInstance.toObject(), 'flowchart');
  saveToLocal(reactFlowInstance.toObject(), 'flowchart');
  return;
}

export function loadFlowInstance(reactFlowInstance: ReactFlowInstance, exportName: string): void {
  var loaded = loadFromLocal(exportName);
  reactFlowInstance.setNodes(loaded.nodes);
  reactFlowInstance.setEdges(loaded.edges);
}



function saveToLocal(exportObj: Object, exportName: string){
  console.log("saveToLocal");
  localStorage.setItem(exportName, JSON.stringify(exportObj));
}

function loadFromLocal(exportName: string){
  console.log("loadFromLocal");
  var load = localStorage.getItem(exportName);
  if (load) {
    return JSON.parse(load);
  } else {
    alert("No saved flowchart found of this name");
    return null;
  }
}

function downloadObjectAsJson(exportObj: Object, exportName: string){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

