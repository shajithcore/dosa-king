const https = require('https');
const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, 'lib');
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir);

const files = {
    // Blockly & Plugins
    "blockly.min.js": "https://unpkg.com/blockly/blockly.min.js",
    "python_compressed.js": "https://unpkg.com/blockly/python_compressed.js",
    "disable-top-blocks.js": "https://unpkg.com/@blockly/disable-top-blocks",
    "workspace-backpack.js": "https://unpkg.com/@blockly/workspace-backpack",
    
    // CodeMirror
    "codemirror.min.js": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.11/codemirror.min.js",
    "codemirror.min.css": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.11/codemirror.min.css",
    "material.min.css": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.12/theme/material.min.css",
    "python-mode.min.js": "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.11/mode/python/python.min.js"
};

Object.entries(files).forEach(([filename, url]) => {
    const file = fs.createWriteStream(path.join(libDir, filename));
    https.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
            // Handle redirects (common with unpkg)
            https.get(response.headers.location, (res) => res.pipe(file));
        } else {
            response.pipe(file);
        }
        console.log(`Downloaded: ${filename}`);
    });
});