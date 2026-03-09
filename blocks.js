
  // THIS FILE HELPS CREATES THE VISUAL CODING BLOCKS IN THE IDE // 
  
  // Start Block
    Blockly.Blocks['base_start'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("On Start");
        this.appendStatementInput("STACK")
            .setCheck(null);
        this.setColour("#2ECC71");
        this.setTooltip("Run code once when the ESP32 starts.");
      }
    }; 

    // Forever Block
    Blockly.Blocks['base_forever'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("Forever");
        this.appendStatementInput("STACK")
            .setCheck(null);
        this.setColour("#FF5733");
        this.setTooltip("Repeat this code in a loop.");
      }
    };  

  // 1. DEFINE CUSTOM ESP32 BLOCKS (Must happen BEFORE workspace injection)
  Blockly.Blocks['esp32_led'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Set Built-in LED")
          .appendField(new Blockly.FieldDropdown([["ON","1"], ["OFF","0"]]), "STATE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(30); 
      this.setTooltip("Turn the internal ESP32 LED (GPIO 2) on or off");
    }
  };



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

  Blockly.Blocks['base_delay'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Wait")
        .appendField(new Blockly.FieldNumber(1000, 0), "MS")
        .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip("Pause execution for a specific number of milliseconds.");
  }
};