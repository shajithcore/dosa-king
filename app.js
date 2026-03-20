
  // Add this temporarily to the top of app.js

  let port;
  let espWriter; // Declare it here at the top!
  

  const DarkTheme = Blockly.Theme.defineTheme('dark_theme', {
  'base': Blockly.Themes.Classic,
  'categoryStyles':{
    // 'controls_category': { 'colour': '#223fe6' },
    // 'logic_category': { 'colour': '#43bf57' },
    // 'loop_category': { 'colour': '#892d86' },
    // 'math_category': { 'colour': '#5b67a5' },
    // 'variables_category': { 'colour': '#a55b80' },
    // 'sensors_category': { 'colour': '160' },
    // 'hardware_category': { 'colour': '#0e434e' },

  },

  'componentStyles': {
    'workspaceBackgroundColour': '#000511f9',
     'toolboxBackgroundColour': '#060606',
     'toolboxForegroundColour': '#090000',
     'flyoutBackgroundColour': '#3d447b8c',
     'flyoutForegroundColour': '#ccc',
    'insertionMarkerColour': '#803838',
    'insertionMarkerOpacity': 0.3,
    'scrollbarColour': '#797979',
    'scrollbarOpacity': 0.9,
    'cursorColour': '#d0d0d0',  
  },
    'blockStyles':{
        'base_start': {
            'hat': 'cap',
        },
        'base_forever': {
            'hat': 'cap',
        },
        'loop_blocks': {
            'colourPrimary': "#892d86",
            'colourSecondary':"#ff0000",
            'colourTertiary':"#C5EAFF"
        },
        
    },
    'fontStyle': {},
    'startHats': true
});
  

    const starterState = {
    "blocks": {
        "languageVersion": 0,
        "blocks": [
        {
            "type": "base_start",
            "x": 100,
            "y": 50
        },
        {
            "type": "base_forever",
            "x": 400,
            "y": 50
        }
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
    theme: DarkTheme, // This changes the "Thanos" / Dark look
    renderer: 'zelos',          // This makes blocks look like Scratch (rounded)
    move: { 
        scrollbars: {
            horizontal: true,
            vertical: true 
        },       
        drag: true, 
        wheel: true 
    },
    zoom: { 
        controls: true, 
        wheel: true,
        startScale: 0.9          
    },
    trashcan: true,
    disable: true,
    grid: { spacing: 20, length: 0.5, colour: '#ccc', snap: true },    
    horizontalLayout: false,
    toolboxPosition: 'start',
    comments: true,
    collapse: true,
    disable: true,
  });

  Blockly.serialization.workspaces.load(starterState, workspace);


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


// A function that operates a mode switch toggle for action and debug mode

function setMode(mode) {
    const btnAction = document.getElementById('btn-action');
    const btnDebug = document.getElementById('btn-debug');
    
    if (mode === 'debug') {
        // UI Update
        btnDebug.classList.add('active');
        btnAction.classList.remove('active');
        
        // IDE Logic: Hide Toolbox
        workspace.getToolbox().setVisible(false);
        // If simulation panel is hidden, you might want to show it here
    } else {
        // UI Update
        btnAction.classList.add('active');
        btnDebug.classList.remove('active');
        
        // IDE Logic: Show Toolbox
        workspace.getToolbox().setVisible(true);
    }
    
    // Always trigger a resize so Blockly fills the new space
    Blockly.svgResize(workspace);
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

// Run this when the IDE starts
window.addEventListener('load', autoConnectCheck);


// This listener catches the ESP32 being plugged back in

navigator.serial.addEventListener('connect', async (event) => {
    console.log("New hardware detected...");
    
    const detectedPort = event.target;

    try {
        // We TRY to open it silently. 
        // This only works if this specific ESP32 was authorized before.
        await setupESP32Connection(detectedPort);
        
        // If we reach this line, the connection is LIVE.
        console.log("Auto-connection successful!");
    } catch (err) {
        // If we reach here, it's a "New" device that needs permission.
        console.warn("New device needs manual authorization.");
        
        // IMPORTANT: Keep UI as "Disconnected" and show a helper dialog
        updateConnectionUI(false); 
        
        showDialog(
            "New Device Detected", 
            "We see a new ESP32! Please click the 'Connect' button to give the IDE permission to use this specific board."
        );
    }
});

// This function handles the actual "Opening" of the pipe

async function setupESP32Connection(existingPort) {
    port = existingPort;
    
    // 1. Open the port
    await port.open({ baudRate: 115200 });

    // 2. Setup the Writer
    const encoder = new TextEncoderStream();
    encoder.readable.pipeTo(port.writable);
    espWriter = encoder.writable.getWriter();

    // 3. Setup the Terminal Reader
    readFromESP32();

    // 4. Update UI
    document.getElementById('connection-led').className = 'led-on';
    document.getElementById('connectBtn').innerText = "Connected";
    connectBtn.disabled = true; // This prevents the second click and the "Red LED" reset
    document.getElementById('uploadBtn').disabled = false;
    document.getElementById('stopBtn').disabled = false;
    document.getElementById('connection-led').className = 'led-on';
}


// check for "already authorized" devices when the page loads

window.addEventListener('load', async () => {
    // Check if we already have permission for any ports
    const ports = await navigator.serial.getPorts();
    
    if (ports.length > 0) {
        console.log("Found an authorized ESP32. Ready for auto-connect.");
        // We don't auto-open here (security often blocks it), 
        // but the 'connect' listener above will now work instantly!
    }
});


// The Nav LED to turn off when the user manually stops the connection

async function disconnectESP32() {
    if (port) {
        await port.close();
        port = null;
        document.getElementById('connection-led').className = 'led-off';
        document.getElementById('connectBtn').innerText = "Connect ESP32";
    }
}



// This function sends a Ctrl+C signal to the ESP32 to stop any currently running code. It sends it twice to ensure that if the user is stuck in a nested loop, it will break out of both levels. Error handling is included to catch any issues during the stop process.


async function stopESP32() {
    if (!espWriter) return;

    const stopBtn = document.getElementById('stopBtn');

    try {
        // 1. Send the interrupt signals
        await espWriter.write('\x03\x03'); 
        console.log("Stopped execution (Sent Ctrl+C)");

        // 2. THE FIX: Disable the button immediately
        stopBtn.disabled = true;
        
        // 3. Optional: Change text or style to show it's stopped
        stopBtn.innerText = "Stopped ⏹";
        setTimeout(() => {
            stopBtn.innerText = "Stop"; // Reset text after a second
        }, 1000);

    } catch (e) {
        console.error("Stop failed:", e);
    }
}

// This listener catches physical unplugging events

navigator.serial.addEventListener('disconnect', (event) => {
    const connectBtn = document.getElementById('connectBtn');
    connectBtn.disabled = false; // Re-enable for the next connection
    connectBtn.innerText = "Connect ESP32";
    
    document.getElementById('connection-led').className = 'led-off';
    port = null;
    espWriter = null;
});

// This function connects to the ESP32 using the Web Serial API. It sets up both a writer for sending code and a reader for displaying the terminal output. The UI is updated to reflect the connection status, and error handling is included to catch any issues during the connection process.

// async function connectESP32() {
//     try {
//         port = await navigator.serial.requestPort();
//         await port.open({ baudRate: 115200 });

//         // 1. Setup the Writer (Sending code)
//         const encoder = new TextEncoderStream();
//         encoder.readable.pipeTo(port.writable);
//         espWriter = encoder.writable.getWriter();

//         // 2. Setup the Reader (The Terminal)
//         readFromESP32();

//         document.getElementById('uploadBtn').disabled = false;
//         document.getElementById('stopBtn').disabled = false; // Enable Stop button
//         document.getElementById('connectBtn').innerText = "Connected";
//         document.getElementById('connection-led').classList.add('led-on');
//     } catch (e) {
//         console.error("Connection failed", e);
//         document.getElementById('connection-led').classList.remove('led-on');
//     }
// }


async function connectESP32() {
    try {
        // This triggers the browser popup (The only part we can't hide)
        const newPort = await navigator.serial.requestPort();
        
        // If the user selects a port, we take over immediately
        await setupESP32Connection(newPort);
        
        // Success Message in your IDE UI (not console)
        showDialog("Success!", "ESP32 is now synced with Edusharks IDE.");

    } catch (err) {
        // We "eat" the console error and show your Dialog instead
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

// This function continuously reads from the ESP32's serial output and appends it to the terminal div. It uses a TextDecoder to convert bytes to strings and handles auto-scrolling for a better user experience.

async function readFromESP32() {
    const appendTerminal = (text) => {
        const term = document.getElementById('terminalOutput');
        term.innerText += text;
        // Auto-scroll to bottom
        document.getElementById('terminalContainer').scrollTop = term.scrollHeight;
    };

    while (port.readable) {
        const reader = port.readable.getReader();
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const decoded = new TextDecoder().decode(value);
                appendTerminal(decoded);
            }
        } catch (error) {
            console.error("Read error:", error);
        } finally {
            reader.releaseLock();
        }
    }
}


// Set initial state on window load
window.addEventListener('load', () => {
    document.getElementById('toggleCode').checked = false; // Default to Block
    toggleMode(); // Run once to set initial visibility
});


// This function toggles between "Debug Mode" (blocks only) and "Action Mode" (blocks + code). In Debug Mode, the toolbox is hidden to encourage block-based thinking, while in Action Mode, the toolbox is visible for easy access to blocks. The workspace is resized accordingly to fill the available space.

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


// This function toggles the simulation panel's visibility and smoothly resizes the Blockly workspace to fill the new space. It also hides the resizer handle when collapsed for a cleaner look.

function toggleSimPanel() {
    const sim = document.getElementById('simulation-container');
    const resizer = document.getElementById('sim-resizer'); // Ensure this ID exists!
    const isCollapsed = sim.classList.toggle('collapsed');


    if (isCollapsed) {
        resizer.style.display = 'none';
    } else {
        setTimeout(() => {
            resizer.style.display = 'block';
        }, 100);
    }
    
    // Set the target width
    sim.style.width = isCollapsed ? "0px" : "25%";

   
   
    // Smoothly animate the workspace resizing to match the new simulation panel size
    let startTime = null;
    const duration = 300; // Must match your CSS transition time

    function smoothResize(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        Blockly.svgResize(workspace);

        if (progress < duration) {
            requestAnimationFrame(smoothResize);
        } else {
            // Final snap for precision
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


// This function toggles the code overlay, which shows the generated Python code in a CodeMirror editor. It also adjusts the workspace opacity and button position for better UX.

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


// The function for uploading code onto ESP32

// async function uploadCode() {
//     if (!espWriter) return;

//     // 1. Show the Loading Animation
//     const overlay = document.getElementById('loadingOverlay');
//     overlay.classList.remove('overlay-hidden');

//     const code = Blockly.Python.workspaceToCode(workspace);
    
//     try {
//         // 1. Interrupt anything running (Ctrl+C)
//         await espWriter.write('\x03\x03'); 
//         await new Promise(r => setTimeout(r, 300));

//         // 2. Enter Raw Paste Mode (Ctrl+A)
//         await espWriter.write('\x01'); 
//         await new Promise(r => setTimeout(r, 100));

//         // 3. Send the raw code string and execute
//         await espWriter.write(code + '\x04');

//         // 4. Execute and Soft Reboot (Ctrl+D)
//         // await espWriter.write('\x04');
        
//         console.log("Upload successful.");
//     } catch (e) {
//         console.error("Upload error:", e);
//         alert("Upload Error. Please check connection.");
//     }
//     finally {
//         // 3. Hide the Loading Animation (even if error occurs)
//         // We add a tiny delay so the user actually sees the completion
//         setTimeout(() => {
//             overlay.classList.add('overlay-hidden');
//         }, 500);
//     }
// }


async function runCode() {
    if (!espWriter) return;
    const code = Blockly.Python.workspaceToCode(workspace);

    try {
        await espWriter.write('\x03\x03'); // Interrupt current code
        await new Promise(r => setTimeout(r, 200));
        await espWriter.write('\x01'); // Enter Raw Paste
        await espWriter.write(code + '\x04'); // Execute
        console.log("Running code in RAM...");
    } catch (e) {
        showDialog("Run Error", "Could not send code to RAM.");
    }
}


async function flashCode() {
    if (!espWriter) return;
    const code = Blockly.Python.workspaceToCode(workspace);

    // This script writes the code to main.py and reboots
    const flashScript = `
        f = open('main.py', 'w')
        f.write('''${code}''')
        f.close()
        import machine
        machine.soft_reset()
        `;

    showLoadingOverlay("Flashing to Storage..."); // Show a specific message

    try {
        await espWriter.write('\x03\x03'); 
        await new Promise(r => setTimeout(r, 400));
        await espWriter.write('\x01'); 
        await espWriter.write(flashScript + '\x04'); 
        
        showDialog("Flash Success", "Code saved permanently! The ESP32 will now run this every time it powers on.");
    } catch (e) {
        showDialog("Flash Error", "Failed to write to the ESP32 file system.");
    } finally {
        hideLoadingOverlay();
    }
}


async function uploadCode() {
    // Situation 1: Check Connection
    if (!espWriter || !port || !port.readable) {
        showDialog("Connection Required", "Oops! Your ESP32 isn't connected yet. Please click the 'Connect' button first.");
        return;
    }

    // Situation 2: Check for "Empty" Assembly
    // We check if there are blocks besides the two 'hat' blocks
    const allBlocks = workspace.getAllBlocks(false);
    const hasLogic = allBlocks.some(block => 
        block.type !== 'base_start' && block.type !== 'base_forever'
    );

    if (!hasLogic) {
        showDialog("Empty Workspace", "It looks like you haven't added any blocks to the 'On Start' or 'Forever' sections. Add some code first!");
        return;
    }

    // --- Start Upload Logic ---
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('overlay-hidden');
    const code = Blockly.Python.workspaceToCode(workspace);
    const permanentCode = `
        f = open('main.py', 'w')
        f.write('''${code}''')
        f.close()
        import machine
        machine.reset() # This reboots the board to run the new main.py
        `;


    try {
        
        await espWriter.write('\x03\x03'); // Interrupt
        await new Promise(r => setTimeout(r, 300));
        await espWriter.write('\x01'); // Raw mode
        await espWriter.write(code + '\x04'); // Send & Execute
        await espWriter.write(permanentCode + '\x04');
        console.log("Code saved to main.py and ESP32 rebooted.");
        document.getElementById('stopBtn').disabled = false;
    } catch (e) {
        showDialog("Upload Error", "Failed to send code. Please check your cable connection.");
    } finally {
        setTimeout(() => {
            overlay.classList.add('overlay-hidden');
        }, 500);
    }
}

function updateConnectionUI(isConnected) {
    const btn = document.getElementById('connectBtn');
    const led = document.getElementById('connection-led');
    const statusText = document.getElementById('footer-status');

    if (isConnected) {
        btn.innerHTML = '<span class="conn-icon">🔌</span> Disconnect';
        btn.classList.add('is-connected');
        statusText.innerText = "Connected (USB)";
        statusText.style.color = "#c4d447";
        led.className = 'led-on';
    } else {
        btn.innerHTML = '<span class="conn-icon">🔌</span> USB Connect';
        btn.classList.remove('is-connected');
        statusText.innerText = "Disconnected";
        statusText.style.color = "#888";
        led.className = 'led-off';
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

// Final startup refresh
setTimeout(() => {
    console.log("Running manual kickstart...");
    updateCode();    
    if(editor) editor.refresh();
}, 1000);