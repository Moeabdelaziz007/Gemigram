const fs = require('fs');

const path = 'lib/tools/repo-analyzer.ts';
let code = fs.readFileSync(path, 'utf8');

// Use regex to remove generic console warnings and errors
code = code.replace(/console\.warn\(.*?\);\n\s*/g, '');
code = code.replace(/console\.error\(.*?\);\n\s*/g, '');

fs.writeFileSync(path, code);
