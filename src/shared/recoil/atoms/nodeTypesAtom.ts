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
    code: {
      init: 'self.led = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_DOWN)',
      update: 'return True if self.led.value() else False',
      isQuery: true,
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
    description: 'Logical AND requires all inputs to be true to output true',
    attributes: {},
    code: {
      init: 'self.left = False\nself.right = False',
      update: 'if input == "1":\n\tself.left = value\nelif input == "2":\n\tself.right = value\nreturn True if self.left and self.right else False',
      isQuery: false,
    },
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
  Or: {
    description: 'Logical OR, requires one of the inputs to be true.',
    attributes: {},
    code: {
      init: 'self.left = False\nself.right = False',
      update: 'if input == "1":\n\tself.left = value\nelif input == "2":\n\tself.right = value\nreturn True if self.left or self.right else False',
      isQuery: false,
    },
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
  Add: {
    description: 'add 2 numbers together',
    attributes: {},
    code: {
      init: 'self.left = 0\nself.right = 0',
      update: 'return self.right+self.left',
      isQuery: false,
    },
    inputs: {
      1: {
        name: 'left',
        type: ConnectionType.Number,
      },
      2: {
        name: 'right',
        type: ConnectionType.Number,

      },
    },
    outputs: {
      1: {
        name: 'output',
        type: ConnectionType.Number,
      },
    },
  },
  LED: {
    description: 'LED output',
    attributes: {
      'Pin Num': { type: AttributeTypes.PinOutNum },
    },
    code: {
      init: 'self.led = machine.Pin(25, machine.Pin.OUT)',
      update: 'self.led.value(1 if value else 0)',
      isQuery: false,
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
