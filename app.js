// Add this temporarily to the top of app.js

let port;
let isRunning = false;
let isPaused = false;
let currentMode = 'action';
let serialBuffer = "";
let debugInterval = null;
let activeExtensions = [];




const ESP32_PIN_DETAILS = {
    'EN': 'Hardware Reset. Pull to GND to restart the chip.',
    '36': 'ADC1_CH0. Input only. Great for Analog sensors.',
    '39': 'ADC1_CH3. Input only. Low noise Analog input.',
    '34': 'Input only pin. No internal pull-up resistor.',
    '35': 'Input only pin. No internal pull-up resistor.',
    '32': 'ADC1_CH4. Capacitive Touch 9. Supports PWM.',
    '33': 'ADC1_CH5. Capacitive Touch 8. Supports PWM.',
    '25': 'DAC1. Digital-to-Analog Converter. Supports PWM.',
    '0': 'TX0 (Transmit) RX0 (Receive). This pair of pins are used for Serial communication. They can also be used as GPIO pins RX0 is D1 and TX0 is D2. However, using this pair as GPIO pinsmay cause LED flickering during code upload.',
    '3': 'RX0 (Receive). Used for Programming. Connecting sensors here may block you from uploading new code!',
    '2':  'Built-in Blue LED. ADC2_CH2. Touch 2.',
    'GND': 'Ground. Connect to the negative side of your circuit.',
    'VIN': 'Voltage Input. 5V from USB or 3.3V-12V external.',
    '3V3': '3.3V Power Output. Max 600mA limit.',
};



// 1. DEFINE THE BLOCKLY THEME - DARK THEME (Zelos Theme) - You can customize these colors as you like!

  const DarkTheme = Blockly.Theme.defineTheme('dark_theme', {
  'base': Blockly.Themes.Classic,

  'componentStyles': {
    'workspaceBackgroundColour': '#000511f9',
     'toolboxBackgroundColour': '#0b0001d4',
     'toolboxForegroundColour': '#090000',
     'flyoutBackgroundColour': '#3d447bd8',
     'flyoutForegroundColour': '#ccc',
    'insertionMarkerColour': '#803838',
    'insertionMarkerOpacity': 0.3,
    'scrollbarColour': '#797979',
    'scrollbarOpacity': 0.4,
    'cursorColour': '#d0d0d0',  
  },

'categoryStyles': {
    'neopixel_category': { 'colour': '#ff9800' },
    'oled_category': { 'colour': '#00acc1' },
    'servo_category': {'colour': '#03AA74'}
  },


    'blockStyles':{
        'base_start': {
            'hat': 'cap',
        },
        'base_forever': {
            'hat': 'cap',
        },
        'loop_blocks': {
            'colourPrimary': "#00aa00",
            'colourSecondary':"#ff0000",
            'colourTertiary':"#C5EAFF"
        },

        'math_blocks': {
            'colourPrimary': "#9400d3",
            'colourSecondary':"#78589f",
            'colourTertiary':"#C5EAFF"
        },
        
        'logic_blocks': {
            'colourPrimary': "#00a4a6",
            'colourSecondary':"#ac4747",
            'colourTertiary':"#C5EAFF"
        },
        
        'text_blocks': {
            'colourPrimary': "#5ba58c",
            'colourSecondary':"#59907e",
            'colourTertiary':"#C5EAFF"
        },

        'list_blocks': {
            'colourPrimary': "#dc143c",
            'colourSecondary':"#59907e",
            'colourTertiary':"#C5EAFF"
        },
        
        
    },
    'fontStyle': {
        'family': '"JetBrains Mono", monospace', // Your new font
        'weight': '300',                         // Making it thinner
        'size': 12
    },
    'startHats': true
});
  
// A varaibale to define the workspace starter state. Places the On Start and forever blocks on the workspace automatically

    const starterState = {
    "blocks": {
        "languageVersion": 0,
        "blocks": [
        {
            "type": "base_start",
            "x": 100,
            "y": 50
        },
        // {
        //     "type": "base_forever",
        //     "x": 400,
        //     "y": 50
        // }
        ]
    }
};
  
    
 // 5. INITIALIZE CODEMIRROR

var editor = CodeMirror.fromTextArea(document.getElementById("codeTextArea"), {
    mode: "python",
    theme: "material", // This must match the CSS link in your head
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true
}); 


  // 6. INJECT BLOCKLY (With Resizable/Zoom Settings)

  const workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolboxCategories,
    toolboxPosition: 'start',
    horizontalLayout:false,
    theme: DarkTheme, 
    renderer: 'zelos',      // This makes blocks look like Scratch (rounded)
    move: { 
            scrollbars: true, 
            drag: true, 
            wheel: true 
        },       

    
    zoom: { 
        controls: true, 
        wheel: false,
        startScale: 0.9          
    },
    trashcan: true,
    disable: true,
    grid: { spacing: 20, length: 0.5, colour: '#ccc', snap: true }, 
    comments: true,
    collapse: true,
    disable: true,
  });

  Blockly.serialization.workspaces.load(starterState, workspace);


  // Register the "Guard" listener to the workspace
workspace.addChangeListener(limitStartBlocks);


    // 2. Initialize the Backpack
// In the script-tag version, the class is usually found under the plugin name
const backpack = new Backpack(workspace, {
    useFilledBackpackImage: true,
    allowEmptyBackpackOpen: true,
    contextMenu: {
        emptyBackpack: true,
        removeFromBackpack: true,
        copyToBackpack: true,
        copyAllToBackpack: true,
        pasteAllToBackpack: true,
    }
});
    backpack.init();

    
// A function to show esp32 status message

function showDialog(title, message) {
    document.getElementById('dialog-title').innerText = title;
    document.getElementById('dialog-message').innerText = message;
    document.getElementById('ide-dialog-overlay').classList.remove('dialog-hidden');
}

//  A function to close dialog box

function closeDialog() {
    document.getElementById('ide-dialog-overlay').classList.add('dialog-hidden');
}


/* Code to toggle between full screen view and window view */

const fullscreenBtn = document.getElementById('fullscreenBtn');

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        // Enter Fullscreen
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
        document.getElementById('fs-icon').innerText = '❐'; // Change icon to "exit"
    } else {
        // Exit Fullscreen
        document.exitFullscreen();
        document.getElementById('fs-icon').innerText = '⛶'; // Change icon back
    }
});


workspace.addChangeListener((event) => {
    if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
        console.log("🖱️ Toolbox Selected:", event.newItem); // See what name Blockly is sending
        
        if (event.newItem === 'Extensions') {
            workspace.getToolbox().clearSelection();
            openExtensionGallery(); 
        }
    }
});



