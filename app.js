
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

async function stopESP32() {
    if (!espWriter) return;

    try {
        // Send Ctrl+C twice to be sure we break out of nested loops
        await espWriter.write('\x03\x03');
        console.log("Stopped execution (Sent Ctrl+C)");
    } catch (e) {
        console.error("Stop failed:", e);
    }
}


async function connectESP32() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        // 1. Setup the Writer (Sending code)
        const encoder = new TextEncoderStream();
        encoder.readable.pipeTo(port.writable);
        espWriter = encoder.writable.getWriter();

        // 2. Setup the Reader (The Terminal)
        readFromESP32();

        document.getElementById('uploadBtn').disabled = false;
        document.getElementById('stopBtn').disabled = false; // Enable Stop button
        document.getElementById('connectBtn').innerText = "Connected ✅";
    } catch (e) {
        console.error("Connection failed", e);
    }
}

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

    // SMOOTH RESIZE ENGINE
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

async function uploadCode() {
    if (!espWriter) return;

    // 1. Show the Loading Animation
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('overlay-hidden');

    const code = Blockly.Python.workspaceToCode(workspace);
    
    try {
        // 1. Interrupt anything running (Ctrl+C)
        await espWriter.write('\x03\x03'); 
        await new Promise(r => setTimeout(r, 300));

        // 2. Enter Raw Paste Mode (Ctrl+A)
        await espWriter.write('\x01'); 
        await new Promise(r => setTimeout(r, 100));

        // 3. Send the raw code string and execute
        await espWriter.write(code + '\x04');

        // 4. Execute and Soft Reboot (Ctrl+D)
        // await espWriter.write('\x04');
        
        console.log("Upload successful.");
    } catch (e) {
        console.error("Upload error:", e);
        alert("Upload Error. Please check connection.");
    }
    finally {
        // 3. Hide the Loading Animation (even if error occurs)
        // We add a tiny delay so the user actually sees the completion
        setTimeout(() => {
            overlay.classList.add('overlay-hidden');
        }, 500);
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