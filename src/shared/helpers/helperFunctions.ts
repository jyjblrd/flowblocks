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
  dig: [0, 1, 2, 3, 4, 5, 6, 7],
  an: [8, 9, 10],
};

let nameNumber: number = 0;
export const used: number[] = [];

function nextUnused(toUse: number[]) {
  return toUse.find((pin) => !used.includes(pin));
}

export function attributeGenerator(attributeType: AttributeTypes, nodeType: string): string {
  switch (attributeType) {
    case AttributeTypes.DigitalIn:
    case AttributeTypes.DigitalOut: {
      const out: number | undefined = nextUnused(availablePins.dig);
      if (out === undefined) {
        return 'error';
      }
      used.push(out);
      return String(out);
    }
    case AttributeTypes.BlockName: {
      nameNumber += 1;
      let name: string = nodeType;
      name = name.concat(' ');
      name = name.concat(String(nameNumber));
      return name;
    }
    case AttributeTypes.Bool:
      return 'true';
    case AttributeTypes.Number:
      return '0';
    default:
      return 'error';
  }
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

export function getDeleteFlowInstance(exportName: string): string[] {
  localStorage.removeItem(exportName);
  return knownLocalCharts();
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
  return charts;//.join('\n');
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

function compileCircuitHelper(nodesList: Node<NodeInstance>[]) {
  const usedPins = new Map<string, string>();
  let out = '';
  for (let i = 0; i < nodesList.length; i += 1) {
    const node = nodesList[i];
    const type = node.data.nodeTypeId;
    const pin = node.data.attributes.pin_num;
    if (pin !== undefined) {
      const pinUsedBy = usedPins.get(pin);
      console.log(typeof (pin), pinUsedBy, usedPins);
      if (pinUsedBy !== undefined) {
        out = 'It looks like ';
        out = out.concat(pinUsedBy);
        out = out.concat(' and ');
        out = out.concat(node.data.attributes.blockName);
        out = out.concat(' use the same pin this is not allowed.');
        return out;
      }
      usedPins.set(pin, node.data.attributes.blockName);
    }
    if (type === 'Button') {
      if (isUseablePin(parseInt(node.data.attributes.pin_num, 10), 'dig')) {
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
    if (type === 'LED') {
      if (isUseablePin(parseInt(node.data.attributes.pin_num, 10), 'dig')) {
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
export function compileCircuit(nodesList: Node<NodeInstance>[]) {
  console.log(compileCircuitHelper(nodesList));
}
