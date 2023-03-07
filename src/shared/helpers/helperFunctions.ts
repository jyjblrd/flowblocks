import { ReactFlowInstance, Node } from 'reactflow';
import { SetterOrUpdater } from 'recoil';
import { NodeInstance } from '../interfaces/NodeInstance.interface';
import {
  AttributeTypes, NodeTypeData,
} from '../interfaces/NodeTypes.interface';

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

const availablePins = {
  dig: ['0', '1', '2', '3', '4', '5', '6', '7'],
  an: ['8', '9', '10'],
};

export const used: number[] = [];

function nextUnused(toUse: number[]) {
  return toUse.find((pin) => !used.includes(pin));
}

export function attributeGenerator(attributeType: AttributeTypes): string {
  switch (attributeType) {
    case AttributeTypes.DigitalIn:
    case AttributeTypes.DigitalOut: {
      const out: number | undefined = nextUnused(availablePins.dig.map((digit) => +digit));
      if (out === undefined) {
        return 'error';
      }
      used.push(out);
      return String(out);
    }
    case AttributeTypes.Bool:
      return 'True';
    case AttributeTypes.Number:
      return '0';
    default:
      return 'error';
  }
}

let nameNumber: number = 0;
export function blockNameGenerator(nodeType: string): string {
  nameNumber += 1;
  let name: string = nodeType;
  name = name.concat(' ');
  name = name.concat(String(nameNumber));
  return name;
}

export function saveFlowInstance(
  reactFlowInstance: ReactFlowInstance,
  nodeTypes: Object,
  exportName: string,
): void {
  console.log(`saveToLocal: ${exportName}`);
  const flowObjStr = JSON.stringify(reactFlowInstance.toObject());
  const nodeTypesStr = JSON.stringify(nodeTypes);
  const exportStr = JSON.stringify({ flow: flowObjStr, nodes: nodeTypesStr });
  localStorage.setItem(exportName ?? 'default', exportStr);
}

