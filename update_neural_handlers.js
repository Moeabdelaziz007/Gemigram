const fs = require('fs');

const path = 'lib/tools/neural-handlers.ts';
let code = fs.readFileSync(path, 'utf8');

// Use regex to remove console logs
code = code.replace(/console\.warn\(\'\[NeuralHandler\].*?\);\n\s*/g, '');
code = code.replace(/console\.error\(\'\[NeuralHandler\].*?\);\n\s*/g, '');
code = code.replace(/console\.log\(\`\[NeuralHandler\].*?\);\n\s*/g, '');

fs.writeFileSync(path, code);
