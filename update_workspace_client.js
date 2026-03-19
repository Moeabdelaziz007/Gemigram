const fs = require('fs');

const path = 'lib/tools/workspace-client.ts';
let code = fs.readFileSync(path, 'utf8');

// Use regex to remove console warnings and errors
code = code.replace(/console\.warn\(.*?\[GWS-Client\].*?\);\n\s*/g, '');

fs.writeFileSync(path, code);
