import { atom } from 'recoil';
import { NodeTypes, ConnectionType, NodeTypeData } from '../../interfaces/NodeTypes.interface';

const defaultNodeTypes: NodeTypes = {
  Button: {
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
  And: {
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
  LED: {
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

export const nodeTypesAtom = atom<Record<string, NodeTypeData>>({
  key: 'nodeTypes',
  default: defaultNodeTypes,
});

export default nodeTypesAtom;
