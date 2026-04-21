  const ESP32_PINS_DIGITAL = [
  ['GPIO 2 (LED)', '2'], ['GPIO 4', '4'], ['GPIO 5', '5'],
  ['GPIO 12', '12'], ['GPIO 13', '13'], ['GPIO 14', '14'],
  ['GPIO 15', '15'], ['GPIO 16', '16'], ['GPIO 17', '17'],
  ['GPIO 18', '18'], ['GPIO 19', '19'], ['GPIO 21', '21'],
  ['GPIO 22', '22'], ['GPIO 23', '23'], ['GPIO 25', '25'],
  ['GPIO 26', '26'], ['GPIO 27', '27'], ['GPIO 32', '32'], ['GPIO 33', '33']
];


const ESP32_PHYSICAL_MAP = [
  // Left Column (Grid) | Right Column (Grid)
  ['EN (Reset)', 'EN'],  ['GPIO 23', '23'],
  ['GPIO 36 (VP)', '36'], ['GPIO 22', '22'],
  ['GPIO 39 (VN)', '39'], ['TX0 (GPIO 1)', '1'],
  ['GPIO 34', '34'],      ['RX0 (GPIO 3)', '3'],
  ['GPIO 35', '35'],      ['GPIO 21', '21'],
  ['GPIO 32', '32'],      ['GPIO 19', '19'],
  ['GPIO 33', '33'],      ['GPIO 18', '18'],
  ['GPIO 25', '25'],      ['GPIO 5', '5'],
  ['GPIO 26', '26'],      ['GPIO 17', '17'],
  ['GPIO 27', '27'],      ['GPIO 16', '16'],
  ['GPIO 14', '14'],      ['GPIO 4', '4'],
  ['GPIO 12', '12'],      ['GPIO 0', '0'],
  ['GPIO 13', '13'],      ['GPIO 2', '2'],
  ['GND', 'GND'],         ['GPIO 15', '15'],
  ['VIN (5V)', 'VIN'],    ['GPIO 8', '8']
];

const ESP32_30PIN_MAP = [
  ['RST', 'EN'],      ['D23', '23'],
  ['VP', '36'],    ['D22', '22'],
  ['VN', '39'],    ['TX0', 'TX0'],
  ['D34', '34'],    ['RX0', 'RX0'],
  ['D35', '35'],    ['D21', '21'],
  ['D32', '32'],         ['D19', '19'],
  ['D33', '33'],         ['D18', '18'],
  ['D25', '25'],         ['D5', '5'],
  ['D26', '26'],         ['D17', '17'],
  ['D27', '27'],         ['D16', '16'],
  ['D14', '14'],         ['D4', '4'],
  ['D12', '12'],         ['D2', '2'],
  ['D13', '13'],         ['D15', '15'],
  ['GND', 'GND'],   ['GND', 'GND'],
  ['VIN', 'VIN'],    ['3V3', '3V3']
];


const hardwarePinValidator = function(newValue) {
    // List of values that are physical-only
    const restricted = ['EN', 'GND', 'VIN', '3V3'];
    
    if (restricted.includes(newValue)) {
        // Reject the selection and keep the previous value
        return null; 
    }
    return newValue;
};


Blockly.Extensions.register('set_default_pin', function() {
  // This code runs every time a new block is created
  this.getField('PIN').setValue('2');
});


  // THIS FILE HELPS CREATES THE VISUAL CODING BLOCKS IN THE IDE // 
  
  // Start Block
    Blockly.defineBlocksWithJsonArray([
      {
        "type": "base_start",
        "message0": "On Start %1 %2",
        "args0": [
          { "type": "input_dummy" },
          { "type": "input_statement", "name": "STACK" }
        ],    
     //   "nextStatement": null, // Allows blocks to follow AFTER the start block */
        "colour": "#0bc5dd",
        "tooltip": "Initialization code for ESP32",        
      }
    ]);

    // Forever Block
    Blockly.defineBlocksWithJsonArray([
      {
        "type": "base_forever",
        "message0": "Forever %1 %2",
        "args0": [
          { "type": "input_dummy" },
          { "type": "input_statement", "name": "STACK" }
        ],
     /*  "style": "hat_blocks",
     /*   "previousStatement": null, // Allows it to be placed after 'On Start' */
     /*   "nextStatement": null, */
        "colour": "#0bc5dd",
        "tooltip": "Continuous loop for your ESP32",        
      }
    ]);


  // 1. DEFINE CUSTOM ESP32 BLOCKS (Must happen BEFORE workspace injection)

