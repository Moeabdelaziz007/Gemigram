const fs = require('fs');
let code = fs.readFileSync('app/analyzer/page.tsx', 'utf8');
code = code.replace(/setResult\(\{ analysis: undefined, fileCount: undefined, error: res\.error \}\);/g, 'setResult({ analysis: undefined, fileCount: undefined, error: (res as any).error });');
fs.writeFileSync('app/analyzer/page.tsx', code);
