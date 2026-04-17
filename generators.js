/* This file stores the MicroPython code generators for all the Blocks in the IDE */

// 3. HARDWARE BLOCKS
Blockly.Python.forBlock['esp32_led'] = function(block) {
    Blockly.Python.definitions_['import_machine'] = 'import machine';
    console.log("Generating: esp32_led");
    var dropdown_state = block.getFieldValue('ESP32_LED');
    
    return 'machine.Pin(2, machine.Pin.OUT).value(' + dropdown_state + ')\n';
};

// 4. SENSOR BLOCKS (Returning Tuples for expressions)
Blockly.Python['sensor_ultrasonic'] = function(block) {
    Blockly.Python.definitions_['import_hcsr04'] = 'from hcsr04 import HCSR04';
    var trig = block.getFieldValue('TRIG');
    var echo = block.getFieldValue('ECHO');
    var code = 'HCSR04(trigger_pin=' + trig + ', echo_pin=' + echo + ').distance_cm()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensor_dht11'] = function(block) {
    Blockly.Python.definitions_['import_dht'] = 'import dht';
    Blockly.Python.definitions_['import_machine'] = 'import machine';
    var pin = block.getFieldValue('PIN');
    var type = block.getFieldValue('TYPE');
    var sensorName = 'dht' + pin;
    Blockly.Python.definitions_['init_dht' + pin] = sensorName + ' = dht.DHT11(machine.Pin(' + pin + '))';
    var code = sensorName + '.' + (type === 'temp' ? 'temperature()' : 'humidity()');
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensor_ldr'] = function(block) {
    Blockly.Python.definitions_['import_machine'] = 'import machine';
    var pin = block.getFieldValue('PIN');
    var code = 'machine.ADC(machine.Pin(' + pin + ')).read()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['base_delay'] = function(block) {
    // Ensures 'import time' is at the top of your MicroPython script    
    Blockly.Python.definitions_['import_time'] = 'import time';
    const ms = block.getFieldValue('MS') || '0';    
    
    return "time.sleep_ms(" + ms + ")\n";
};


// Generator for 'set angle'
blockly.python.forBlock['servo_set_angle'] = function(block, generator) {
  var varName = generator.getVariableName(block.getFieldValue('SERVO'));
  var angle = generator.valueToCode(block, 'ANGLE', python.Order.ATOMIC) || '90';
  
  return `${varName}.write_angle(${angle})\n`;
};

// Generator for 'continuous run'
blockly.python.forBlock['servo_run_continuous'] = function(block, generator) {
  var varName = generator.getVariableName(block.getFieldValue('SERVO'));
  var speed = generator.valueToCode(block, 'SPEED', python.Order.ATOMIC) || '0';
  
  return `${varName}.run(${speed})\n`;
};


// This tells the Python generator to prefix every block with a print statement
// %1 is a special placeholder that Blockly replaces with the actual Block ID
Blockly.Python.STATEMENT_PREFIX = 'print("DBG:%1")\n';

// Optional: If you want to track variables too, you can use:
Blockly.Python.INDENT = '  '; // Ensure spacing is correct