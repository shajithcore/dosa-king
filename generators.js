/* This file stores the MicroPython code generators for all the Blocks in the IDE */

// 3. HARDWARE BLOCKS
Blockly.Python.forBlock['esp32_led'] = function(block) {
    Blockly.Python.definitions_['import_machine'] = 'import machine';
    console.log("Generating: esp32_led");
    var dropdown_state = block.getFieldValue('ESP32_LED');
    
    return 'machine.Pin(2, machine.Pin.OUT).value(' + dropdown_state + ')\n';
};

// 4. SENSOR BLOCKS (Returning Tuples for expressions)
Blockly.Python.forBlock['sensor_ultrasonic'] = function(block) {
    Blockly.Python.definitions_['import_hcsr04'] = 'from hcsr04 import HCSR04';
    var trig = block.getFieldValue('TRIG');
    var echo = block.getFieldValue('ECHO');
    var code = 'HCSR04(trigger_pin=' + trig + ', echo_pin=' + echo + ').distance_cm()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['sensor_dht11'] = function(block) {
    Blockly.Python.definitions_['import_dht'] = 'import dht';
    Blockly.Python.definitions_['import_machine'] = 'import machine';
    var pin = block.getFieldValue('PIN');
    var type = block.getFieldValue('TYPE');
    var sensorName = 'dht' + pin;
    Blockly.Python.definitions_['init_dht' + pin] = sensorName + ' = dht.DHT11(machine.Pin(' + pin + '))';
    var code = sensorName + '.' + (type === 'temp' ? 'temperature()' : 'humidity()');
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.forBlock['sensor_ldr'] = function(block) {
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
Blockly.Python.forBlock['servo_set_angle'] = function(block) {
  var varName = block.getVariableName(block.getFieldValue('SERVO'));
  var angle = block.valueToCode(block, 'ANGLE', python.Order.ATOMIC) || '90';
  
  return `${varName}.write_angle(${angle})\n`;
};

// Generator for 'continuous run'
Blockly.Python.forBlock['servo_run_continuous'] = function(block) {
  var varName = block.getVariableName(block.getFieldValue('SERVO'));
  var speed = block.valueToCode(block, 'SPEED', python.Order.ATOMIC) || '0';
  
  return `${varName}.run(${speed})\n`;
};


// Generator for Internal Temperature
Blockly.Python.forBlock['esp32_internal_temp'] = function(block) {  
  // This line ensures 'import esp32' is added to the top of the file
  Blockly.Python.definitions_['import_esp32'] = 'import esp32';
  
  // Formula to convert Fahrenheit to Celsius
  var code = 'esp32.raw_temperature()';
  return [code, Blockly.Python.ORDER_NONE];
};


// Digital Write logic
Blockly.Python.forBlock['pin_digital_write'] = function(block) {
  Blockly.Python.definitions_['import_machine'] = 'import machine';
  var pin = block.getFieldValue('PIN');
  var state = block.getFieldValue('STATE');
  return 'machine.Pin(' + pin + ', machine.Pin.OUT).value(' + state + ')\n';
};

// Digital Read logic
Blockly.Python.forBlock['pin_digital_read'] = function(block) {
  Blockly.Python.definitions_['import_machine'] = 'import machine';
  var pin = block.getFieldValue('PIN');
  var code = 'machine.Pin(' + pin + ', machine.Pin.IN).value()';
  return [code, Blockly.Python.ORDER_NONE];
};

// Analog Read logic (0-4095 range)
Blockly.Python.forBlock['pin_analog_read'] = function(block) {
  Blockly.Python.definitions_['import_machine'] = 'import machine';
  var pin = block.getFieldValue('PIN');
  var code = 'machine.ADC(machine.Pin(' + pin + ')).read()';
  return [code, Blockly.Python.ORDER_NONE];
};

// PWM logic
Blockly.Python.forBlock['pin_pwm_write'] = function(block) {
  Blockly.Python.definitions_['import_machine'] = 'import machine';
  var pin = block.getFieldValue('PIN');
  var duty = Blockly.Python.valueToCode(block, 'DUTY', Blockly.Python.ORDER_ATOMIC) || '0';
  return 'machine.PWM(machine.Pin(' + pin + ')).duty(' + duty + ')\n';
};


// This tells the Python generator to prefix every block with a print statement
// %1 is a special placeholder that Blockly replaces with the actual Block ID
Blockly.Python.STATEMENT_PREFIX = 'print("DBG:%1")\n';

// Optional: If you want to track variables too, you can use:
Blockly.Python.INDENT = '  '; // Ensure spacing is correct