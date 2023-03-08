import { atom } from 'recoil';
import {
  NodeTypes, ConnectionType, NodeTypeData, AttributeTypes, NodeGroups,
} from '../../interfaces/NodeTypes.interface';

const defaultNodeTypes: NodeTypes = {
  Button: {
    group: NodeGroups.Input,
    description: 'A physical button.',
    attributes: {
      'Pin number': { type: AttributeTypes.DigitalIn },
    },
    hasBlockName: true,
    code: {
      init: 'import time\nself.time = time\nself.prev_change_time = 0\nself.led = machine.Pin({{ Pin number }}, machine.Pin.IN, machine.Pin.PULL_DOWN)',
      update: 'if (self.time.ticks_ms() - self.prev_change_time > 100):\n\t{{output}} = self.led.value()\n\tself.prev_change_time = self.time.ticks_ms()',
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
    group: NodeGroups.Logic,
    description: 'Outputs True if all of its inputs are True.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Logic,
    description: 'Outputs True if its input is False or outputs False if its input is True.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Logic,
    description: 'Outputs True if at least one input is True.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Numerical,
    description: 'Adds two numbers together.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Input,
    description: 'A constant integer.', // Used for testing attributes
    attributes: {
      'Constant Value': { type: AttributeTypes.Number },
    },
    hasBlockName: false,
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
    group: NodeGroups.Input,
    description: 'A boolean constant (True/False).',
    attributes: {
      'Constant Value': { type: AttributeTypes.Bool },
    },
    hasBlockName: false,
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
    group: NodeGroups.Output,
    description: 'Prints an integer.', // Used for testing execution model.
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Output,
    description: 'An LED.',
    attributes: {
      'Pin number': { type: AttributeTypes.DigitalOut },
    },
    hasBlockName: true,
    code: {
      init: 'self.led = machine.Pin({{ Pin number }}, machine.Pin.OUT)',
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
    group: NodeGroups.Numerical,
    description: 'Increments a counter when triggered, resetting when reset is triggered.',
    attributes: {},
    hasBlockName: false,
    code: {
      init: '',
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
    group: NodeGroups.Logic,
    description: 'Outputs True if both inputs are unequal.',
    attributes: {},
    hasBlockName: false,
    code: {
      init: '',
      update: '{{ output }} = {{ left }} ^ {{ right }}',
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
  Multiply: {
    group: NodeGroups.Numerical,
    description: 'Multiplies two numbers together.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Numerical,
    description: 'Divides the left input by the right.', // TODO: Divide by zero!
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Numerical,
    description: 'Subtracts the right input from the left.',
    attributes: {},
    hasBlockName: false,
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
  Remainder: {
    group: NodeGroups.Numerical,
    description: 'Gives the remainder of the left input when divided by the right.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Comparison,
    description: 'Checks if two numbers are equal.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Comparison,
    description: 'Checks if the left input is greater than the right.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Comparison,
    description: 'Checks if the left input is less than the right.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Comparison,
    description: 'Checks if the left input is greater than or equal to the right.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Comparison,
    description: 'Checks if the left input is less than or equal to the right.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.Comparison,
    description: 'Checks if 2 numbers are not equal.',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.ControlFlow,
    description: 'Picks one of two boolean inputs to output (True for left, False for right).',
    attributes: {},
    hasBlockName: false,
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
    group: NodeGroups.ControlFlow,
    description: 'Picks one of two numeric inputs to output (True for left, False for right).',
    attributes: {},
    hasBlockName: false,
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
    description: 'Outputs True for a single frame when input is True.',
    attributes: {},
    hasBlockName: false,
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
    hasBlockName: false,
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
  SevenSegDisplay: {
    group: NodeGroups.Output,
    description: 'Convert a numeric input into seven outputs for a 7-segment display.',
    attributes: {
      'Pin number a': { type: AttributeTypes.DigitalOut },
      'Pin number b': { type: AttributeTypes.DigitalOut },
      'Pin number c': { type: AttributeTypes.DigitalOut },
      'Pin number d': { type: AttributeTypes.DigitalOut },
      'Pin number e': { type: AttributeTypes.DigitalOut },
      'Pin number f': { type: AttributeTypes.DigitalOut },
      'Pin number g': { type: AttributeTypes.DigitalOut },
    },
    hasBlockName: true,
    code: {
      init: 'self.led_a = machine.Pin({{ Pin number a }}, machine.Pin.OUT)\nself.led_b = machine.Pin({{ Pin number b }}, machine.Pin.OUT)\nself.led_c = machine.Pin({{ Pin number c }}, machine.Pin.OUT)\nself.led_d = machine.Pin({{ Pin number d }}, machine.Pin.OUT)\nself.led_e = machine.Pin({{ Pin number e }}, machine.Pin.OUT)\nself.led_f = machine.Pin({{ Pin number f }}, machine.Pin.OUT)\nself.led_g = machine.Pin({{ Pin number g }}, machine.Pin.OUT)\n\nself.leds = [self.led_a, self.led_b, self.led_c, self.led_d, self.led_e, self.led_f, self.led_g]\n\nself.outs=[[1,1,1,1,1,1,0],[0,1,1,0,0,0,0],[1,1,0,1,1,0,1],[1,1,1,1,0,0,1],[0,1,1,0,0,1,1],[1,0,1,1,0,1,1],[1,0,1,1,1,1,1],[1,1,1,0,0,0,0],[1,1,1,1,1,1,1],[1,1,1,1,0,1,1]]',
      update: 'self.out = self.outs[{{ input }} % 10]\nfor i in range(7):\n\tself.leds[i].value(int(not self.out[i]))',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'input',
        type: ConnectionType.Number,
      },
    },
    outputs: {},
  },
  RandomNumber: {
    group: NodeGroups.Input,
    description: 'Outputs a random number in an inclusive range when given a signal.',
    attributes: {
      Minimum: { type: AttributeTypes.Number },
      Maximum: { type: AttributeTypes.Number },
    },
    hasBlockName: false,
    code: {
      // TODO make this output a sane value before first signal
      init: 'import random\nself.random = random',
      update: 'if {{ input }}:\n\t{{ output }} = self.random.randint({{ Minimum }}, {{ Maximum }})',
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
    group: NodeGroups.Input,
    description: 'Generates a pulse with a fixed delay in milliseconds.',
    attributes: {
      'Delay (ms)': { type: AttributeTypes.Number },
    },
    hasBlockName: false,
    code: {
      init: 'import time\nself.time = time\nself.prev_pulse = time.ticks_ms()',
      update: 'if self.time.ticks_diff(self.time.ticks_ms(), self.prev_pulse) >= {{ Delay (ms) }}:\n\t{{ output }} = True\n\tself.prev_pulse = self.time.ticks_add(self.prev_pulse, {{ Delay (ms) }})\nelse:\n\t{{ output }} = False',
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
  LCDDisplay: {
    group: NodeGroups.Output,
    description: 'An I2C LCD Display.',
    attributes: {
      'SCL pin': { type: AttributeTypes.DigitalOut },
      'SDA pin': { type: AttributeTypes.DigitalOut },
    },
    hasBlockName: false,
    code: {
      init: '"""Provides an API for talking to HD44780 compatible character LCDs."""\n\nimport time\n\nclass LcdApi:\n\t"""Implements the API for talking with HD44780 compatible character LCDs.\n\tThis class only knows what commands to send to the LCD, and not how to get\n\tthem to the LCD.\n\n\tIt is expected that a derived class will implement the hal_xxx functions.\n\t"""\n\n\t# The following constant names were lifted from the avrlib lcd.h\n\t# header file, however, I changed the definitions from bit numbers\n\t# to bit masks.\n\t#\n\t# HD44780 LCD controller command set\n\n\tLCD_CLR = 0x01              # DB0: clear display\n\tLCD_HOME = 0x02             # DB1: return to home position\n\n\tLCD_ENTRY_MODE = 0x04       # DB2: set entry mode\n\tLCD_ENTRY_INC = 0x02        # --DB1: increment\n\tLCD_ENTRY_SHIFT = 0x01      # --DB0: shift\n\n\tLCD_ON_CTRL = 0x08          # DB3: turn lcd/cursor on\n\tLCD_ON_DISPLAY = 0x04       # --DB2: turn display on\n\tLCD_ON_CURSOR = 0x02        # --DB1: turn cursor on\n\tLCD_ON_BLINK = 0x01         # --DB0: blinking cursor\n\n\tLCD_MOVE = 0x10             # DB4: move cursor/display\n\tLCD_MOVE_DISP = 0x08        # --DB3: move display (0-> move cursor)\n\tLCD_MOVE_RIGHT = 0x04       # --DB2: move right (0-> left)\n\n\tLCD_FUNCTION = 0x20         # DB5: function set\n\tLCD_FUNCTION_8BIT = 0x10    # --DB4: set 8BIT mode (0->4BIT mode)\n\tLCD_FUNCTION_2LINES = 0x08  # --DB3: two lines (0->one line)\n\tLCD_FUNCTION_10DOTS = 0x04  # --DB2: 5x10 font (0->5x7 font)\n\tLCD_FUNCTION_RESET = 0x30   # See "Initializing by Instruction" section\n\n\tLCD_CGRAM = 0x40            # DB6: set CG RAM address\n\tLCD_DDRAM = 0x80            # DB7: set DD RAM address\n\n\tLCD_RS_CMD = 0\n\tLCD_RS_DATA = 1\n\n\tLCD_RW_WRITE = 0\n\tLCD_RW_READ = 1\n\n\tdef __init__(self, num_lines, num_columns):\n\t\tself.num_lines = num_lines\n\t\tif self.num_lines > 4:\n\t\t\tself.num_lines = 4\n\t\tself.num_columns = num_columns\n\t\tif self.num_columns > 40:\n\t\t\tself.num_columns = 40\n\t\tself.cursor_x = 0\n\t\tself.cursor_y = 0\n\t\tself.implied_newline = False\n\t\tself.backlight = True\n\t\tself.display_off()\n\t\tself.backlight_on()\n\t\tself.clear()\n\t\tself.hal_write_command(self.LCD_ENTRY_MODE | self.LCD_ENTRY_INC)\n\t\tself.hide_cursor()\n\t\tself.display_on()\n\n\tdef clear(self):\n\t\t"""Clears the LCD display and moves the cursor to the top left\n\t\tcorner.\n\t\t"""\n\t\tself.hal_write_command(self.LCD_CLR)\n\t\tself.hal_write_command(self.LCD_HOME)\n\t\tself.cursor_x = 0\n\t\tself.cursor_y = 0\n\n\tdef show_cursor(self):\n\t\t"""Causes the cursor to be made visible."""\n\t\tself.hal_write_command(self.LCD_ON_CTRL | self.LCD_ON_DISPLAY |\n\t\t\t\t\t\t\t   self.LCD_ON_CURSOR)\n\n\tdef hide_cursor(self):\n\t\t"""Causes the cursor to be hidden."""\n\t\tself.hal_write_command(self.LCD_ON_CTRL | self.LCD_ON_DISPLAY)\n\n\tdef blink_cursor_on(self):\n\t\t"""Turns on the cursor, and makes it blink."""\n\t\tself.hal_write_command(self.LCD_ON_CTRL | self.LCD_ON_DISPLAY |\n\t\t\t\t\t\t\t   self.LCD_ON_CURSOR | self.LCD_ON_BLINK)\n\n\tdef blink_cursor_off(self):\n\t\t"""Turns on the cursor, and makes it no blink (i.e. be solid)."""\n\t\tself.hal_write_command(self.LCD_ON_CTRL | self.LCD_ON_DISPLAY |\n\t\t\t\t\t\t\t   self.LCD_ON_CURSOR)\n\n\tdef display_on(self):\n\t\t"""Turns on (i.e. unblanks) the LCD."""\n\t\tself.hal_write_command(self.LCD_ON_CTRL | self.LCD_ON_DISPLAY)\n\n\tdef display_off(self):\n\t\t"""Turns off (i.e. blanks) the LCD."""\n\t\tself.hal_write_command(self.LCD_ON_CTRL)\n\n\tdef backlight_on(self):\n\t\t"""Turns the backlight on.\n\n\t\tThis isn"t really an LCD command, but some modules have backlight\n\t\tcontrols, so this allows the hal to pass through the command.\n\t\t"""\n\t\tself.backlight = True\n\t\tself.hal_backlight_on()\n\n\tdef backlight_off(self):\n\t\t"""Turns the backlight off.\n\n\t\tThis isn"t really an LCD command, but some modules have backlight\n\t\tcontrols, so this allows the hal to pass through the command.\n\t\t"""\n\t\tself.backlight = False\n\t\tself.hal_backlight_off()\n\n\tdef move_to(self, cursor_x, cursor_y):\n\t\t"""Moves the cursor position to the indicated position. The cursor\n\t\tposition is zero based (i.e. cursor_x == 0 indicates first column).\n\t\t"""\n\t\tself.cursor_x = cursor_x\n\t\tself.cursor_y = cursor_y\n\t\taddr = cursor_x & 0x3f\n\t\tif cursor_y & 1:\n\t\t\taddr += 0x40    # Lines 1 & 3 add 0x40\n\t\tif cursor_y & 2:    # Lines 2 & 3 add number of columns\n\t\t\taddr += self.num_columns\n\t\tself.hal_write_command(self.LCD_DDRAM | addr)\n\n\tdef putchar(self, char):\n\t\t"""Writes the indicated character to the LCD at the current cursor\n\t\tposition, and advances the cursor by one position.\n\t\t"""\n\t\tif char == "\\n":\n\t\t\tif self.implied_newline:\n\t\t\t\t# self.implied_newline means we advanced due to a wraparound,\n\t\t\t\t# so if we get a newline right after that we ignore it.\n\t\t\t\tself.implied_newline = False\n\t\t\telse:\n\t\t\t\tself.cursor_x = self.num_columns\n\t\telse:\n\t\t\tself.hal_write_data(ord(char))\n\t\t\tself.cursor_x += 1\n\t\tif self.cursor_x >= self.num_columns:\n\t\t\tself.cursor_x = 0\n\t\t\tself.cursor_y += 1\n\t\t\tself.implied_newline = (char != "\\n")\n\t\tif self.cursor_y >= self.num_lines:\n\t\t\tself.cursor_y = 0\n\t\tself.move_to(self.cursor_x, self.cursor_y)\n\n\tdef putstr(self, string):\n\t\t"""Write the indicated string to the LCD at the current cursor\n\t\tposition and advances the cursor position appropriately.\n\t\t"""\n\t\tfor char in string:\n\t\t\tself.putchar(char)\n\n\tdef custom_char(self, location, charmap):\n\t\t"""Write a character to one of the 8 CGRAM locations, available\n\t\tas chr(0) through chr(7).\n\t\t"""\n\t\tlocation &= 0x7\n\t\tself.hal_write_command(self.LCD_CGRAM | (location << 3))\n\t\tself.hal_sleep_us(40)\n\t\tfor i in range(8):\n\t\t\tself.hal_write_data(charmap[i])\n\t\t\tself.hal_sleep_us(40)\n\t\tself.move_to(self.cursor_x, self.cursor_y)\n\n\tdef hal_backlight_on(self):\n\t\t"""Allows the hal layer to turn the backlight on.\n\n\t\tIf desired, a derived HAL class will implement this function.\n\t\t"""\n\t\tpass\n\n\tdef hal_backlight_off(self):\n\t\t"""Allows the hal layer to turn the backlight off.\n\n\t\tIf desired, a derived HAL class will implement this function.\n\t\t"""\n\t\tpass\n\n\tdef hal_write_command(self, cmd):\n\t\t"""Write a command to the LCD.\n\n\t\tIt is expected that a derived HAL class will implement this\n\t\tfunction.\n\t\t"""\n\t\traise NotImplementedError\n\n\tdef hal_write_data(self, data):\n\t\t"""Write data to the LCD.\n\n\t\tIt is expected that a derived HAL class will implement this\n\t\tfunction.\n\t\t"""\n\t\traise NotImplementedError\n\n\t# This is a default implementation of hal_sleep_us which is suitable\n\t# for most micropython implementations. For platforms which don"t\n\t# support `time.sleep_us()` they should provide their own implementation\n\t# of hal_sleep_us in their hal layer and it will be used instead.\n\tdef hal_sleep_us(self, usecs):\n\t\t"""Sleep for some time (given in microseconds)."""\n\t\ttime.sleep_us(usecs)  # NOTE this is not part of Standard Python library, specific hal layers will need to override this\n\nimport utime\nimport gc\n\nfrom machine import I2C\n\n# PCF8574 pin definitions\nMASK_RS = 0x01       # P0\nMASK_RW = 0x02       # P1\nMASK_E  = 0x04       # P2\n\nSHIFT_BACKLIGHT = 3  # P3\nSHIFT_DATA      = 4  # P4-P7\n\nclass I2cLcd(LcdApi):\n\t\n\t#Implements a HD44780 character LCD connected via PCF8574 on I2C\n\n\tdef __init__(self, i2c, i2c_addr, num_lines, num_columns):\n\t\tself.i2c = i2c\n\t\tself.i2c_addr = i2c_addr\n\t\tself.i2c.writeto(self.i2c_addr, bytes([0]))\n\t\tutime.sleep_ms(20)   # Allow LCD time to powerup\n\t\t# Send reset 3 times\n\t\tself.hal_write_init_nibble(self.LCD_FUNCTION_RESET)\n\t\tutime.sleep_ms(5)    # Need to delay at least 4.1 msec\n\t\tself.hal_write_init_nibble(self.LCD_FUNCTION_RESET)\n\t\tutime.sleep_ms(1)\n\t\tself.hal_write_init_nibble(self.LCD_FUNCTION_RESET)\n\t\tutime.sleep_ms(1)\n\t\t# Put LCD into 4-bit mode\n\t\tself.hal_write_init_nibble(self.LCD_FUNCTION)\n\t\tutime.sleep_ms(1)\n\t\tLcdApi.__init__(self, num_lines, num_columns)\n\t\tcmd = self.LCD_FUNCTION\n\t\tif num_lines > 1:\n\t\t\tcmd |= self.LCD_FUNCTION_2LINES\n\t\tself.hal_write_command(cmd)\n\t\tgc.collect()\n\n\tdef hal_write_init_nibble(self, nibble):\n\t\t# Writes an initialization nibble to the LCD.\n\t\t# This particular function is only used during initialization.\n\t\tbyte = ((nibble >> 4) & 0x0f) << SHIFT_DATA\n\t\tself.i2c.writeto(self.i2c_addr, bytes([byte | MASK_E]))\n\t\tself.i2c.writeto(self.i2c_addr, bytes([byte]))\n\t\tgc.collect()\n\t\t\n\tdef hal_backlight_on(self):\n\t\t# Allows the hal layer to turn the backlight on\n\t\tself.i2c.writeto(self.i2c_addr, bytes([1 << SHIFT_BACKLIGHT]))\n\t\tgc.collect()\n\t\t\n\tdef hal_backlight_off(self):\n\t\t#Allows the hal layer to turn the backlight off\n\t\tself.i2c.writeto(self.i2c_addr, bytes([0]))\n\t\tgc.collect()\n\t\t\n\tdef hal_write_command(self, cmd):\n\t\t# Write a command to the LCD. Data is latched on the falling edge of E.\n\t\tbyte = ((self.backlight << SHIFT_BACKLIGHT) |\n\t\t\t\t(((cmd >> 4) & 0x0f) << SHIFT_DATA))\n\t\tself.i2c.writeto(self.i2c_addr, bytes([byte | MASK_E]))\n\t\tself.i2c.writeto(self.i2c_addr, bytes([byte]))\n\t\tbyte = ((self.backlight << SHIFT_BACKLIGHT) |\n\t\t\t\t((cmd & 0x0f) << SHIFT_DATA))\n\t\tself.i2c.writeto(self.i2c_addr, bytes([byte | MASK_E]))\n\t\tself.i2c.writeto(self.i2c_addr, bytes([byte]))\n\t\tif cmd <= 3:\n\t\t\t# The home and clear commands require a worst case delay of 4.1 msec\n\t\t\tutime.sleep_ms(5)\n\t\tgc.collect()\n\n\tdef hal_write_data(self, data):\n\t\t# Write data to the LCD. Data is latched on the falling edge of E.\n\t\tbyte = (MASK_RS |\n\t\t\t\t(self.backlight << SHIFT_BACKLIGHT) |\n\t\t\t\t(((data >> 4) & 0x0f) << SHIFT_DATA))\n\t\tself.i2c.writeto(self.i2c_addr, bytes([byte | MASK_E]))\n\t\tself.i2c.writeto(self.i2c_addr, bytes([byte]))\n\t\tbyte = (MASK_RS |\n\t\t\t\t(self.backlight << SHIFT_BACKLIGHT) |\n\t\t\t\t((data & 0x0f) << SHIFT_DATA))      \n\t\tself.i2c.writeto(self.i2c_addr, bytes([byte | MASK_E]))\n\t\tself.i2c.writeto(self.i2c_addr, bytes([byte]))\n\t\tgc.collect()\n\n\ni2c = machine.I2C(0, sda=machine.Pin({{SDA pin}}), scl=machine.Pin({{SCL pin}}), freq=400000)\n\nI2C_ADDR = i2c.scan()[0]\nself.lcd = I2cLcd(i2c, I2C_ADDR, 2, 16)\n\nself.prev_input = None',
      update: 'if (self.prev_input != {{input}}):\n\tself.lcd.clear()\n\tself.lcd.putstr(str({{input}}))\n\tself.prev_input = {{input}}',
      isQuery: true,
    },
    inputs: {
      0: {
        name: 'input',
        type: ConnectionType.Number,
      },
    },
    outputs: {},
  },
  DistanceSensor: {
    group: NodeGroups.Input,
    description: 'An HC-SR04 Distance Sensor.',
    attributes: {
      'Trigger pin': { type: AttributeTypes.DigitalOut },
      'Echo pin': { type: AttributeTypes.DigitalIn },
    },
    hasBlockName: true,
    code: {
      init: 'import time\n\n__version__ = "0.2.0"\n__author__ = "Roberto S鐠嬶箯chez"\n__license__ = "Apache License 2.0. https://www.apache.org/licenses/LICENSE-2.0"\n\nclass HCSR04:\n\t"""\n\tDriver to use the untrasonic sensor HC-SR04.\n\tThe sensor range is between 2cm and 4m.\n\tThe timeouts received listening to echo pin are converted to OSError("Out of range")\n\t"""\n\t# echo_timeout_us is based in chip range limit (400cm)\n\tdef __init__(self, trigger_pin, echo_pin, echo_timeout_us=500*2*30):\n\t\t"""\n\t\ttrigger_pin: Output pin to send pulses\n\t\techo_pin: Readonly pin to measure the distance. The pin should be protected with 1k resistor\n\t\techo_timeout_us: Timeout in microseconds to listen to echo pin. \n\t\tBy default is based in sensor limit range (4m)\n\t\t"""\n\t\tself.echo_timeout_us = echo_timeout_us\n\t\t# Init trigger pin (out)\n\t\tself.trigger = machine.Pin(trigger_pin, mode=machine.Pin.OUT, pull=None)\n\t\tself.trigger.value(0)\n\n\t\t# Init echo pin (in)\n\t\tself.echo = machine.Pin(echo_pin, mode=machine.Pin.IN, pull=None)\n\n\tdef _send_pulse_and_wait(self):\n\t\t"""\n\t\tSend the pulse to trigger and listen on echo pin.\n\t\tWe use the method `machine.time_pulse_us()` to get the microseconds until the echo is received.\n\t\t"""\n\t\tself.trigger.value(0) # Stabilize the sensor\n\t\ttime.sleep_us(5)\n\t\tself.trigger.value(1)\n\t\t# Send a 10us pulse.\n\t\ttime.sleep_us(10)\n\t\tself.trigger.value(0)\n\t\ttry:\n\t\t\tpulse_time = machine.time_pulse_us(self.echo, 1, self.echo_timeout_us)\n\t\t\treturn pulse_time\n\t\texcept OSError as ex:\n\t\t\tif ex.args[0] == 110: # 110 = ETIMEDOUT\n\t\t\t\traise OSError("Out of range")\n\t\t\traise ex\n\n\tdef distance_mm(self):\n\t\t"""\n\t\tGet the distance in milimeters without floating point operations.\n\t\t"""\n\t\tpulse_time = self._send_pulse_and_wait()\n\n\t\t# To calculate the distance we get the pulse_time and divide it by 2 \n\t\t# (the pulse walk the distance twice) and by 29.1 becasue\n\t\t# the sound speed on air (343.2 m/s), that It"s equivalent to\n\t\t# 0.34320 mm/us that is 1mm each 2.91us\n\t\t# pulse_time // 2 // 2.91 -> pulse_time // 5.82 -> pulse_time * 100 // 582 \n\t\tmm = pulse_time * 100 // 582\n\t\treturn mm\n\n\tdef distance_cm(self):\n\t\t"""\n\t\tGet the distance in centimeters with floating point operations.\n\t\tIt returns a float\n\t\t"""\n\t\tpulse_time = self._send_pulse_and_wait()\n\n\t\t# To calculate the distance we get the pulse_time and divide it by 2 \n\t\t# (the pulse walk the distance twice) and by 29.1 becasue\n\t\t# the sound speed on air (343.2 m/s), that It"s equivalent to\n\t\t# 0.034320 cm/us that is 1cm each 29.1us\n\t\tcms = (pulse_time / 2) / 29.1\n\t\treturn cms\n\nself.sensor = HCSR04(trigger_pin={{Trigger pin}}, echo_pin={{Echo pin}}, echo_timeout_us=10000)',
      update: '{{distance}} = self.sensor.distance_cm()',
      isQuery: true,
    },
    inputs: {},
    outputs: {
      0: {
        name: 'distance',
        type: ConnectionType.Number,
      },
    },
  },
  Buzzer: {
    group: NodeGroups.Output,
    description: 'A passive buzzer.',
    attributes: {
      'Pin number': { type: AttributeTypes.DigitalOut },
    },
    hasBlockName: true,
    code: {
      init: 'self.buzzer = machine.Pin({{ Pin number }}, machine.Pin.OUT)',
      update: 'self.buzzer.value({{ input }})',
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
  AnalogOutput: {
    group: NodeGroups.Output,
    description: 'An analog output which takes input values from 0–100.',
    attributes: {
      'Pin number': { type: AttributeTypes.AnalogOut },
    },
    hasBlockName: false,
    code: {
      init: 'self.pwm0 = machine.PWM(machine.Pin({{Pin number}}))\nself.pwm0.freq(1000)',
      update: 'self.pwm0.duty_u16( round( ( {{value}} / 100 ) * 65535 ) )',
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
  RGB_LED: {
    group: NodeGroups.Output,
    description: 'An LED with red, green, and blue inputs taking values from 0–100.',
    attributes: {
      'Red pin': { type: AttributeTypes.AnalogOut },
      'Green pin': { type: AttributeTypes.AnalogOut },
      'Blue pin': { type: AttributeTypes.AnalogOut },
    },
    hasBlockName: false,
    code: {
      init: 'self.red_led = machine.PWM(machine.Pin({{Red pin}}))\nself.green_led = machine.PWM(machine.Pin({{Green pin}}))\nself.blue_led = machine.PWM(machine.Pin({{Blue pin}}))\n\nself.red_led.freq(1000)\nself.green_led.freq(1000)\nself.blue_led.freq(1000)',
      update: 'self.red_led.duty_u16( round( ( 1 - {{red}}/100 ) * 65535 ) )\nself.green_led.duty_u16( round( ( 1 - {{green}}/100 ) * 65535 ) )\nself.blue_led.duty_u16( round( ( 1 - {{blue}}/100 ) * 65535 ) )',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'red',
        type: ConnectionType.Number,
      },
      1: {
        name: 'green',
        type: ConnectionType.Number,
      },
      2: {
        name: 'blue',
        type: ConnectionType.Number,
      },
    },
    outputs: {},
  },
  chooseOutput: {
    group: NodeGroups.ControlFlow,
    description: 'Picks one of two boolean inputs to output (True for left, False for right).',
    attributes: {},
    hasBlockName: false,
    code: {
      init: '',
      update: '{{ output_0}} = {{choice}}==0\n{{ output_1}} = {{choice}}==1\n{{ output_2}} = {{choice}}==2\n{{ output_3}} = {{choice}}==3\n{{ output_4}} = {{choice}}==4\n',
      isQuery: false,
    },
    inputs: {
      0: {
        name: 'choice',
        type: ConnectionType.Number,
      },
    },
    outputs: {
      0: {
        name: 'output_0',
        type: ConnectionType.Bool,
      },
      1: {
        name: 'output_1',
        type: ConnectionType.Bool,
      },
      2: {
        name: 'output_2',
        type: ConnectionType.Bool,
      },
      3: {
        name: 'output_3',
        type: ConnectionType.Bool,
      },
      4: {
        name: 'output_4',
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
