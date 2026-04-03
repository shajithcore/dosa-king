/* This file stores the MicroPython code generators for all the Blocks in the IDE */



// 2. CONTROL BLOCKS
// Use 'forBlock' instead of the direct array access
// Blockly.Python.forBlock['base_start'] = function(block) {
//   const branch = Blockly.Python.statementToCode(block, 'SUBSTACK') || 
//                  Blockly.Python.statementToCode(block, 'STACK');
//   return '# --- Setup ---\n' + branch;
// };

// Blockly.Python.forBlock['base_forever'] = function(block) {
//   let branch = Blockly.Python.statementToCode(block, 'SUBSTACK') || 
//                Blockly.Python.statementToCode(block, 'STACK');
//   if (!branch) branch = '  pass\n';
//   return 'while True:\n' + branch;
// };

// 3. HARDWARE BLOCKS
Blockly.Python.forBlock['esp32_led'] = function(block) {
    console.log("Generating: esp32_led");
    var dropdown_state = block.getFieldValue('ESP32_LED');
    Blockly.Python.definitions_['import_machine'] = 'import machine';
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
    const ms = block.getFieldValue('MS') || '0';
    
    // Ensures 'import time' is at the top of your MicroPython script
    Blockly.Python.definitions_['import_time'] = 'import time';
    
    return "time.sleep_ms(" + ms + ")\n";
};


// This tells the Python generator to prefix every block with a print statement
// %1 is a special placeholder that Blockly replaces with the actual Block ID
Blockly.Python.STATEMENT_PREFIX = 'print("DBG:%1")\n';

// Optional: If you want to track variables too, you can use:
//  Blockly.Python.INDENT = '  '; // Ensure spacing is correct