export function loadFlowInstance(
  reactFlowInstance: ReactFlowInstance,
  setNodeTypes: SetterOrUpdater<Record<string, NodeTypeData>>,
  exportName: string,
): void {
  console.log('loadFromLocal');
  const load = localStorage.getItem(exportName);
  if (!load) {
    alert('File loading error occured');
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
  for (let i = 0; i < localStorage.length; i += 1) {
    keys.push(localStorage.key(i) ?? '');
  }
  return keys;
}

export function ppKnownCharts(): string[] {
  const charts = knownLocalCharts().sort();
  return charts;// .join('\n');
}

export function getDeleteFlowInstance(exportName: string): string[] {
  localStorage.removeItem(exportName);
  return knownLocalCharts();
}
/*
function downloadObjectAsJson(exportObj: Object, exportName: string) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObj))}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', `${exportName}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
*/

function isUseablePin(pin: number, type: keyof typeof availablePins): boolean {
  return !availablePins[type].includes(pin);
}

function compileCircuitHelper(nodesList: Node<NodeInstance>[], setNodeData) {
  const usedPins = new Map<String, String>();
  let out = '';

  // nodesList.keys().foreach((key) => {
  for (const key of nodesList.keys()) {
    const node = nodesList[key];
    const type = (node.data.nodeTypeId);
    const pins = new Map<String, String>();
    const { attributes } = node.data;
    for (const attribute in attributes) { // first go through all attributes and collect dictionary of ones which are pins to check
      const attributeType = setNodeData[type].attributes[attribute].type;
      if (attributeType === 0 || attributeType === 1) {
        const pin = node.data.attributes[attribute];
        pins.set(attribute, pin);
        if (usedPins.get(pin) != undefined) {
          out = 'It looks like ';
          out = out.concat(pinUsedBy);
          out = out.concat(' and ');
          out = out.concat(node.data.blockName ?? '');
          out = out.concat(' use the same pin this is not allowed.');
          return out;
        }
        usedPins.set(pin, node.data.blockName ?? '');
      }
    }
    if (type == 'Button') {
      if (isUseablePin((pins.get('pin_num')), 'dig')) {
        out = 'failed on button ';
        out = out.concat(node.data.blockName ?? '');
        out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
        return out;
      }
      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get('pin_num'));
      out = out.concat(' to the button, ');
      out = out.concat(node.data.blockName ?? '');
      out = out.concat(' then to the 3.3v power\n');
    } else if (type == 'LED') {
      console.log(pins.get("pin_num"))
      if (isUseablePin((pins.get('pin_num')), 'dig') && node.data.attributes.pin_num != '25') {
        out = 'failed on LED ';
        out = out.concat(node.data.blockName ?? '');
        out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
        return out;
      }
      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get('pin_num'));
      out = out.concat(' to the LED, ');
      out = out.concat(node.data.blockName ?? '');
      out = out.concat(' then to a resistor, then connect that resistor to ground on the pico.\n');
    } else if (type == 'SevenSegmentDisplay') {
      console.log(pins);
      for (const pin of pins.keys()) {
        if (isUseablePin((pins.get(pin)), 'dig') && node.data.attributes.pin_num != '25') {
          out = 'failed on seven segment display ';
          out = out.concat(node.data.blockName ?? '');
          out = out.concat(' on pin ');
          out = out.concat(pin);
          out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
          return out;
        }
      }
      out = out.concat('\nconnect a wire from pin ');
      out = out.concat(pins.get('pin_num_a'));
      out = out.concat(' to the top horizontal segment of the display\n');

      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get('pin_num_b'));
      out = out.concat(' to the top right segment of the display\n');

      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get('pin_num_c'));
      out = out.concat(' to the bottom right segment of the display\n');

      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get('pin_num_d'));
      out = out.concat(' to the bottom horizontal segment of the display\n');

      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get('pin_num_e'));
      out = out.concat(' to the bottom left segment of the display\n');

      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get('pin_num_f'));
      out = out.concat(' to the top left segment of the display\n');

      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get('pin_num_g'));
      out = out.concat(' to the middle horizontal segment of the display\n');
      out = out.concat('then connect the ground to a 75-220 ohm resistor then to ground on the pico.\n\n');
    } else if (type == 'Buzzer') {
      if (isUseablePin((pins.get('pin_num')), 'dig')) {
        out = 'failed on buzzer ';
        out = out.concat(node.data.blockName ?? '');
        out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
        return out;
      }
      out = out.concat('connect a wire from pin ');
      out = out.concat(pins.get('pin_num'));
      out = out.concat(' to the buzzer, ');
      out = out.concat(node.data.blockName ?? '');
      out = out.concat(' then to the ground on the pico\n');
    } else if (pins.size !== 0) {
      for (const pin of pins.keys()) {
        if (isUseablePin((pins.get(pin)), 'dig') && node.data.attributes.pin_num != '25') {
          out = 'failed on  ';
          out = out;
          out = out.concat(node.data.blockName ?? '');
          out = out.concat(' on pin ');
          out = out.concat(pin);
          out = out.concat('. It looks like you are using the wrong type of pin. You should use a digital in/out pin');
          return out;
        }
        out = out.concat('connect pin ');
        out = out.concat(pins.get(pin));
        out = out.concat(' to ');
        out = out.concat(pin);
        out = out.concat(' on ');
        out = out.concat(type);
        out = out.concat('\n');
      }
    }
  }

  return out;
}
export function compileCircuit(nodesList: Node<NodeInstance>[], setNodeData) {
  let out: String = (compileCircuitHelper(nodesList, setNodeData));
  out = out.concat('\n find a pin diagram of a pico at :\nhttps://datasheets.raspberrypi.com/pico/Pico-R3-A4-Pinout.pdf');
  alert(out);
}
