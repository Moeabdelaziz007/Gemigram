const fs = require('fs');
let code = fs.readFileSync('app/analyzer/page.tsx', 'utf8');
code = code.replace(/} catch \(err: any\) {\n\s+setResult\({ error: err\.message }\);/g, '} catch (err: any) {\n      setResult({ analysis: undefined, fileCount: undefined, error: err.message });');
fs.writeFileSync('app/analyzer/page.tsx', code);
