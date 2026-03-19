const fs = require('fs');
let code = fs.readFileSync('app/analyzer/page.tsx', 'utf8');
code = code.replace(/setResult\(\{ error: res\.error \}\);/g, 'setResult({ analysis: undefined, fileCount: undefined, error: res.error });');
fs.writeFileSync('app/analyzer/page.tsx', code);
