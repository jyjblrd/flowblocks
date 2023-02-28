import React, { useCallback } from 'react';
import { number } from 'prop-types';
import { ReactFlowInstance ,useReactFlow} from 'reactflow';
import { NodeInstance } from '../interfaces/NodeInstance.interface';
import { AttributeTypes, Attributes } from '../interfaces/NodeTypes.interface';

// TODO: delete this function !!!!
function jsNodeTypeIdToVertexKind(nodeTypeId: string) {
  return nodeTypeId;
  // TODO: remove all instances of the function
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

let availiblePins = new Map<string, number[]>([
  ["dig", [0,1,2,3,4,,6,7]],
  ["an", [8,9,10]]
]);
var nameNumber:number=0;
export var used: number[]=[];

function nextUnused(toUse:number[],used:number[]){
  for (var i in toUse){
    if (used.indexOf(toUse[i])==-1){return toUse[i];}
  }
  //throw new error("")
}

export function attributeGenerator(attributeType: AttributeTypes,nodeType:string): string {
  switch (attributeType) {
    case AttributeTypes.digitalIn:
      var out:number=0;
      out= nextUnused(availiblePins.get("dig"),used);
      used.push(out);
      return out as unknown as string;
    case AttributeTypes.digitalOut:
      var out:number=0;
      out= nextUnused(availiblePins.get("dig"),used);
      used.push(out);
      return out as unknown as string;
    case AttributeTypes.name:
      nameNumber=nameNumber+1;
      var name:string=nodeType;
      name=name.concat(" ");
      name=name.concat(nameNumber as string);
      return name;
    default:
      return 'error';
  }
}

function saveToLocal(exportObj: Object, exportName: string | null) {
  console.log('saveToLocal');
  localStorage.setItem(exportName ?? 'default', JSON.stringify(exportObj));
}

function loadFromLocal(exportName: string) {
  console.log('loadFromLocal');
  const load = localStorage.getItem(exportName);
  if (load) {
    return JSON.parse(load);
  } else {
    alert('No saved flowchart found of this name');
    return null;
  }
}

export function saveFlowInstance(reactFlowInstance: ReactFlowInstance, name: string): void {
  /* var obj = reactFlowInstance.toObject();
  var json = JSON.stringify(obj);
  var exportData = "data:text/json;charset=utf-8," + json;
  var blob = new Blob([json], {type: "application/json"});
  var newWindow = window.open(encodeURI(exportData));
  */
  // downloadObjectAsJson(reactFlowInstance.toObject(), 'flowchart');
  saveToLocal(reactFlowInstance.toObject(), name);
}

export function loadFlowInstance(reactFlowInstance: ReactFlowInstance, exportName: string): void {
  const loaded = loadFromLocal(exportName);
  reactFlowInstance.setNodes(loaded.nodes);
  reactFlowInstance.setEdges(loaded.edges);
}

function downloadObjectAsJson(exportObj: Object, exportName: string) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObj))}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', `${exportName}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
var nodesList;

function isUseablePin(pin:number,type:String):boolean{
  return availiblePins.get(type).includes(pin);
}
export function setNodesList(nodes:any){nodesList=nodes}
function compileCircuitHelper(){
  
  var out="";
  for (let key of nodesList.keys()){
    var node=nodesList[key];
    var type=(node.data.nodeTypeId);
    //console.log(node);

    if (type=="Button" && isUseablePin(parseInt(node.data.attributes.pin_num),"dig")){
      out=out.concat("connect a wire from pin ");
      out=out.concat(node.data.attributes.pin_num);
      out=out.concat(" to the button, ");
      out=out.concat(node.data.attributes.blockName);
      out=out.concat(" then to .......\n"); 
    }
    if(type=="LED" && isUseablePin(parseInt(node.data.attributes.pin_num),"dig")){
      out=out.concat("connect a wire from pin ");
      out=out.concat(node.data.attributes.pin_num);
      out=out.concat(" to the LED, ");
      out=out.concat(node.data.attributes.blockName);
      out=out.concat(" then to a resistor, then connect that resistor to ground.\n");    }

    }
  
  return out;
};
export function compileCircuit(){console.log(compileCircuitHelper());}