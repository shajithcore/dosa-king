
  // Add this temporarily to the top of app.js

  let port;
  let espWriter; // Declare it here at the top!

  const DarkTheme = Blockly.Theme.defineTheme('dark_theme', {
  'base': Blockly.Themes.Zelos,
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
    'cursorColour': '#d0d0d0'
  }
});
  
  const toolboxJson = {
    "kind": "categoryToolbox",
    "contents": [

      {
      "kind": "category",
      "name": "Blocks Drawer", // This is your label
      "cssConfig": {
        "row": "toolbox-label-row" // Custom class for styling
      }
    },

     // { "kind": "sep" }, // Visual separator

      {
        "kind": "category",
        "name": "Controls",
        "colour": "#e67e22",
        "cssConfig": {
          "icon": "customIconControls"},// This links to your CSS
        "contents": [
          { "kind": "block", "type": "base_start" },
          { "kind": "block", "type": "base_forever"},
          { "kind": "block", "type": "base_delay" } ]
      },

    //  { "kind": "sep" }, // Visual separator

      {
        "kind": "category",
        "name": "ESP32 Hardware",
        "colour": "#e67e22",
        "cssConfig": {
          "icon": "customIconHardware"},// This links to your CSS
        "contents": [
          { "kind": "block", "type": "esp32_led" } ]
      },

    //  { "kind": "sep" }, // Visual separator

      {
        "kind": "category",
        "name": "Logic",
        "colour": "#43bf57",
        "cssConfig": {
          "icon": "customIconLogic"},// This links to your CSS
        "contents": [
          { "kind": "block", "type": "controls_if" },
          { "kind": "block", "type": "logic_compare" }
        ]
      },

    //  { "kind": "sep" }, // Visual separator

      {
        "kind": "category",
        "name": "Loops",
        "colour": "#5ba55b",
        "cssConfig": {
          "icon": "customIconLoops"},// This links to your CSS
        "contents": [ 

        { "kind": "block", "type": "controls_repeat_ext" }
        ]
      },

    //  { "kind": "sep" }, // Visual separator

      {
      "kind": "category", 
      "name": "Math", 
      "colour": "#5b67a5", 
      "cssConfig": {
        "icon": "customIconMath"},// This links to your CSS
      "contents": [
          { "kind": "block", "type": "math_number" },
          { "kind": "block", "type": "math_arithmetic" },
          { "kind": "block", "type": "math_single" },
          { "kind": "block", "type": "math_trig" },   // Sin, Cos, Tan
          { "kind": "block", "type": "math_constant" }, // Pi, E, Golden Ratio
          { "kind": "block", "type": "math_number_property" }, // Is even, is odd, is prime
          { "kind": "block", "type": "math_round" },
          { "kind": "block", "type": "math_on_list" }, // Sum of list, min, max
          { "kind": "block", "type": "math_modulo" },
          { "kind": "block", "type": "math_constrain" }, // Keep number between X and Y
          { "kind": "block", "type": "math_random_int" } // Useful for LED effects!
      ]
    },

  //  { "kind": "sep" }, // Visual separator

    {
      "kind": "category", 
      "name": "Variables", 
      "custom": "VARIABLE", 
      "colour": "#a55b80", 
      "cssConfig": {
          "icon": "customIconVariables"}
      
    },

    //  { "kind": "sep" }, // Visual separator

      {
        "kind": "category",
        "name": "Sensors",
        "colour": "160",
        "cssConfig": {
          "icon": "customIconSensors"},// This links to your CSS
        "contents": [
          { "kind": "block", "type": "sensor_ultrasonic" },
          { "kind": "block", "type": "sensor_dht11" },
          { "kind": "block", "type": "sensor_ldr" }
        ]
      }
    ]
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
    toolbox: toolboxJson,
    theme: DarkTheme, // This changes the "Thanos" / Dark look
    renderer: 'zelos',          // This makes blocks look like Scratch (rounded)
    move: { scrollbars: true, drag: true, wheel: true },
    zoom: { controls: true, wheel: true, startScale: 0.9 },
    grid: { spacing: 20, length: 3, colour: '#ccc', snap: true }    
  });

  forceToolboxStyles();


  /* A function to create custom styles for block categories */
  
  function forceToolboxStyles() {
    // Check if we already added this to avoid duplicates
    if (document.getElementById('blockly-toolbox-overrides')) return;

    const style = document.createElement('style');
    style.id = 'blockly-toolbox-overrides';
    style.innerHTML = `

      /* Hide the icon for the label category if one appears */
      .toolbox-label-row .blocklyTreeIcon {
          display: none !important;
      }
        /* 1. The Row: Full height and alignment */
        .blocklyTreeRow {
            height: 50px !important;
            display: flex !important;
            align-items: center !important;
            margin-bottom: 30px !important;
            padding: 0 15px !important;
            box-sizing: border-box !important;
            border: none !important;
            background-color: transparent !important;
            cursor: pointer;
        }

        /* 2. The Text: Inherits the category's theme color */
        .blocklyTreeLabel {
            font-weight: bold !important;
            font-size: 14px !important;
            color: inherit !important; 
        }

        /* Ensure the label row specifically stays transparent */
        .toolbox-label-row {
            background-color: #299b84 !important;
            height: 50px !important;
            font-family: 'Segoe UI', Tahoma, sans-serif !important;
            justify-content: center !important; /* Horizontal centering */
            align-items: center !important;     /* Vertical centering */
            margin-top: 0px !important;
            margin-bottom: 10px !important;
            border-radius: 4px; /* Optional: gives it a "pill" or "tab" look */
            cursor: default !important; /* Change pointer to standard arrow */
            pointer-events: none; /* Secondary layer of protection */
        }

        /* 2. The Text: Remove default padding/margins that might shift it */
        .toolbox-label-row .blocklyTreeLabel {
            color: #cdc71a !important;
            font-size: 11px !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 2px !important;
            
            /* Reset Blockly's default side-padding to ensure true center */
            padding: 0 !important; 
            margin: 0 !important;
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



/* Make the terminal output area and code editor area re-sizable */

const termContainer = document.getElementById('terminalContainer');
const termHeader = document.querySelector('.terminal-header');

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


// 7. SYNC ENGINE

function updateCode(event) {
    // 1. Filter out UI-only events to save memory
    if (event && (event.type == Blockly.Events.UI || event.type == Blockly.Events.CLICK)) {
        return;
    }

    try {
        // 2. Generate Python from the workspace
        const code = Blockly.Python.workspaceToCode(workspace);
        
        // 3. LOGGING: Open your console (F12) to see this!
        console.log("Blockly generated:", code);

        if (editor) {
            // 4. Push the code to the screen
            editor.setValue(code);
            editor.refresh(); 
        }
    } catch (e) {
        console.error("Sync Error:", e);
    }
}

// Ensure the listener is attached ONLY once
workspace.removeChangeListener(updateCode); // Clear old ones
workspace.addChangeListener(updateCode);    // Add fresh one


// // Attach this to your workspace
// workspace.addChangeListener(updateCode);

// 8. GENERATOR DEFINITIONS (Must be defined before the listener)
Blockly.Python.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.getNextBlock();
    const nextCode = opt_thisOnly ? '' : Blockly.Python.blockToCode(nextBlock);
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


