const fs = require('fs');
let code = fs.readFileSync('lib/store/useGemigramStore.ts', 'utf8');
code = code.replace(/theme: state\.theme,/g, 'theme: (state as any).theme,');
fs.writeFileSync('lib/store/useGemigramStore.ts', code);