Blockly.defineBlocksWithJsonArray([
  {
    "type": "esp32_led",
    "message0": "Set Built-in LED %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "ESP32_LED",
        "options": [
          ["ON", "1"],
          ["OFF", "0"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#93a55b", // Cyber Blue for high contrast
    "tooltip": "Turn the internal ESP32 LED (GPIO 2) on or off"
  }
]);


  // 2. SENSOR BLOCK DEFINITIONS ---

  // ULTRASONIC HC-SR04
  Blockly.Blocks['sensor_ultrasonic'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Ultrasonic Distance (cm)")
          .appendField("Trig:")
          .appendField(new Blockly.FieldNumber(5), "TRIG")
          .appendField("Echo:")
          .appendField(new Blockly.FieldNumber(18), "ECHO");
      this.setOutput(true, null);
      this.setColour(75);
    }
  };

  // DHT11 TEMPERATURE/HUMIDITY
  Blockly.Blocks['sensor_dht11'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("DHT11")
          .appendField(new Blockly.FieldDropdown([["Temperature", "temp"], ["Humidity", "hum"]]), "TYPE")
          .appendField("Pin:")
          .appendField(new Blockly.FieldNumber(4), "PIN");
      this.setOutput(true, null);
      this.setColour(75);
    }
  };

  // LDR (ANALOG LIGHT SENSOR)
  Blockly.Blocks['sensor_ldr'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("LDR Light Level")
          .appendField("Pin:")
          .appendField(new Blockly.FieldNumber(34), "PIN");
      this.setOutput(true, null);
      this.setColour(75);
    }
  };



  //TIME DELAY BLOCK (MILLI SECONDS)

Blockly.defineBlocksWithJsonArray([
  {
    "type": "base_delay",
    "message0": "Wait %1 ms",
    "args0": [
      {
        "type": "field_number",
        "name": "MS",
        "value": 1000,
        "min": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#A65C81", // High-contrast hardware/control purple
    "tooltip": "Pause execution for a specific number of milliseconds."
  }
]);


Blockly.defineBlocksWithJsonArray([
  {
    "type": "esp32_internal_temp",
    "message0": " Get ESP32 Chip Temperature ",
    "output": "Number",
    "colour": 160,
    "tooltip": "get ESP32's internal temperature",
    "helpUrl": ""
  },
  
]);


Blockly.defineBlocksWithJsonArray([
  // Digital Write
  {
    "type": "pin_digital_write",
    "message0": "set digital pin %1 to %2",
    "args0": [
      { "type": "field_grid_dropdown", "name": "PIN", "columns": 2,"options": ESP32_30PIN_MAP, "value": 4 },
      // { "type": "field_number", "name": "PIN", "value": 2 },
      { "type": "field_grid_dropdown", "name": "STATE", "columns": 1,"options": [["HIGH", "1"], ["LOW", "0"]] }
    ],
    "extensions": ["set_default_pin"],
    "config": {
    "maxHeight": 400 
    },
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120
  },
  // Digital Read
  {
    "type": "pin_digital_read",
    "message0": "read digital pin %1",
    "args0": [{ "type": "field_number", "name": "PIN", "value": 4 }],
    "output": "Number",
    "colour": 120
  },
  // Analog Read
  {
    "type": "pin_analog_read",
    "message0": "read analog pin %1",
    "args0": [{ "type": "field_number", "name": "PIN", "value": 34 }],
    "output": "Number",
    "colour": 120
  },
  // PWM Write
  {
    "type": "pin_pwm_write",
    "message0": "set PWM pin %1 duty %2",
    "args0": [
      { "type": "field_number", "name": "PIN", "value": 2 },
      { "type": "input_value", "name": "DUTY", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120
  }
]);

// Apply this to the PIN field of your digital write block
Blockly.Blocks['pin_digital_write'].getField('PIN').setValidator(hardwarePinValidator);


// 2. Force the default values immediately
if (Blockly.Blocks['pin_digital_write']) {
    // We create a dummy instance to set the "template" default
    const tempBlock = workspace.newBlock('pin_digital_write');
    tempBlock.getField('PIN').setValue('2');
    tempBlock.dispose(); // Delete the dummy block
}



