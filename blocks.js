
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
    "type": "servo_set_angle",
    "message0": "set servo %1 angle to %2 °",
    "args0": [
      { "type": "field_variable", "name": "SERVO", "variable": "myServo" },
      { "type": "input_value", "name": "ANGLE", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#03AA74",
    "tooltip": "Set the servo angle (0-180)"
  },
  {
    "type": "servo_run_continuous",
    "message0": "continuous %1 run at %2 %",
    "args0": [
      { "type": "field_variable", "name": "SERVO", "variable": "myServo" },
      { "type": "input_value", "name": "SPEED", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#03AA74",
    "tooltip": "Set throttle from -100 to 100"
  }
]);