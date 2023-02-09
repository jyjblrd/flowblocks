export enum NodeId {
  Button,
  Conjunction,
  LED,
}

export type Attribute = Record<string, string>;

export enum ConnectionType {
  Bool,
  Number,
}

export type NodeTypeData = {
  name: string,
  description: string,
  attributes: Array<Attribute>,
  inputs: Record<number, { name: String, type: ConnectionType }>,
  outputs: Record<number, { name: String, type: ConnectionType }>,
};

export const nodeTypes: Record<NodeId, NodeTypeData> = {
  [NodeId.Button]: {
    name: 'Button',
    description: '',
    attributes: [],
    inputs: {},
    outputs: {
      1: {
        name: 'output',
        type: ConnectionType.Bool,
      },
    },
  },
  [NodeId.Conjunction]: {
    name: 'And',
    description: '',
    attributes: [],
    inputs: {
      1: {
        name: 'left',
        type: ConnectionType.Bool,
      },
      2: {
        name: 'right',
        type: ConnectionType.Bool,
      },
    },
    outputs: {
      1: {
        name: 'output',
        type: ConnectionType.Bool,
      },
    },
  },
  [NodeId.LED]: {
    name: 'LED',
    description: '',
    attributes: [],
    inputs: {
      1: {
        name: 'left',
        type: ConnectionType.Bool,
      },
    },
    outputs: {},
  },
};
