
  // Add this temporarily to the top of app.js

  let port;
  let espWriter; // Declare it here at the top!
  

  const DarkTheme = Blockly.Theme.defineTheme('dark_theme', {
  'base': Blockly.Themes.Classic,
  'categoryStyles':{
    'controls_category': { 'colour': '#223fe6' },
    'logic_category': { 'colour': '#43bf57' },
    'loop_category': { 'colour': '#892d86' },
    'math_category': { 'colour': '#5b67a5' },
    'variables_category': { 'colour': '#a55b80' },
    'sensors_category': { 'colour': '160' },
    'hardware_category': { 'colour': '#0e434e' },

  },

  'componentStyles': {
    'workspaceBackgroundColour': '#000511f9',
    'toolboxBackgroundColour': '#060606',
    'toolboxForegroundColour': '#f9f9f9',
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

  forceToolboxStyles();


  /* A function to create custom styles for block categories */
  
  function forceToolboxStyles() {
    // Check if we already added this to avoid duplicates
    if (document.getElementById('blockly-toolbox-overrides')) return;

    const style = document.createElement('style');
    style.id = 'blockly-toolbox-overrides';
    style.innerHTML = `

      /* Hide the icon for the label category if one appears */
      .toolbox-label-row .blocklyTreeIcon, 
      .blocklyTreeIcon {
            display: none !important;
      }
        /* 1. The Row: Full height and alignment */
        .blocklyTreeRow {
            position: relative !important;
            top: auto !important;
            height: 60px !important;    
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 !important;
            background-color: transparent !important;
            width: 100% !important;
            cursor: pointer !important;
        }

        /* 2. The Text: Inherits the category's theme color */
        .blocklyTreeLabel {
            font-size: 18px !important;
            font-family: 'Segoe UI', Tahoma, sans-serif !important;
            padding: 0 !important;
            margin: 0 !important;
            text-align: center !important; 
            
        }

        /* Ensure the label row specifically stays transparent */
        .toolbox-label-row {
            background-color: #299b84 !important;
            height: 30px !important;
            display: flex !important;   
            align-items: center !important;     /* Vertical centering */            
            justify-content: center !important; /* Horizontal centering */            
            margin-top: 10px !important;
            margin-bottom: 10px !important;
            border-radius: 4px; /* Optional: gives it a "pill" or "tab" look */
            cursor: default !important; /* Change pointer to standard arrow */
            pointer-events: none; /* Secondary layer of protection */
        }

        /* 2. The Text: Remove default padding/margins that might shift it */
        .toolbox-label-row .blocklyTreeLabel {
            color: #f93d03 !important;
            font-size: 25px !important;
            font-weight: 800 !important;        
            letter-spacing: 2px !important;
            
            /* Reset Blockly's default side-padding to ensure true center */
            padding: 0 !important; 
            margin: 0 !important;
}

        .blocklyToolboxContents {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;  /* THIS is what creates the space between buttons */
            padding: 15px 0 !important;
}

        /* 3. The Hover: Unified color for all categories */
        .blocklyTreeRow:not(.toolbox-label-row):hover {
            background-color: #333333 !important; /* Pick your specific hover color here */
            cursor: pointer;
        }

        /* 4. Contrast: Turn text white on hover */
        .blocklyTreeRow:hover .blocklyTreeLabel {
            color: #ffffff !important;
        }

        /* 5. Selection: The 'Active' state */
        .blocklyTreeRow.blocklyTreeSelected {
            background-color: rgba(255, 255, 255, 0.1) !important;
            border-left: 6px solid #cdc71a !important;
        }

        /* 6. The Separator: Flush with the blocks */
        .blocklyTreeSeparator {
            border-bottom: 4px solid #cdc71a !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 0px !important;
            display: block !important;
        }
    `;
    document.head.appendChild(style);
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



function toggleTerminalView() {
    const termCont = document.getElementById('terminal-container');
    const isChecked = document.getElementById('toggleTerminal').checked;

    if (isChecked) {
        termCont.style.display = 'flex';
    } else {
        termCont.style.display = 'none';
    }

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


/* Make the terminal output area and code editor area re-sizable */

const termContainer = document.getElementById('terminalContainer');
const termHeader = document.querySelector('.terminal-header');
const hResizer = document.getElementById('terminal-resizer-h');

hResizer.addEventListener('mousedown', (e) => {
    document.addEventListener('mousemove', resizeTerminal);
    document.addEventListener('mouseup', stopResizeTerminal);
    document.body.style.cursor = 'ns-resize';
});

let isDragging = false;

// 1. Double-Click or Single-Click to Toggle
termHeader.addEventListener('click', (e) => {
    if (e.target.closest('button')) return; // Ignore if clicking clear button
    
    if (termContainer.offsetHeight < 100) {
        termContainer.style.height = "200px";
    } else {
        termContainer.style.height = "40px";
    }
    editor.refresh(); // Keep CodeMirror aligned
});

// 2. Drag to Resize
termHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.body.style.cursor = 'ns-resize'; // Keep cursor consistent while dragging
});

// Setting the height of the terminal to 25% of the screen when the toggle button is clicked, and minimizing it when clicked again. This allows for quick access to the terminal without taking up too much space when not needed.
document.getElementById('terminalToggleBtn').addEventListener('click', () => {
    const container = document.getElementById('terminal-container');
    const targetHeight = window.innerHeight * 0.25; // 25% of screen

    if (container.offsetHeight < 100) {
        container.style.height = targetHeight + "px";
        container.classList.remove('terminal-minimized');
    } else {
        container.classList.add('terminal-minimized');
    }
    
    Blockly.svgResize(workspace);
});

// 3. Listen for mouse movement on the entire document to allow dragging outside the header
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Calculate distance from bottom of window
    const newHeight = window.innerHeight - e.clientY;

    // Constrain height (Min: 40px, Max: 70% of screen)
    if (newHeight >= 40 && newHeight <= window.innerHeight * 0.7) {
        termContainer.style.height = `${newHeight}px`;
        if (editor) editor.refresh();
    }
});


/* Clears the console */
document.getElementById('terminalOutput').innerHTML = '';


// Stop dragging on mouse up anywhere on the document
document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = 'default';
});

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


