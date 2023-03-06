import React, { useCallback } from 'react';
import { number } from 'prop-types';
import { ReactFlowInstance, useReactFlow } from 'reactflow';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { NodeInstance } from '../interfaces/NodeInstance.interface';
import { AttributeTypes, Attributes } from '../interfaces/NodeTypes.interface';
import { nodeEditorModalAtom } from '../recoil/atoms/nodeEditorModal';
import { nodeTypesAtom } from '../recoil/atoms/nodeTypesAtom';

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

const availablePins = new Map<string, string[]>([
  ['dig', ['0', '1', '2', '3', '4', '6', '7','8']],
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
  //console.log(attributeType);
  switch (attributeType) {
    case 0:// AttributeTypes.digitalIn:
      var out:number = 0;
      out = nextUnused(availablePins.get('dig'), used);
      used.push(out);
      return out as unknown as string;
    case 1:// AttributeTypes.digitalOut:
      var out:number = 0;
      out = nextUnused(availablePins.get('dig'), used);
      used.push(out);
      return out as unknown as string;
    case 6:// AttributeTypes.name:
      nameNumber += 1;
      var name:string = nodeType;
      name = name.concat(' ');
      name = name.concat(nameNumber as string);
      return name;
    case 4:// AttributeTypes.Bool:
      return 'True';
    case 5:// AttributeTypes.Number:
      return '0';
    default:
      return 'error';
  }
}

function saveToLocal(exportObj: Object, exportName: string | null) {
  console.log(`saveToLocal: ${exportName}`);
  localStorage.setItem(exportName ?? 'default', JSON.stringify(exportObj));
}

function loadFromLocal(exportName: string) {
  console.log('loadFromLocal');
  const load = localStorage.getItem(exportName);
  if (!load) {
    alert('File loading error occured');
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

export function getDeleteFlowInstance(exportName: string): string[] {
  localStorage.removeItem(exportName);
  return knownLocalCharts();
}

function knownLocalCharts(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i) ?? '');
  }
  return keys;
}

export function ppKnownCharts(): string[] {
  const charts = knownLocalCharts().sort();
  return charts;// .join('\n');
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
//const setNodeData = useRecoilValue(nodeTypesAtom);

function compileCircuitHelper(nodesList,setNodeData) {
  const usedPins = new Map<String, String>();
  let out = '';

  // nodesList.keys().foreach((key) => {
  for (const key of nodesList.keys()) {
    const node = nodesList[key];
    const type = (node.data.nodeTypeId);
    let pins=new Map<String,String>;
    let attributes=(node.data.attributes);
    for (const attribute in attributes){//first go through all attributes and collect dictionary of ones whichare pins to check
      let attributeType=setNodeData[type].attributes[attribute].type;
      if (attributeType===0 || attributeType===1) {
        const pin=node.data.attributes[attribute];
        pins.set(attribute,pin);
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
    }
    if (type == 'Button') {
      if (isUseablePin((pins.get("pin_num")), 'dig')) {
        out = 'failed on button ';
        out = out.concat(node.data.attributes.blockName);
        out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
        return out;
      }
      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get("pin_num"));
      out = out.concat(' to the button, ');
      out = out.concat(node.data.attributes.blockName);
      out = out.concat(' then to the 3.3v power\n');
    }
    if (type == 'LED') {
      if (isUseablePin((pins.get("pin_num")), 'dig') && node.data.attributes.pin_num != '25') {
        out = 'failed on LED ';
        out = out.concat(node.data.attributes.blockName);
        out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
        return out;
      }
      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get("pin_num"));
      out = out.concat(' to the LED, ');
      out = out.concat(node.data.attributes.blockName);
      out = out.concat(' then to a resistor, then connect that resistor to ground on the pico.\n');
    }
    if (type=="SevenSegmentDisplay"){
      console.log(pins)
      for(const pin of pins.keys()){
        if (isUseablePin((pins.get(pin)), 'dig') && node.data.attributes.pin_num != '25') {
          out = 'failed on seven segment display ';
          out = out.concat(node.data.attributes.blockName);
          out=out.concat(" on pin ")
          out=out.concat(pin)
          out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
          return out;
        }
      }
      out=out.concat("\nconnect a wire from pin ")
      out=out.concat(pins.get("pin_num_a"))
      out =out.concat(" to the top horizontal segment of the display\n")

      out=out.concat("connect a wire from pin ")
      out=out.concat(pins.get("pin_num_b"))
      out =out.concat(" to the top right segment of the display\n")

      out=out.concat("connect a wire from pin ")
      out=out.concat(pins.get("pin_num_c"))
      out =out.concat(" to the bottom right segment of the display\n")

      out=out.concat("connect a wire from pin ")
      out=out.concat(pins.get("pin_num_d"))
      out =out.concat(" to the bottom horizontal segment of the display\n")

      out=out.concat("connect a wire from pin ")
      out=out.concat(pins.get("pin_num_e"))
      out =out.concat(" to the bottom left segment of the display\n")

      out=out.concat("connect a wire from pin ")
      out=out.concat(pins.get("pin_num_f"))
      out =out.concat(" to the top left segment of the display\n")

      out=out.concat("connect a wire from pin ")
      out=out.concat(pins.get("pin_num_g"))
      out =out.concat(" to the middle horizontal segment of the display\n")
      out=out.concat("then connect the ground to a 75-220 ohm resistor then to ground on the pico.\n\n")
    }
    if (type == 'Buzzer') {
      if (isUseablePin((pins.get("pin_num")), 'dig')) {
        out = 'failed on buzzer ';
        out = out.concat(node.data.attributes.blockName);
        out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
        return out;
      }
      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get("pin_num"));
      out = out.concat(' to the buzzer, ');
      out = out.concat(node.data.attributes.blockName);
      out = out.concat(' then to the ground on the pico\n');
    }
  }


  return out;
}
export function compileCircuit(nodesList,setNodeData) {
  let out:String = (compileCircuitHelper(nodesList,setNodeData));
  out = out.concat('\n find a pin diagram of a pico at :\nhttps://datasheets.raspberrypi.com/pico/Pico-R3-A4-Pinout.pdf');
  alert(out);
}
