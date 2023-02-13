import { atom } from 'recoil';
import {
  NodeTypes, ConnectionType, NodeTypeData, AttributeTypes,
} from '../../interfaces/NodeTypes.interface';

const defaultNodeTypes: NodeTypes = {
  Button: {
    description: 'Physical button input',
    attributes: {
      'Pin Num': { type: AttributeTypes.PinInNum },
    },
    inputs: {},
    outputs: {
      1: {
        name: 'output',
        type: ConnectionType.Bool,
      },
    },
  },
  And: {
    description: 'Logical AND',
    attributes: {},
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
  LED: {
    description: 'LED output',
    attributes: {
      'Pin Num': { type: AttributeTypes.PinOutNum },
    },
    inputs: {
      1: {
        name: 'left',
        type: ConnectionType.Bool,
      },
    },
    outputs: {},
  },
};

export const nodeTypesAtom = atom<Record<string, NodeTypeData>>({
  key: 'nodeTypes',
  default: defaultNodeTypes,
});

export default nodeTypesAtom;