function toggleEditorView() {
    const blocklyView = document.getElementById('blocklyDiv');
    const editorView = document.getElementById('editor-container');
    const isChecked = document.getElementById('toggleCode').checked;

    if (isChecked) {
        // Switch to CODE VIEW
        blocklyView.classList.add('hidden-view');
        editorView.classList.remove('hidden-view');
        
        // Ensure CodeMirror is updated and visible
        if (editor) {
            // Update the code one last time before showing
            const code = Blockly.Python.workspaceToCode(workspace);
            editor.setValue(code);
            editor.refresh(); 
        }
    } else {
        // Switch to BLOCK VIEW
        editorView.classList.add('hidden-view');
        blocklyView.classList.remove('hidden-view');
        
        // Force Blockly to recalculate its size so blocks aren't "frozen"
        Blockly.svgResize(workspace);
    }
}


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




function resizeTerminal(e) {
    const newHeight = window.innerHeight - e.clientY;
    // Minimum 40px, Maximum 70% of screen
    if (newHeight > 40 && newHeight < window.innerHeight * 0.7) {
        termContainer.style.height = `${newHeight}px`;
        termContainer.classList.remove('terminal-minimized');
        if (editor) editor.refresh();
        Blockly.svgResize(workspace);
    }
}

function stopResizeTerminal() {
    document.removeEventListener('mousemove', resizeTerminal);
    document.body.style.cursor = 'default';
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


// Swith between blockly and code editor view
function toggleEditorView() {
    const blocklyView = document.getElementById('blocklyDiv');
    const editorView = document.getElementById('editor-container');
    const isChecked = document.getElementById('toggleCode').checked;

    if (isChecked) {
        // --- PYTHON MODE ---
        blocklyView.classList.add('hidden-view');
        editorView.classList.remove('hidden-view');
        
        if (editor) {
            const code = Blockly.Python.workspaceToCode(workspace);
            editor.setValue(code);
            editor.refresh(); 
        }
    } else {
        // --- BLOCK MODE ---
        editorView.classList.add('hidden-view');
        blocklyView.classList.remove('hidden-view');
        
        // Ensure blocks fill the space left by the editor
        setTimeout(() => {
            Blockly.svgResize(workspace);
        }, 50);
    }
}

// Set initial state on window load
window.addEventListener('load', () => {
    document.getElementById('toggleCode').checked = false; // Default to Block
    toggleEditorView(); // Run once to set initial visibility
});

// function toggleSimDrawer() {
//     const simPanel = document.getElementById('simulation-container');
//     const isCollapsed = simPanel.classList.toggle('collapsed');
    
//     // Crucial: Update Blockly after the CSS transition (300ms)
//     setTimeout(() => {
//         Blockly.svgResize(workspace);
//     }, 310);
// }

// // Ensure the resizer doesn't interfere with the click
// // We stop the resize if the panel is collapsed
// simResizer.addEventListener('mousedown', (e) => {
//     if (document.getElementById('simulation-container').classList.contains('collapsed')) return;
    
//     document.addEventListener('mousemove', resizeSim);
//     document.addEventListener('mouseup', stopResizeSim);
// });

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
    const overlay = document.getElementById('code-overlay');
    const workspaceElement = document.querySelector('.blocklyWidgetDiv'); // Blockly's main layer
    
    overlay.classList.toggle('overlay-hidden');
    
    if (!overlay.classList.contains('overlay-hidden')) {

        // When open, the workspace background
        document.getElementById('blocklyDiv').style.opacity = "1";
        // Force update and refresh when opened
        const code = Blockly.Python.workspaceToCode(workspace);
        editor.setValue(code);
        editor.refresh();
    } else {
        // When closed, the workspace background
        document.getElementById('blocklyDiv').style.opacity = "1";
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