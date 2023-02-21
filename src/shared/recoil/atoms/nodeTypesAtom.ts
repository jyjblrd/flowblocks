import { atom } from 'recoil';
import {
  NodeTypes, ConnectionType, NodeTypeData, AttributeTypes,
} from '../../interfaces/NodeTypes.interface';

const defaultNodeTypes: NodeTypes = {
  Button: {
    description: 'Physical button input',
    attributes: {
      pin_num: {type: AttributeTypes.PinInNum},
    },
    code: {
      init: 'self.led = machine.Pin(pin_num, machine.Pin.IN, machine.Pin.PULL_DOWN)',
      update: 'output_value = True if self.led.value() else False',
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
      update: 'if input == "1":\n\tself.left = value\nelif input == "2":\n\tself.right = value\noutput_value = True if self.left and self.right else False',
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
      update: 'if input == "1":\n\tself.left = value\nelif input == "2":\n\tself.right = value\noutput_value = True if self.left or self.right else False',
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
  LED: {
    description: 'LED output',
    attributes: {
      pin_num: {type: AttributeTypes.PinOutNum},
    },
    code: {
      init: 'self.led = machine.Pin(pin_num, machine.Pin.OUT)',
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