function setMode(mode) {

    // SHARK GUARD: If code is running, ignore the mode switch request
    if (isRunning) {
        console.warn("🦈 Edusharks: Cannot switch modes while code is running!");
        return; 
    }
    currentMode = mode;
     Blockly.Python.STATEMENT_PREFIX = null;
    // 1. Update Segmented Control UI
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${mode}`).classList.add('active');

    // 2. Element References
    const flashBtn = document.getElementById('flashBtn');
    const debugControls = document.getElementById('debug-controls');
    const runText = document.getElementById('run-text');

    // 3. The Toggle Logic
    if (mode === 'debug') {

        
        
        flashBtn.classList.add('hidden');          // Flash disappears
        debugControls.classList.remove('hidden');   // Debug controls appear
        runText.innerText = "Test";          // Branding update
    } else {
        
        
        flashBtn.classList.remove('hidden');       // Flash reappears
        debugControls.classList.add('hidden');      // Debug controls hide
        runText.innerText = "Run";
        
        // Safety: If they switch to Action while debugging, clear the glow
        if(workspace) workspace.highlightBlock(null);
    }
}




// This function toggles the simulation view, which is currently just a placeholder div. You can expand this to include an actual simulation canvas or iframe in the future.

function toggleSimView() {
    const simCont = document.getElementById('simulation-container');
    const isChecked = document.getElementById('toggleSim').checked;

    if (isChecked) {
        simCont.classList.remove('sim-hidden');
    } else {
        simCont.classList.add('sim-hidden');
    }

    // Force Blockly to recalculate its width since the left margin changed
    setTimeout(() => {
        Blockly.svgResize(workspace);
    }, 300);
}


// Sync icon if user presses 'Esc' key to exit
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.getElementById('fs-icon').innerText = '⛶';
    }
});

// Add this to your workspace setup
workspace.setResizesEnabled(false); // Disables auto-calculation during heavy edits

// Re-enable it only when the window actually resizes
window.addEventListener('resize', () => {
    workspace.setResizesEnabled(true);
    Blockly.svgResize(workspace);
    workspace.setResizesEnabled(false);
});


// A code to run simmulation
function runSimulation() {
    const allBlocks = workspace.getAllBlocks(false);
    const ledBlock = allBlocks.find(b => b.type === 'esp32_led');
    const ledElement = document.getElementById('sim-led');

    if (ledBlock && ledElement) {
        const state = ledBlock.getFieldValue('STATE');
        if (state === '1') {
            ledElement.className = 'led-on';
        } else {
            ledElement.className = 'led-off';
        }
    }
}

// A function to display a welcome message on the console

function displayWelcomeMessage() {
    const term = document.getElementById('terminalOutput');
    if (!term) return;

    // Clear the technical "system dump" from the ESP32
    term.innerText = ""; 

    // Create a stylized Edusharks header
    const welcomeHTML = `

<span style="color: #1d9208; font-size:18; font-weight:400;">  WELCOME TO EDUSHARKS IDE v1.0  </span>

<span style="color: #888;">System: ESP32 MicroPython Ready</span>
<span style="color: #888;">Status: Connected & Synchronized</span>
<span style="color: #c4d447;">Ready to start swimming with code!</span>

`;
    // We use innerHTML here so we can use the colors defined above
    term.innerHTML = welcomeHTML;
}


// Hook it into the workspace change event
workspace.addChangeListener(runSimulation);
// This listener checks if blocks are placed outside of "base_start" or "base_forever" and disables them if so

workspace.addChangeListener(Blockly.Events.disableOrphans);

// 3. Initialize the disable Orphan plugin to clean up the Right-Click menu
const disableTopBlocksPlugin = new DisableTopBlocks();
disableTopBlocksPlugin.init();

// 7. SYNC ENGINE

// This function listens for changes in the Blockly workspace and updates the generated Python code in real-time. It filters out UI-only events to optimize performance and includes error handling to catch any issues during code generation. The generated code is also logged to the console for debugging purposes.

function updateCode(event) {
    // 1. Filter out UI-only events to save memory
    if (event && (event.type == Blockly.Events.UI || event.type == Blockly.Events.CLICK)) {
        return;
    }

    try {
        // 2. Generate Python from the workspace
        const code = Blockly.Python.workspaceToCode(workspace);
        document.getElementById('codeTextArea').value = code;
        
        
        // 3. LOGGING: Open your console (F12) to see this!
        console.log("Blockly generated:", code);

        if (editor) {
            // 4. Push the code to the screen
            editor.setValue(code);
            editor.refresh(); 
        }
        else {
            console.error("CodeMirror Editor not initialized yet!");
        }
    } catch (e) {
        console.error("Sync Error:", e);
    }
}


// Ensure the listener is attached ONLY once
workspace.removeChangeListener(updateCode); // Clear old ones
workspace.addChangeListener(updateCode);    // Add fresh one

// 8. GENERATOR DEFINITIONS (Must be defined before the listener)
Blockly.Python.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.getNextBlock();
    const nextCode = opt_thisOnly ? '' : Blockly.Python.blockToCode(nextBlock);
    if (block.disabled) {
      return '' + nextCode; 
  }
    return code + nextCode;
};

Blockly.Python.forBlock['base_start'] = function(block) {
    let branch = Blockly.Python.statementToCode(block, 'STACK');
    branch = branch.replace(/^  /gm, '');
    return '# --- The Setup Code ---\n\n' + branch;
};

Blockly.Python.forBlock['base_forever'] = function(block) {
    let branch = Blockly.Python.statementToCode(block, 'STACK');
    // Important: Use the INDENT constant for clean Python
    if (!branch) branch = '  pass\n\n';
    return 'while True:\n' + branch;
};

Blockly.Python.forBlock['base_delay'] = function(block) {
  const ms = block.getFieldValue('MS') || '1000';
  Blockly.Python.definitions_['import_time'] = 'import time';
  return 'time.sleep_ms(' + ms + ')\n';
};

// --- 9. INITIALIZE LISTENERS ---


// Handle Window Resize
window.addEventListener('resize', () => {
    Blockly.svgResize(workspace);
}, false);


// --- 10. HARDWARE COMMANDS ---


async function autoConnectCheck() {
    // Get all ports the user has already given permission to
    const authorizedPorts = await navigator.serial.getPorts();
    
    if (authorizedPorts.length > 0) {
        // If we find exactly one known ESP32, just connect silently!
        try {
            await setupESP32Connection(authorizedPorts[0]);
            console.log("Silent reconnect successful.");
        } catch (e) {
            // If it fails (e.g., unplugged), we just wait for the manual click
        }
    }
}


// This function handles the actual "Opening" of the pipe

async function setupESP32Connection(existingPort) {
    try {port = existingPort;
    
    // 1. Open the port
    await port.open({ baudRate: 115200 });

    // setupStreams();
    readFromESP32();

    // WAIT 200ms for the "system dump" to finish, then show our welcome
        setTimeout(() => {
            displayWelcomeMessage();
        }, 200);

        updateConnectionUI(true);
    }

    // 2. Setup the Writer

    catch (err) {
         console.error("Connection failed:", err);
        updateConnectionUI(false);

        const term = document.getElementById('terminalOutput');
        term.innerHTML += `<br><span style="color: #ff5555;">[Error] Connection failed: ${err.message}</span>`;
    }
}   


// This listener catches the ESP32 being plugged back in

navigator.serial.addEventListener('connect', async (event) => {
    console.log("New hardware detected...");

    const detectedPort = event.target;

    try {
        // We TRY to open it silently. 
        // This only works if this specific ESP32 was authorized before.
        await setupESP32Connection(detectedPort);
        // updateConnectionUI(true); 
        
        // If we reach this line, the connection is LIVE.
        console.log("Auto-connection successful!");
        
            updateConnectionStatus(true);
            updateHardwareButtonStates();


    } catch (err) {
        // If we reach here, it's a "New" device that needs permission.
        
        console.warn("New device needs manual authorization.");
        
        // IMPORTANT: Keep UI as "Disconnected" and show a helper dialog
        // updateConnectionUI(false);
        
        showDialog(
            "New Device Detected", 
            "We see a new ESP32! Please click the 'Connect' button to give the IDE permission to use this specific board."
        );
    }
});
    

async function disconnectESP32() {
    if (port) {
        await port.close();
        port = null;
        document.getElementById('connection-led').className = 'led-off';
        document.getElementById('connectBtn1').innerText = "Connect ESP32";
        document.getElementById('connection-led').innerText = "ESP 32 Not Connected";
        
    }
}


// This listener catches physical unplugging events

navigator.serial.addEventListener('disconnect', (event) => {
    const connectBtn1 = document.getElementById('connectBtn1');
    connectBtn1.disabled = false; // Re-enable for the next connection
    connectBtn1.innerText = "Connect ESP32";
    
    document.getElementById('connection-led').className = 'led-off';
    updateConnectionUI(false); 
    port = null;
    espWriter = null;

    isRunning = false;
    const btn = document.getElementById('mainRunBtn');
    btn.classList.remove('stop-style');
    btn.classList.add('run-style');
    document.getElementById('run-icon').innerText = "▶";
    document.getElementById('run-text').innerText = "Run";
});



async function connectESP32() {
    try {
        // This triggers the browser popup (The only part we can't hide)
        const newPort = await navigator.serial.requestPort();
        
        // If the user selects a port, we take over immediately
        await setupESP32Connection(newPort);

        updateHardwareButtonStates(); // Unlock buttons
        updateConnectionStatus(true);
        
        // Success Message in your IDE UI (not console)
        showDialog("Success!", "ESP32 is now synced with Edusharks IDE.");
       

    } catch (err) {
        // We "eat" the console error and show your Dialog instead

        updateConnectionStatus(false);
        updateHardwareButtonStates();

        if (err.name === 'NotFoundError') {
            // User clicked 'Cancel' or no device was plugged in
            showDialog("No Device Selected", "You didn't pick a device! Make sure the ESP32 is plugged in and try again.");
        } 
        else if (err.name === 'SecurityError') {
            showDialog("Security Block", "The browser is blocking the connection. Try clicking the 'Lock' icon next to the URL and allowing Serial ports.");
        }
        else if (err.name === 'NetworkError') {
            showDialog("Port Busy", "The ESP32 is already being used by another program (maybe another tab?). Please close it and try again.");
        }
        // This prevents the "Uncaught (in promise)" red text in the console
    }
}



function processIncomingData(chunk) {
    serialBuffer += chunk;
    
    if (serialBuffer.includes("\n")) {
        let lines = serialBuffer.split("\n");
        serialBuffer = lines.pop();

        lines.forEach(line => {
            const cleanLine = line.trim();

            // 1. CHECK FOR FINISH: Look for the result of the print, not the command
            // We use .includes to handle any hidden characters or prompt marks (>>>)
            if (cleanLine.includes("FINISH_LINE_REACHED") && !cleanLine.includes("print(")) {
                console.log("🏁 Execution Complete.");
                isRunning = false;
                updateButtonUI('run');
                return; // Skip the terminal update for this specific line
            }

            // 2. TERMINAL UPDATE: Only show the line if it's NOT the sentinel command
            if (!cleanLine.includes('print("FINISH_LINE_REACHED")') && cleanLine !== "") {
                updateTerminal(cleanLine);
            }
        });
    }
}

async function readFromESP32() {
    const term = document.getElementById('terminalOutput');
    const decoder = new TextDecoder();

    while (port && port.readable) {
        const reader = port.readable.getReader();
        
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    break};

                // 1. Decode the raw bytes into a string chunk
                const chunk = decoder.decode(value);

                // PASS the data to the brain, don't process it here!
                processIncomingData(chunk);          
                
            }
        } catch (error) {
            console.error("Read Error:", error);
            break; 
        } finally {
            reader.releaseLock();
        }
    }

}


// Toggle Console
function toggleTerminal() {
    const consoleBox = document.getElementById('console-container');
    const isClosing = !consoleBox.classList.contains('console-closed');
    
    if (isClosing) {
        consoleBox.classList.add('console-closed');
        consoleBox.style.height = "0px";
    } else {
        consoleBox.classList.remove('console-closed');
        consoleBox.style.height = "180px"; // Your default open height
        
        // NEW: Check if we need to show the "Waiting" message
        displayIdleMessage();
    }

// Always tell Blockly to resize so blocks don't get cut off
    setTimeout(() => {
        Blockly.svgResize(workspace);
    }, 50);
}


// Resizing Logic

const resizer = document.getElementById('console-resizer');
const consoleBox = document.getElementById('console-container');
const terminal = document.getElementById('terminalOutput');

resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', handleMouseMove);
    });
});



function handleMouseMove(e) {
    const newHeight = window.innerHeight - e.clientY - 35; // 35 is footer height

    if (newHeight > 50 && newHeight < window.innerHeight * 1) {
        const consoleBox = document.getElementById('console-container');
        consoleBox.style.height = newHeight + 'px';
        
        
// CRITICAL: Force Blockly to recalibrate its width/height
        // to match the new space
        if (workspace) {
            Blockly.svgResize(workspace);
        }

    }
}


async function sendConsoleCommand() {
    const input = document.getElementById('console-input');
    const command = input.value;

    // Use 'port' or 'port.writable' as the check   
    if (command && port && port.writable) {
        await sendHardwareCommand(command + '\r\n');
        input.value = ''; 
    }
}

// Allow pressing "Enter" key to send
document.getElementById('console-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendConsoleCommand();
});



// This function toggles between "Debug Mode" (blocks only) and "Action Mode" (blocks + code). 

function toggleMode() {
    const isDebug = document.getElementById('modeToggle').checked;
    
    if (isDebug) {
        // --- DEBUG MODE ---
        // Hide the toolbox flyout and the category menu
        workspace.getToolbox().setVisible(false);
        // Focus the simulation panel if it was collapsed
        if (simPanel.classList.contains('collapsed')) {
            collapseSimulation(); 
        }
    } else {
        // --- ACTION MODE ---
        workspace.getToolbox().setVisible(true);
    }
    
    Blockly.svgResize(workspace);
}



function toggleSimPanel() {
    const sim = document.getElementById('simulation-container');
    const resizer = document.getElementById('sim-resizer'); 
    const isCollapsed = sim.classList.toggle('collapsed');

    // --- ADDED THIS SECTION ---
    const toolboxDiv = document.querySelector('.blocklyToolbox');
    if (toolboxDiv) {
        if (isCollapsed) {
            toolboxDiv.classList.add('toolbox-vertical');
        } else {
            toolboxDiv.classList.remove('toolbox-vertical');
        }
    }
    // ---------------------------

    if (isCollapsed) {
        resizer.style.display = 'none';
    } else {
        setTimeout(() => {
            resizer.style.display = 'block';
        }, 100);
    }
    
    sim.style.width = isCollapsed ? "0px" : "25%";

    let startTime = null;
    const duration = 300; 

    function smoothResize(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        Blockly.svgResize(workspace);

        if (progress < duration) {
            requestAnimationFrame(smoothResize);
        } else {
            Blockly.svgResize(workspace); 
        }
    }

    requestAnimationFrame(smoothResize);
}


// This function updates the simulation view based on the current state of the blocks. For example, if an "LED ON" block is present and set to "ON", it will light up a simulated LED in the UI.

function updateSimulation() {
    const powerLed = document.getElementById('led-power');
    const d2Led = document.getElementById('led-d2');
    
    // Simulate Power ON
    powerLed.classList.add('led-on-red');

    // Logic to check if the 'LED ON' block is in the workspace
    const allBlocks = workspace.getAllBlocks(false);
    const ledBlock = allBlocks.find(b => b.type === 'esp32_led');
    
    if (ledBlock) {
        const state = ledBlock.getFieldValue('STATE');
        if (state === '1') {
            d2Led.classList.add('led-on-blue');
        } else {
            d2Led.classList.remove('led-on-blue');
        }
    }
}

// Attach to Blockly change event
workspace.addChangeListener(updateSimulation);


/******  A FUNCTION THAT OPERATES THE "python-edge-btn" THAT TOGGELS MICRO-PYTHON CODE EDITOR ******/

function toggleCodeOverlay() {
    const container = document.getElementById('overlay-editor-container');
    const overlay = document.getElementById('code-overlay');
    const edgeBtn = document.getElementById('python-edge-btn');
    // const workspaceElement = document.querySelector('.blocklyWidgetDiv'); // Blockly's main layer
    
    overlay.classList.toggle('overlay-hidden');    
    
    if (!overlay.classList.contains('overlay-hidden')) {
        
        edgeBtn.style.right = '40%'; // Matches the width of your container
        // When open, the workspace background
        document.getElementById('blocklyDiv').style.opacity = "1";
        // Force update and refresh when opened
        const code = Blockly.Python.workspaceToCode(workspace);
        editor.setValue(code);
        editor.refresh();
    } else {

        // When closed, the workspace background
        document.getElementById('blocklyDiv').style.opacity = "1";        
        editor.refresh();
        edgeBtn.style.right = '0';
           
    }

}

// A function to display a message while the console button is clicked to open the terminal output and ESP32 is not connected

function displayIdleMessage() {
    const term = document.getElementById('terminalOutput');
    if (!term) return;

    // Only show this if the terminal is actually empty
    // This prevents overwriting existing logs or the ESP32 welcome message
    if (term.innerHTML.trim() === "") {
        term.innerHTML = `
<span style="color: #666;">[System] Edusharks IDE v1.0 is ready.</span>
<span style="color: #c4d447; opacity: 0.7;">Waiting for ESP32 connection via USB...</span>
<span style="color: #444;">--------------------------------------------------</span>
`;
    }
}


async function sendHardwareCommand(command) {
    if (!port || !port.writable) return;
    
    const writer = port.writable.getWriter();
    const encoder = new TextEncoder();
    try {
        await writer.write(encoder.encode(command));
    } finally {
        writer.releaseLock(); // This is the secret to avoiding the Locked error!
    }
}


/**************  RUN MICROPYTHON CODE ON THE ESP32 RAM. WILL RUN TILL THE ESP32 IS POWERED  *************/

async function runCode() {
    Blockly.Python.STATEMENT_PREFIX = null;
    const rawCode = Blockly.Python.workspaceToCode(workspace);
    const sentinel = '\nprint("FINISH_LINE_REACHED")\n';
    const finalCode = rawCode + sentinel;

    isRunning = true; // <--- ADD THIS LINE
    updateButtonUI('stop');

    if (!port || !port.writable) {
        showDialog("Connection Required", "Connect your ESP32 first.");
        return false;
    }

    try {
        // Use Paste Mode (\x05) for reliability
        await sendHardwareCommand('\x03\x03'); // Stop current
        await new Promise(r => setTimeout(r, 300));
        await sendHardwareCommand('\x05');      // Enter Paste
        await sendHardwareCommand(finalCode);   // Send Code
        await sendHardwareCommand('\x04');      // Execute
        
        console.log("🚀 Running in RAM...");
        return true; 
    } catch (e) {
        console.error(e);
        return false;
    }
}


async function stopESP32() {
    try {
        if (debugInterval) clearInterval(debugInterval);
        debugInterval = null;
        if (workspace) workspace.highlightBlock(null);

        await sendHardwareCommand('\x03\x03'); // Force Stop
        
        isRunning = false;
        updateButtonUI('run'); 
        console.log("🛑 Stopped.");
    } catch (e) {
        console.error("Stop failed:", e);
    }
}


/*********************         FLASH MICRO-PYTHON CODE ON TO THE ESP32    **********************/

async function flashCode() {
    if (!port || !port.writable) {
        showDialog("Connection Required", "Connect your ESP32 first!");
        return;
    }

    const code = Blockly.Python.workspaceToCode(workspace);
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter(); // Get a fresh writer

    showLoadingOverlay("Writing to Flash...");

    try {
        // 1. CLEAR THE DECKS: Send Ctrl+C multiple times to stop any running code
        await writer.write(encoder.encode('\x03\x03')); 
        await new Promise(r => setTimeout(r, 500));

        // 2. PREPARE THE SCRIPT
        // We use hex/repr encoding to ensure NO special characters (like quotes) break the string
        const escapedCode = JSON.stringify(code); 
        
        const commands = [
            `f = open('main.py', 'w')`,
            `f.write(${escapedCode})`,
            `f.close()`,
            `import machine`,
            'print("FILE_WRITE_COMPLETE")',
            `machine.soft_reset()`
        ];

        // 3. EXECUTE LINE-BY-LINE
        // This is slower but 100% more reliable than "Paste Mode" for many ESP32 boards
        for (let cmd of commands) {
            await writer.write(encoder.encode(cmd + '\r\n'));
            // Give the ESP32 100ms to process each line and write to flash
            await new Promise(r => setTimeout(r, 100)); 
        }

        showDialog("Flash Success", "Your code is now saved as main.py and will run on boot!");

    } catch (e) {
        console.error("Flash Error:", e);
        showDialog("Flash Error", "Communication failed. Check your USB cable.");
    } finally {
        writer.releaseLock();
        hideLoadingOverlay();
    }
}


// 2. THE DEBUG (SONAR) FUNCTION

function debugCode() {
    // 1. Always use the blocking 'read' prefix
    // This makes the ESP32 wait for 1 character before executing the block
    Blockly.Python.STATEMENT_PREFIX = 'print("DBG:%1")\ntime.sleep_ms(250)\n';

    const code = Blockly.Python.workspaceToCode(workspace);
    const setup = "import sys, machine, time\n";
    
    sendCode(setup + code);

    // 2. Start the Pulse if Auto-Step is checked
    handleAutoStepChange(); 
}

function handleConnectionClick() {
    // Check the current state (you likely have a global variable for this)
    if (isConnected) {
        disconnectESP32();
    } else {
        connectESP32();
    }
}

function updateConnectionUI(isConnected) {
    const btn = document.getElementById('connectBtn1');
    const led = document.getElementById('connection-led');
    const statusText = document.getElementById('footer-status');

    if (isConnected) {
        btn.innerHTML = '<span class="conn-icon">🔌</span> Disconnect';
        btn.classList.add('is-connected');
        statusText.innerText = "Connected via USB";
        statusText.style.color = "#c4d447";
        led.className = 'led-on';
    } else {
        btn.innerHTML = '<span class="conn-icon">🔌</span> USB Connect';
        btn.classList.remove('is-connected');
        statusText.innerText = "ESP32 not Connected";
        statusText.style.color = "#888";
        led.className = 'led-off';
    }
}


async function toggleRunStop() {
    const btn = document.getElementById('mainRunBtn');
    
    // 1. THE DEBOUNCER: Disable the button immediately
    btn.disabled = true;

    try {
        if (!isRunning) {
            // --- SHARK GUARD: EMPTY WORKSPACE CHECK ---
            if (isWorkspaceEmpty()) {
                openSharkDialog({
                    title: "🦈 Empty Workspace",
                    message: "No blocks added to 'on start' or 'forever' blocks. Add some code before running!",
                    confirmText: "Got it!"
                });
                
                // Re-enable button and exit function early
                btn.disabled = false;
                return; 
            }

            // --- ATTEMPT TO START ---
            const success = await runCode(); 
            
            if (success) {
                isRunning = true;
                updateButtonUI('stop');
            }
        } else {
            // --- ATTEMPT TO STOP ---
            await stopESP32();
            isRunning = false;
            updateButtonUI('run');
        }
    } catch (err) {
        console.error("Toggle failed:", err);
    } finally {
        // 2. RE-ENABLE: Turn the button back on after hardware responds.
        // (This won't affect the 'return' above because of how 'finally' works, 
        // but explicit re-enabling in the guard is safer for readability).
        btn.disabled = false;
    }
}


function updateButtonUI(state) {
    const btn = document.getElementById('mainRunBtn');
    const icon = document.getElementById('run-icon');
    const text = document.getElementById('run-text');

    if (state === 'stop') {
        // --- CODE IS STARTING ---
        btn.classList.add('stop-style', 'running-pulse');
        btn.classList.remove('run-style');
        icon.innerText = "⏹";
        text.innerText = "Stop";

        // LOCK the mode toggle buttons
        toggleModeButtons(true); 

    } else {
        // --- CODE IS STOPPED ---
        btn.classList.add('run-style');
        btn.classList.remove('stop-style', 'running-pulse');
        icon.innerText = "▶";
        text.innerText = (currentMode === 'debug') ? " Run" : "Run";

        // UNLOCK the mode toggle buttons
        toggleModeButtons(false); 
    }
}


// The function that downloads main.py to the computer

function downloadCode() {
    const code = Blockly.Python.workspaceToCode(workspace);
    const blob = new Blob([code], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'main.py';
    a.click();
}

function kickstartIDE() {
    console.log("🚀 Kickstarting IDE visuals...");

    // 1. Sync the Python preview with the current blocks
    if (typeof updateCode === "function") {
        updateCode();
    }

    // 2. Refresh the code editor (CodeMirror/Ace) 
    // This fixes "squashed" text or invisible lines on load
    if (typeof editor !== "undefined" && editor.refresh) {
        editor.refresh();
    }

    // 3. Clear any "ghost" block highlights
    if (typeof workspace !== "undefined" && workspace) {
        workspace.highlightBlock(null);
    }
}


async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const reg = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker: Registered successfully!', reg.scope);
        } catch (err) {
            console.warn('⚠️ Service Worker: Registration failed.', err);
        }
    } else {
        console.log('ℹ️ Service Worker: Not supported in this browser.');
    }
}

// THE MASTER BOOT SEQUENCE ---
window.addEventListener('load', async () => {

    console.log("🦈 Edusharks IDE: Commencing Master Boot...");

    // 1. UI FIRST: Set the look and feel
    setMode('action'); 

    // 2. HARDWARE SECOND: Try to find the shark
    // We 'await' this so the connection finishes before the next step
    await autoConnectCheck();

    // 3. OFFLINE THIRD: Register Service Worker
    await registerServiceWorker();

    setupDebugListeners(); // <--- Run the listeners here safely


    updateHardwareButtonStates(); // Start with buttons locked

    // 4. SYNC LAST: Run the "Kickstart"
    kickstartIDE();

    console.log("✅ Boot Sequence Complete.");

});


document.getElementById('pause-btn')?.addEventListener('click', function() {
    isPaused = !isPaused;
    this.innerHTML = isPaused ? "▶ Resume" : "⏸ Pause";
    
    // Send a live command to the ESP32
    const cmd = isPaused ? "_d_pause = True\r\n" : "_d_pause = False\r\n";
    sendHardwareCommand(cmd);
});

document.getElementById('speed-slider').addEventListener('input', function() {
    const val = this.value;
    document.getElementById('speed-value').innerText = val + "ms";
    
    // Update the delay on the ESP32 in real-time!
    sendHardwareCommand(`_d_delay = ${val}\r\n`);
});


// The actual "Pulse" that moves the code forward one block
async function pulseNextBlock() {
    if (!port || !port.writable || isPaused) return;

    const writer = port.writable.getWriter();
    await writer.write(new TextEncoder().encode(" ")); // Send 1 character to unblock sys.stdin.read(1)
    writer.releaseLock();
}

// Logic to start/stop the Auto-Step timer
function handleAutoStepChange() {
    const isAuto = document.getElementById('auto-step-check').checked;
    const speed = document.getElementById('speed-slider').value;

    // Clear any existing timer
    if (debugInterval) clearInterval(debugInterval);

    if (isAuto && isRunning) {
        debugInterval = setInterval(() => {
            pulseNextBlock();
        }, speed);
    }
}

// When the 'Step' button is clicked manually
document.getElementById('step-btn').addEventListener('click', pulseNextBlock);

// When the 'Auto-Step' checkbox is toggled
document.getElementById('auto-step-check').addEventListener('change', handleAutoStepChange);

// When the slider moves, restart the timer with the new speed
document.getElementById('speed-slider').addEventListener('input', (e) => {
    document.getElementById('speed-value').innerText = e.target.value + "ms";
    handleAutoStepChange();
});

function toggleModeButtons(isLocked) {
    const btnAction = document.getElementById('btn-action');
    const btnDebug = document.getElementById('btn-debug');
    
    if (!btnAction || !btnDebug) return;

    if (isLocked) {
        // LOCK: Prevent clicking and show visual "disabled" state
        btnAction.style.pointerEvents = "none";
        btnDebug.style.pointerEvents = "none";
        btnAction.style.opacity = "0.5";
        btnDebug.style.opacity = "0.5";
    } else {
        // UNLOCK: Allow clicking again
        btnAction.style.pointerEvents = "auto";
        btnDebug.style.pointerEvents = "auto";
        btnAction.style.opacity = "1";
        btnDebug.style.opacity = "1";
    }
}

function updateTerminal(message) {
    const term = document.getElementById('terminalOutput');
    if (!term) return;

    // Append the new message with a line break
    term.innerText += message + "\n";

    // Auto-scroll to the bottom so students see the latest data
    const consoleBox = document.getElementById('console-container');
    if (consoleBox) {
        consoleBox.scrollTop = consoleBox.scrollHeight;
    }
}

function setupDebugListeners() {
    console.log("🛠 Setting up Debug Controls...");

    document.getElementById('pause-btn')?.addEventListener('click', function() {
        isPaused = !isPaused;
        this.innerHTML = isPaused ? "▶ Resume" : "⏸ Pause";
        sendHardwareCommand(isPaused ? "_d_pause = True\r\n" : "_d_pause = False\r\n");
    });

    document.getElementById('step-btn')?.addEventListener('click', pulseNextBlock);

    document.getElementById('speed-slider')?.addEventListener('input', (e) => {
        const val = e.target.value;
        const label = document.getElementById('speed-value');
        if (label) label.innerText = val + "ms";
        sendHardwareCommand(`_d_delay = ${val}\r\n`);
        handleAutoStepChange();
    });

    document.getElementById('auto-step-check')?.addEventListener('change', handleAutoStepChange);
}

// --- SHARK-PROOF LISTENERS ---
// We check if the element exists before adding the listener to prevent the "Null" error

const pauseBtn = document.getElementById('pause-btn');
if (pauseBtn) {
    pauseBtn.addEventListener('click', function() {
        isPaused = !isPaused;
        this.innerHTML = isPaused ? "▶ Resume" : "⏸ Pause";
        sendHardwareCommand(isPaused ? "_d_pause = True\r\n" : "_d_pause = False\r\n");
    });
}

const speedSlider = document.getElementById('speed-slider');
if (speedSlider) {
    speedSlider.addEventListener('input', function() {
        const val = this.value;
        document.getElementById('speed-value').innerText = val + "ms";
        sendHardwareCommand(`_d_delay = ${val}\r\n`);
    });
}

const stepBtn = document.getElementById('step-btn');
if (stepBtn) {
    stepBtn.addEventListener('click', pulseNextBlock);
}

const autoStepCheck = document.getElementById('auto-step-check');
if (autoStepCheck) {
    autoStepCheck.addEventListener('change', handleAutoStepChange);
}


/**
 * EDUSHARKS IDE - Notification System
 * Creates a custom toast message on the screen.
 * @param {string} message - The text to display.
 * @param {string} type - 'info' (blue) or 'error' (red).
 */
function showToast(message, type = 'info') {
    // 1. Get or create the container
    let container = document.getElementById('edusharks-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'edusharks-toast-container';
        document.body.appendChild(container);
    }
    
    // 2. Create the toast element
    const toast = document.createElement('div');
    toast.className = `edusharks-toast ${type === 'error' ? 'error' : ''}`;
    toast.innerText = message;
    
    // 3. Add to screen
    container.appendChild(toast);
    
    // 4. Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                container.removeChild(toast);
            }
        }, 500);
    }, 2500);
}

    
/**
 * EDUSHARKS IDE - Logic Guard with Delay
 * Prevents users from adding more than one "Start" block with a visual delay.
 */

function limitStartBlocks(event) {
    // Trigger when a block is created or moved into the workspace
    if (event.type === Blockly.Events.BLOCK_CREATE || event.type === Blockly.Events.BLOCK_MOVE) {
        
        const workspace = Blockly.getMainWorkspace();
        const startBlocks = workspace.getBlocksByType('base_start');

        if (startBlocks.length > 1) {
            // Find the specific block that triggered the event
            const newBlock = workspace.getBlockById(event.blockId);
            
            if (newBlock) {
                // ADDED: Delay the removal so the user sees what happened
                setTimeout(() => {
                    // 1. Remove the extra block
                    newBlock.dispose();

                    // 2. Trigger the notification
                    showToast('⚠️ \n\n Only one \n\n "On Start" \n \n block allowed! \n\n', 'error');
                }, 1000); // 1000 milliseconds = 1 second
            }
        }
    }
}


function updateConnectionStatus(isConnected) {
    const statusLabel = document.getElementById('connection-status');
    const connectBtn = document.getElementById('connectBtn1');

    if (statusLabel) {
        statusLabel.innerText = isConnected ? "ESP32 Connected" : "ESP32 not connected";
        statusLabel.style.color = isConnected ? "#1d9208" : "#ff4444"; // Shark Green vs Red
    }

    if (connectBtn) {
        connectBtn.innerHTML = isConnected ? 
            '<span class="conn-icon">✅</span> Connected' : 
            '<span class="conn-icon">🔌</span> USB Connect';
    }
}


function updateHardwareButtonStates() {
    const runBtn = document.getElementById('mainRunBtn');
    const flashBtn = document.getElementById('flashBtn');
    
    // If port is defined and open, enable buttons. Otherwise, disable.
    const isConnected = (port && port.readable);

    if (runBtn) runBtn.disabled = !isConnected;
    if (flashBtn) flashBtn.disabled = !isConnected;

    console.log(`🔌 Hardware Buttons ${isConnected ? 'Enabled' : 'Disabled'}`);
}


navigator.serial.addEventListener('disconnect', () => {
    console.log("⚠️ Device unplugged");
    port = null;
    updateConnectionStatus(false);
    updateHardwareButtonStates();
});


function openExtensionGallery() {
    let galleryHtml = `<div class="extension-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; padding:10px;">`;
    
    // We loop through our available list (NeoPixel, OLED, etc.)
    const available = [
        { id: 'neopixel', name: 'NeoPixel', icon: '🌈', color: '#ff9800' },
        { id: 'oled', name: 'OLED', icon: '🖥️', color: '#00acc1' },
        { id: 'servo', name: 'Servo', icon: '🖥️', color: '#73c535' },
    ];

    available.forEach(ext => {
        const isInstalled = activeExtensions.includes(ext.id);
        
        galleryHtml += `
            <div class="ext-card" style="background:#1a1f2e; padding:20px; border-radius:12px; border: 2px solid ${isInstalled ? ext.color : '#333'}; text-align:center; transition: 0.3s;">
                <div style="font-size:40px; margin-bottom:10px;">${ext.icon}</div>
                <div style="color:white; font-weight:bold; font-size:16px; margin-bottom:15px;">${ext.name}</div>
                
                <button 
                    onclick="${isInstalled ? `handleRemove('${ext.id}')` : `handleInstall('${ext.id}')`}" 
                    style="width:100%; padding:10px; border-radius:6px; cursor:pointer; font-weight:bold; border:none; 
                           background-color: ${isInstalled ? '#ff4444' : '#1d9208'}; 
                           color: white;">
                    ${isInstalled ? 'Remove Extension' : 'Add Extension'}
                </button>
            </div>
        `;
    });

    galleryHtml += `</div>`;

    openSharkDialog({
        title: "🧩 Extension Gallery",
        message: "Add hardware modules to your project:",
        customHtml: galleryHtml,
        confirmText: "Close"
    });
}


// 1. INSTALL
function handleInstall(extId) {
    if (activeExtensions.includes(extId)) return;
    
    activeExtensions.push(extId);
    const newCategory = getExtensionCategoryDefinition(extId);
    let toolboxJson = workspace.options.languageTree;

    // Find "Advanced" to insert before it
    const advancedIndex = toolboxJson.contents.findIndex(c => c.name === 'Advanced');
    if (advancedIndex !== 0) {
        toolboxJson.contents.splice(advancedIndex, 0, newCategory);
    } 
    else {
        toolboxJson.contents.push(newCategory);
    }

    workspace.updateToolbox(toolboxJson);
    openExtensionGallery(); // REFRESH THE UI
}

// 2. REMOVE
function handleRemove(extId) {
    activeExtensions = activeExtensions.filter(id => id !== extId);
    
    let toolboxJson = workspace.options.languageTree;
    const definition = getExtensionCategoryDefinition(extId);

    // Filter out the category that matches the extension name
    toolboxJson.contents = toolboxJson.contents.filter(cat => cat.name !== definition.name);

    workspace.updateToolbox(toolboxJson);
    openExtensionGallery(); // REFRESH THE UI
}



function getExtensionCategoryDefinition(id) {
    const definitions = {
        'neopixel': {
            kind: 'category',
            name: 'NeoPixel',
            // Using a style name or a hex color
            categorystyle: 'neopixel_category', 
            cssConfig: {
                "container": 'extension-cat-container',
                "row": 'blocklyTreeRow', // Standard Blockly row class
                "icon": 'customIconNeoPixel', // The CSS class for the icon
                "label": 'neopixel-label'
            },
            contents: [
                { kind: 'block', type: 'neopixel_setup' },
                { kind: 'block', type: 'neopixel_set_color' },
                { kind: 'block', type: 'neopixel_show' },
                { kind: 'block', type: 'neopixel_clear' }
            ]
        },
        'oled': {
            kind: 'category',
            name: 'OLED',
            categorystyle: 'oled_category',
            cssConfig: {
                "container": 'extension-cat-container',
                "row": 'blocklyTreeRow',
                "icon": 'customIconOLED',
                "label": 'oled-label'
            },
            contents: [
                { kind: 'block', type: 'oled_setup' },
                { kind: 'block', type: 'oled_print' },
                { kind: 'block', type: 'oled_clear' }
            ]
        },

        'servo' : {
          kind: 'category',
          name: 'Servo',
          categorystyle: 'servo_category',
          cssConfig: {
                "container": 'extension-cat-container',
                "row": 'blocklyTreeRow',
                "icon": 'customIconServo',
                "label": 'servo-label'
            },
          colour: "#03AA74",
          contents: [
            { kind: "block", type: "servo_set_angle" },
            { kind: "block", type: "servo_run_continuous" }
          ]
        }
    };
    return definitions[id];
}


// The Master Dialog Opener
function openSharkDialog(config) {
    console.log("🛠️ Attempting to open Shark Dialog...");
    
    const overlay = document.getElementById('shark-dialog-overlay');
    if (!overlay) {
        console.error("❌ ERROR: Could not find #shark-dialog-overlay in index.html");
        return;
    }

    document.getElementById('shark-dialog-title').innerText = config.title || "Alert";
    document.getElementById('shark-dialog-custom-content').innerHTML = config.customHtml || "";
    
    
    const confirmBtn = document.getElementById('shark-dialog-confirm-btn');
    confirmBtn.innerText = config.confirmText || "Confirm";
    confirmBtn.onclick = () => {
        if (config.onConfirm) config.onConfirm();
        closeSharkDialog();
    };

    overlay.classList.remove('dialog-hidden');
    console.log("✅ Dialog should now be visible.");
}

function closeSharkDialog() {
    document.getElementById('shark-dialog-overlay').classList.add('dialog-hidden');
}


function isWorkspaceEmpty() {
    const topBlocks = workspace.getTopBlocks(false);
    
    // 1. If there are literally no blocks on the screen, it's empty
    if (topBlocks.length === 0) return true;

    let hasUserCode = false;

    for (let block of topBlocks) {
        // 2. Check the Start and Forever containers
        if (block.type === 'base_start' || block.type === 'base_forever') {
            
            // Look through the block's inputs (the "mouth" of the C-shape)
            for (let input of block.inputList) {
                // If there's a connection and it has a "target block" attached
                if (input.connection && input.connection.targetBlock()) {
                    hasUserCode = true;
                    break;
                }
            }
        } else {
            // 3. If the student put a stray block (like a pin write) 
            // floating outside of Start/Forever, we consider the workspace "not empty"
            hasUserCode = true;
        }
        
        if (hasUserCode) break;
    }

    return !hasUserCode;
}


// 1. Create the popup element once when the app starts
const createHoverPopup = () => {
    if (document.getElementById('pin-hover-popup')) return;
    const popup = document.createElement('div');
    popup.id = 'pin-hover-popup';
    document.body.appendChild(popup);
};


// EVENT LISTNER - MOUSE MOVE TRACKING FOR POP UP INSIDE PIN SELECTOR DROPDOWN GRID

let hoverTimeout; // Variable to hold our timer
const HOVER_DELAY = 100; // 500ms (half a second) - Adjust this as you like!

document.addEventListener('mousemove', (e) => {

    const popup = document.getElementById('pin-hover-popup');
    const dropDownDiv = document.querySelector('.blocklyDropDownDiv');

    // If the popup doesn't exist, info is toggled off, OR the dropdown is closed...
    if (!popup || !dropDownDiv) {
        if (popup) popup.style.display = 'none';
        clearTimeout(hoverTimeout);
        return;
    }

    const item = e.target.closest('.blocklyFieldGridItem');
    
    if (item) {

        if (popup.style.display === 'block') {
            updatePopupPosition(e, popup, dropDownDiv);
            return;
        }

        // Clear any existing timer so we don't get multiple popups
        clearTimeout(hoverTimeout);

        // Start a new timer
        hoverTimeout = setTimeout(() => {
            const pinLabel = item.innerText;
            const pinValue = pinLabel.replace(/\D/g, "");
            const systemKey = pinLabel.includes("GND") ? "GND" : 
                              pinLabel.includes("VIN") ? "VIN" : 
                              pinLabel.includes("3V3") ? "3V3" : 
                              pinLabel.includes("RST") || pinLabel.includes("EN") ? "EN" : 
                              pinValue;

            const info = ESP32_PIN_DETAILS[systemKey] || `Standard GPIO Pin ${pinValue}`;
            
            popup.innerHTML = `
                <div class="popup-header">${pinLabel}</div>
                <div class="popup-body">${info}</div>
            `;
            
            popup.style.display = 'block';
            // popup.dataset.currentPin = pinLabel; // Mark which pin we are showing

            updatePopupPosition(e, popup, dropDownDiv);

        }, HOVER_DELAY);
    } 
    
    else {
        // We aren't over a pin at all - Hide and Clear
        clearTimeout(hoverTimeout);
        popup.style.display = 'none';        
    }
});

/**
 * Calculates whether to show the popup on the left or right of the cursor
 */
function updatePopupPosition(e, popup, dropDownDiv) {
    const dropDownRect = dropDownDiv.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    
    // Find the horizontal center of the dropdown grid
    const dropDownCenter = dropDownRect.left + (dropDownRect.width / 2);

    let finalLeft;

    if (e.clientX > dropDownCenter) {
        // --- RIGHT SIDE PINS: Show popup on the LEFT ---
        // Mouse X - Popup Width - Gap
        finalLeft = e.clientX - popupRect.width - 20;
    } else {
        // --- LEFT SIDE PINS: Show popup on the RIGHT ---
        // Mouse X + Gap
        finalLeft = e.clientX + 20;
    }

    popup.style.left = finalLeft + 'px';
    popup.style.top = (e.clientY + 10) + 'px';
}


// Run the creation on startup
createHoverPopup();


// 1. Capture the original Blockly hide function
const originalBlocklyHide = Blockly.DropDownDiv.hide;

// 2. Create our own version that hides the popup too
Blockly.DropDownDiv.hide = function() {
    // Call the original function so Blockly still works perfectly
    originalBlocklyHide.apply(this, arguments);

    // Shark Cleanup: Find the popup and hide it immediately
    const popup = document.getElementById('pin-hover-popup');
    if (popup) {
        popup.style.display = 'none';
        popup.dataset.currentPin = ""; // Reset the tracker
    }

    // Crucial: Clear the timer so a popup doesn't "ghost" in 
    // half a second after the menu is already gone!
    if (typeof hoverTimeout !== 'undefined') {
        clearTimeout(hoverTimeout);
    }
};

document.addEventListener('mousedown', (e) => {

    // If the click happened on the resizer, do nothing and exit
    
    if (e.target.id === 'resizer' || e.target.closest('#resizer')) {
        return;
    }

    if (e.target.closest('.blocklyFieldGridItem')) {
        const popup = document.getElementById('pin-hover-popup');
        if (popup) popup.style.display = 'none';
        clearTimeout(hoverTimeout);
    }
});


// /**********************************************************************************************************/
// /*                                       SIMULATOR JS CODE                                                */
// /**********************************************************************************************************/

// const svg = document.getElementById('esp32-svg');
// const wireHolder = document.getElementById('wire-holder');
// let activeWire = null;
// let startPin = null;

// /**
//  * THE TRANSLATOR 🦈
//  * Converts mouse screen coordinates into the SVG's 0-350 coordinate system.
//  */
// function getSVGCoords(e) {
//     const pt = svg.createSVGPoint();
//     pt.x = e.clientX;
//     pt.y = e.clientY;
//     // This is the magic line that accounts for zooming/scaling
//     return pt.matrixTransform(svg.getScreenCTM().inverse());
// }

// svg.addEventListener('mousedown', (e) => {
//     const pin = e.target.closest('.pin-contact');
//     if (!pin) return;

//     // Start drawing
//     startPin = pin;
//     const coords = { x: pin.getAttribute('cx'), y: pin.getAttribute('cy') };

//     activeWire = document.createElementNS("http://www.w3.org/2000/svg", "path");
//     activeWire.setAttribute("class", "jumper-wire");
//     activeWire.setAttribute("stroke", "#15D0AC"); // Shark Cyan
//     activeWire.setAttribute("stroke-width", "3");
//     activeWire.setAttribute("fill", "none");
    
//     // Initial path: Start and End at the same point
//     const d = `M ${coords.x} ${coords.y} C ${coords.x} ${coords.y}, ${coords.x} ${coords.y}, ${coords.x} ${coords.y}`;
//     activeWire.setAttribute("d", d);
    
//     wireHolder.appendChild(activeWire);
// });

// window.addEventListener('mousemove', (e) => {
//     if (!activeWire) return;

//     const mouse = getSVGCoords(e);
//     const sX = parseFloat(startPin.getAttribute('cx'));
//     const sY = parseFloat(startPin.getAttribute('cy'));

//     // BÉZIER MATH: Offset control points horizontally for a "natural wire" look
//     const curveIntensity = 40; 
//     const cp1x = sX + (mouse.x > sX ? curveIntensity : -curveIntensity);
//     const cp2x = mouse.x + (mouse.x > sX ? -curveIntensity : curveIntensity);

//     const d = `M ${sX} ${sY} C ${cp1x} ${sY}, ${cp2x} ${mouse.y}, ${mouse.x} ${mouse.y}`;
//     activeWire.setAttribute("d", d);
// });


// window.addEventListener('mouseup', (e) => {
//     if (!activeWire) return;

//     const endPin = e.target.closest('.pin-contact');
    
//     // Cancel if not dropped on a different pin
//     if (!endPin || endPin === startPin) {
//         activeWire.remove();
//     } else {
//         // SNAP: Lock the wire to the center of the target pin
//         const sX = startPin.getAttribute('cx');
//         const sY = startPin.getAttribute('cy');
//         const eX = endPin.getAttribute('cx');
//         const eY = endPin.getAttribute('cy');
        
//         const cp1x = parseFloat(sX) + (eX > sX ? 40 : -40);
//         const cp2x = parseFloat(eX) + (eX > sX ? -40 : 40);
        
//         const d = `M ${sX} ${sY} C ${cp1x} ${sY}, ${cp2x} ${eY}, ${eX} ${eY}`;
//         activeWire.setAttribute("d", d);

//         // Add delete functionality
//         activeWire.addEventListener('dblclick', function() { this.remove(); });
        
//         console.log(`Reserved: ${startPin.id} <-> ${endPin.id}`);
//     }

//     activeWire = null;
//     startPin = null;
// });


// /*   +++++++++++++++++++++++++   FULL SCREEN SIMULATOR VIEW   ++++++++++++++++++++++++++++ */

// const simCanvas = document.getElementById('sim-canvas');
// const fsBtn = document.getElementById('fullscreen-btn');

// fsBtn.addEventListener('click', () => {
//     if (!document.fullscreenElement) {
//         // Enter Full Screen
//         if (simCanvas.requestFullscreen) {
//             simCanvas.requestFullscreen();
//         } else if (simCanvas.webkitRequestFullscreen) { /* Safari */
//             simCanvas.webkitRequestFullscreen();
//         }
//         fsBtn.innerText = "✕ Exit Full Screen";
//     } else {
//         // Exit Full Screen
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         }
//         fsBtn.innerText = "⛶ Full Screen";
//     }
// });

// // Update the coordinate math if the window resizes
// window.addEventListener('resize', () => {
//     // This forces the SVG to recalculate its positions 
//     // for the wire-drawing logic we wrote earlier.
// });


// /**************************************************************************************************** */
// /*                                     SIMULATOR AREA VIEW AND PAN ENGINE                             */
// /**************************************************************************************************** */

// const viewport = document.getElementById('viewport');
// let scale = 1;
// let pointX = 0;
// let pointY = 0;
// let startPan = { x: 0, y: 0 };
// let isPanning = false;

// // 1. THE ZOOM (Mouse Wheel)
// svg.addEventListener('wheel', (e) => {
//     e.preventDefault();
    
//     const zoomSpeed = 0.001;
//     const delta = -e.deltaY;
//     const factor = Math.pow(1.1, delta / 100); // Smooth exponential zoom
    
//     const newScale = scale * factor;
    
//     // Optional: Limit zoom levels
//     if (newScale > 0.3 && newScale < 5) {
//         // Zoom towards mouse position
//         const mouse = getSVGCoords(e.clientX, e.clientY);
//         pointX -= (mouse.x - pointX) * (factor - 1);
//         pointY -= (mouse.y - pointY) * (factor - 1);
//         scale = newScale;
//         updateViewport();
//     }
// }, { passive: false });

// // 2. THE PAN (Click & Drag Background)
// svg.addEventListener('mousedown', (e) => {
//     // Only pan if clicking the SVG background, NOT a pin
//     if (e.target.id === 'esp32-svg' || e.target.id === 'viewport') {
//         isPanning = true;
//         svg.style.cursor = 'grabbing';
//         startPan = { x: e.clientX - pointX, y: e.clientY - pointY };
//         e.stopImmediatePropagation(); // Prevent wire-drawing from starting
//     }
// }, true); // Capture phase is important!

// window.addEventListener('mousemove', (e) => {
//     if (!isPanning) return;
    
//     pointX = e.clientX - startPan.x;
//     pointY = e.clientY - startPan.y;
//     updateViewport();
// });

// window.addEventListener('mouseup', () => {
//     isPanning = false;
//     svg.style.cursor = 'grab';
// });

// // 3. APPLY TRANSFORM
// function updateViewport() {
//     viewport.setAttribute('transform', `translate(${pointX}, ${pointY}) scale(${scale})`);
// }


