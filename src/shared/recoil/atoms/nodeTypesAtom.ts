import { atom } from 'recoil';
import {
  NodeTypes, ConnectionType, NodeTypeData, AttributeTypes,
} from '../../interfaces/NodeTypes.interface';

const defaultNodeTypes: NodeTypes = {
  Button: {
    description: 'Physical button input',

    attributes: {
      pin_num: { type: AttributeTypes.DigitalIn },
      blockName: { type: AttributeTypes.BlockName },
    },
    code: {
      init: 'import time\nself.time = time\nself.prev_change_time = 0\nself.led = machine.Pin({{ pin_num }}, machine.Pin.IN, machine.Pin.PULL_DOWN)',
      update: 'if (self.time.ticks_ms() - self.prev_change_time > 100):\n\t{{output}} = self.led.value()\n\tself.prev_change_time = self.time.ticks_ms(){{output}} = self.led.value()',
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
  Not: {
    description: 'Logical NOT inverts input (true becomes false, false becomes true)',
    attributes: {},
    code: {
      init: '',
      update: '{{output}} = not {{inp}}',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'inp',
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
  BoolConstant: {
    description: 'Provides an boolean constant. Used for testing attributes',
    attributes: {
      'Constant Value': { type: AttributeTypes.Bool },
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
        type: ConnectionType.Bool,
      },
    },
  },
  PrintNumber: {
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
      pin_num: { type: AttributeTypes.DigitalOut },
      blockName: { type: AttributeTypes.BlockName },
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
  Counter: {
    description: 'Increments a counter when triggered, resetting when reset is triggered',
    attributes: {},
    code: {
      init: '{{ output }} = 0',
      update: 'if {{ reset }}:\n\t{{ output }} = 0\nelif {{ incr }}:\n\t{{ output }} += 1',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'incr',
        type: ConnectionType.Bool,
      },
      1: {
        name: 'reset',
        type: ConnectionType.Bool,

      },
    },
    outputs: {
      0: {
        name: 'output',
        type: ConnectionType.Number,
      },
    },
  },
  Xor: {
    description: 'Xor 2 numbers together.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} ^ {{ right }}',
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
  Multiply: {
    description: 'Multiply 2 numbers together.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} * {{ right }}',
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
  Divide: {
    description: 'Divide left input by right input TODO: Div by zero.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} // {{ right }}',
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
  Subtract: {
    description: 'Subtract right number from left.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} - {{ right }}',
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
  Modulo: {
    description: 'Modulo left input by right input.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} % {{ right }}',
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
  Equals: {
    description: 'Check if 2 numbers are equal.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} == {{ right }}',
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
        type: ConnectionType.Bool,
      },
    },
  },
  GreaterThan: {
    description: 'Check if left input is greater than right input.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} > {{ right }}',
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
        type: ConnectionType.Bool,
      },
    },
  },
  LessThan: {
    description: 'Check if left input is less than right input.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} < {{ right }}',
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
        type: ConnectionType.Bool,
      },
    },
  },
  GreaterThanEquals: {
    description: 'Check if left input is greater than or equal to right input.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} >= {{ right }}',
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
        type: ConnectionType.Bool,
      },
    },
  },
  LessThanEquals: {
    description: 'Check if left input is less than or equal to right input.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} <= {{ right }}',
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
        type: ConnectionType.Bool,
      },
    },
  },
  NotEquals: {
    description: 'Check if 2 numbers are not equal.',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} != {{ right }}',
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
        type: ConnectionType.Bool,
      },
    },
  },
  PickInputBool: {
    description: 'Pick one of two boolean inputs to output (True for left, False for right)',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} if {{ choice }} else {{ right }}',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'choice',
        type: ConnectionType.Bool,
      },
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
      0: {
        name: 'output',
        type: ConnectionType.Bool,
      },
    },
  },
  PickInputNum: {
    description: 'Pick one of two numerical inputs to output (True for left, False for right)',
    attributes: {},
    code: {
      init: '',
      update: '{{ output }} = {{ left }} if {{ choice }} else {{ right }}',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'choice',
        type: ConnectionType.Bool,
      },
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
      0: {
        name: 'output',
        type: ConnectionType.Number,
      },
    },
  },
  Monostable: {
    description: 'Output True for a single frame when input is True.',
    attributes: {},
    code: {
      init: 'self.prev_input = False',
      update: '{{ output }} = {{ input }} and not self.prev_input\nself.prev_input = {{ input }}',
      // TODO: fix execution model so this isn't always updated?
      isQuery: true,
    },
    inputs: {
      0: {
        name: 'input',
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
  FlipFlop: {
    description: 'Flips output value whenever input becomes True.',
    attributes: {},
    code: {
      init: '',
      update: 'if {{ input }} == 1:\n\t{{ output }} = not {{ output }}',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'input',
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
  SevenSegmentDisplay: {
    description: 'Convert number input (mod 10) into 7 outputs for a 7 segment display.',
    attributes: {
      blockName: { type: AttributeTypes.BlockName },
      pin_num_a: { type: AttributeTypes.DigitalOut },
      pin_num_b: { type: AttributeTypes.DigitalOut },
      pin_num_c: { type: AttributeTypes.DigitalOut },
      pin_num_d: { type: AttributeTypes.DigitalOut },
      pin_num_e: { type: AttributeTypes.DigitalOut },
      pin_num_f: { type: AttributeTypes.DigitalOut },
      pin_num_g: { type: AttributeTypes.DigitalOut },
    },
    code: {
      init: 'self.led_a = machine.Pin({{ pin_num_a }}, machine.Pin.OUT)\nself.led_b = machine.Pin({{ pin_num_b }}, machine.Pin.OUT)\nself.led_c = machine.Pin({{ pin_num_c }}, machine.Pin.OUT)\nself.led_d = machine.Pin({{ pin_num_d }}, machine.Pin.OUT)\nself.led_e = machine.Pin({{ pin_num_e }}, machine.Pin.OUT)\nself.led_f = machine.Pin({{ pin_num_f }}, machine.Pin.OUT)\nself.led_g = machine.Pin({{ pin_num_g }}, machine.Pin.OUT)\n\nself.leds = [self.led_a, self.led_b, self.led_c, self.led_d, self.led_e, self.led_f, self.led_g]\n\nself.outs=[[1,1,1,1,1,1,0],[0,1,1,0,0,0,0],[1,1,0,1,1,0,1],[1,1,1,1,0,0,1],[0,1,1,0,0,1,1],[1,0,1,1,0,1,1],[1,0,1,1,1,1,1],[1,1,1,0,0,0,0],[1,1,1,1,1,1,1],[1,1,1,1,0,1,1]]',
      update: 'self.out = self.outs[{{ input }} % 10]\nfor i in range(7):\n\tself.leds[i].value(int(self.out[i]))',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'input',
        type: ConnectionType.Number,
      },
    },
    outputs: {
      0: {
        name: 'a',
        type: ConnectionType.Bool,
      },
      1: {
        name: 'b',
        type: ConnectionType.Bool,
      },
      2: {
        name: 'c',
        type: ConnectionType.Bool,
      },
      3: {
        name: 'd',
        type: ConnectionType.Bool,
      },
      4: {
        name: 'e',
        type: ConnectionType.Bool,
      },
      5: {
        name: 'f',
        type: ConnectionType.Bool,
      },
      6: {
        name: 'g',
        type: ConnectionType.Bool,
      },
    },
  },
  RandomNumber: {
    description: 'Output a random number between given attribute values lower and higher inclusively when given a signal',
    attributes: {
      lower: { type: AttributeTypes.Number },
      higher: { type: AttributeTypes.Number },
    },
    code: {
      // TODO make this output a sane value before first signal
      init: 'import random\nself.random = random',
      update: 'if {{ input }}:\n\t{{ output }} = self.random.randint({{ lower }}, {{ higher }})',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'input',
        type: ConnectionType.Bool,
      },
    },
    outputs: {
      0: {
        name: 'output',
        type: ConnectionType.Number,
      },
    },
  },
  PulseGenerator: {
    description: 'Generate a pulse with a fixed delay',
    attributes: {
      delay_ms: { type: AttributeTypes.Number },
    },
    code: {
      init: 'import time\nself.time = time\nself.prev_pulse = time.ticks_ms()',
      update: 'if self.time.ticks_diff(self.time.ticks_ms(), self.prev_pulse) >= {{ delay_ms }}:\n\t{{ output }} = True\n\tself.prev_pulse = self.time.ticks_add(self.prev_pulse, {{ delay_ms }})\nelse:\n\t{{ output }} = False',
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
};

export const nodeTypesAtom = atom<Record<string, NodeTypeData>>({
  key: 'nodeTypes',
  default: defaultNodeTypes,
});

export default nodeTypesAtom;
