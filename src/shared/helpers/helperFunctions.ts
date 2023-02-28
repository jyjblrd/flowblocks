import React, { useCallback } from 'react';
import { number } from 'prop-types';
import { ReactFlowInstance, useReactFlow } from 'reactflow';
import { NodeInstance } from '../interfaces/NodeInstance.interface';
import { AttributeTypes, Attributes } from '../interfaces/NodeTypes.interface';
import { nodeTypesAtom } from '../recoil/atoms/nodeTypesAtom';
import { NodeTypes, NodeTypeData } from '../interfaces/NodeTypes.interface';
import { RecoilState, SetterOrUpdater, useRecoilState } from 'recoil';

export default function flowchartToJSON(
  reactFlowInstance: ReactFlowInstance,
): Record<string, NodeInstance> {
  const nodes = reactFlowInstance.getNodes();
  const edges = reactFlowInstance.getEdges();

  const project: Record<string, NodeInstance> = {};

  nodes.forEach((node) => {
    project[node.id] = JSON.parse(JSON.stringify(node.data));
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

const availablePins = new Map<string, string[]>([
  ['dig', ['0', '1', '2', '3', '4', '6', '7']],
  ['an', ['8', '9', '10']],
]);
let nameNumber:number = 0;
export var used: number[] = [];

function nextUnused(toUse:number[], used:number[]) {
  for (const i in toUse) {
    if (used.indexOf(toUse[i]) == -1) { return toUse[i]; }
  }
  // throw new error("")
}

export function attributeGenerator(attributeType: AttributeTypes, nodeType:string): string {
  switch (attributeType) {
    case AttributeTypes.DigitalIn:
      var out: number = 0;
      out = nextUnused(availablePins.get('dig'), used);
      used.push(out);
      return out as unknown as string;
    case AttributeTypes.DigitalOut:
      var out: number = 0;
      out = nextUnused(availablePins.get('dig'), used);
      used.push(out);
      return out as unknown as string;
    case AttributeTypes.BlockName:
      nameNumber += 1;
      var name: string = nodeType;
      name = name.concat(' ');
      name = name.concat(nameNumber as string);
      return name;
    case AttributeTypes.Bool:
      return 'true';
    case AttributeTypes.Number:
      return '0';
    default:
      return 'error';
  }
}

export function saveFlowInstance(reactFlowInstance: ReactFlowInstance, nodeTypes: Object, exportName: string): void {

  console.log(`saveToLocal: ${exportName}`);
  const flowObjStr = JSON.stringify(reactFlowInstance.toObject());
  const nodeTypesStr = JSON.stringify(nodeTypes);
  const exportStr = JSON.stringify({"flow" : flowObjStr, "nodes" : nodeTypesStr });
  localStorage.setItem(exportName ?? 'default', exportStr);

}

export function loadFlowInstance(reactFlowInstance: ReactFlowInstance, setNodeTypes: SetterOrUpdater<Record<string, NodeTypeData>>, exportName: string): void {
  console.log('loadFromLocal');
  const load = localStorage.getItem(exportName);
  if (!load) {
    alert('No saved flowchart found of this name');
    return;
  } 

  const loaded = JSON.parse(load);
  const flow = JSON.parse(loaded.flow);
  const nodes = JSON.parse(loaded.nodes);

  reactFlowInstance.setNodes(flow.nodes);
  reactFlowInstance.setEdges(flow.edges);

  setNodeTypes(nodes);

}

function knownLocalCharts(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i) ?? '');
  }
  return keys;
}

export function ppKnownCharts(): string {
  const charts = knownLocalCharts();
  return charts.join('\n');
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

function isUseablePin(pin:number, type:String):boolean {
  return !availablePins.get(type).includes(pin);
}

function compileCircuitHelper(nodesList) {
  const usedPins = new Map<String, String>();
  let out = '';
  // nodesList.keys().foreach((key) => {
  for (const key of nodesList.keys()) {
    const node = nodesList[key];
    const type = (node.data.nodeTypeId);
    const pin = (node.data.attributes.pin_num);
    if (pin != undefined) {
      console.log(typeof (pin), usedPins.get(pin), usedPins);
      if (usedPins.get(pin) != undefined) {
        out = 'It looks like ';
        out = out.concat(usedPins.get(pin));
        out = out.concat(' and ');
        out = out.concat(node.data.attributes.blockName);
        out = out.concat(' use the same pin this is not allowed.');
        return out;
      }
      usedPins.set(pin, node.data.attributes.blockName);
    }
    if (type == 'Button') {
      if (isUseablePin((node.data.attributes.pin_num), 'dig')) {
        out = 'failed on button ';
        out = out.concat(node.data.attributes.blockName);
        out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
        return out;
      }
      out = out.concat('connect a wire from pin ');
      out = out.concat(node.data.attributes.pin_num);
      out = out.concat(' to the button, ');
      out = out.concat(node.data.attributes.blockName);
      out = out.concat(' then to .......\n');
    }
    if (type == 'LED') {
      if (isUseablePin((node.data.attributes.pin_num), 'dig')) {
        out = 'failed on LED ';
        out = out.concat(node.data.attributes.blockName);
        out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
        return out;
      }
      out = out.concat('connect a wire from pin ');
      out = out.concat(node.data.attributes.pin_num);
      out = out.concat(' to the LED, ');
      out = out.concat(node.data.attributes.blockName);
      out = out.concat(' then to a resistor, then connect that resistor to ground.\n');
    }
  }

  return out;
}
export function compileCircuit(nodesList) { console.log(compileCircuitHelper(nodesList)); }
