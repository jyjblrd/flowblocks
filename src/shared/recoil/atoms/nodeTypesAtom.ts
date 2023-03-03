import { atom } from 'recoil';
import {
  NodeTypes, ConnectionType, NodeTypeData, AttributeTypes,
} from '../../interfaces/NodeTypes.interface';

const defaultNodeTypes: NodeTypes = {
  Button: {
    description: 'Physical button input',

    attributes: {
      pin_num: {type: AttributeTypes.DigitalIn},
      blockName: {type: AttributeTypes.BlockName},
    },
    code: {
      init: 'self.led = machine.Pin({{ pin_num }}, machine.Pin.IN, machine.Pin.PULL_DOWN)',
      update: '{{output}} = self.led.value()',
      isQuery: true,
    },
    inputs: {},
    outputs: {
      0: {
        name: 'output',
        type: ConnectionType.Bool,
      },
    },
  },
  And: {
    description: 'Logical AND requires all inputs to be true to output true',
    attributes: {},
    code: {
      init: '',
      update: '{{output}} = {{left}} and {{right}}',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'left',
        type: ConnectionType.Bool,
      },
      1: {
        name: 'right',
        type: ConnectionType.Bool,

      },
    },
    outputs: {
      0: {
        name: 'output',
        type: ConnectionType.Bool,
      },
    },
  },
  Or: {
    description: 'Logical OR, requires one of the inputs to be true.',
    attributes: {},
    code: {
      init: '',
      update: '{{output}} = {{left}} or {{right}}',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'left',
        type: ConnectionType.Bool,
      },
      1: {
        name: 'right',
        type: ConnectionType.Bool,

      },
    },
    outputs: {
      0: {
        name: 'output',
        type: ConnectionType.Bool,
      },
    },
  },
  Add: {
    description: 'Add 2 numbers together.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} + {{ right }}',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'left',
        type: ConnectionType.Number,
      },
      1: {
        name: 'right',
        type: ConnectionType.Number,

      },
    },
    outputs: {
      0: {
        name: 'output',
        type: ConnectionType.Number,
      },
    },
  },
  IntegerConstant: {
    description: 'Provides an integer constant. Used for testing attributes',
    attributes: {
      'Constant Value': { type: AttributeTypes.Number },
    },
    code: {
      init: '',
      update: '{{ value }} = {{ Constant Value }}',
      isQuery: false,
    },
    inputs: {},
    outputs: {
      0: {
        name: 'value',
        type: ConnectionType.Number,
      },
    },
  },
  DbgPrintInt: {
    description: 'Prints an int. Used for test model of execution',
    attributes: {},
    code: {
      init: '',
      update: 'print({{ value }})',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'value',
        type: ConnectionType.Number,
      },
    },
    outputs: {},
  },
  LED: {
    description: 'LED output',
    attributes: {
      pin_num: {type: AttributeTypes.DigitalOut},
      blockName: {type: AttributeTypes.BlockName},
    },
    code: {
      init: 'self.led = machine.Pin({{ pin_num }}, machine.Pin.OUT)',
      update: 'self.led.value({{ input }})',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'input',
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
