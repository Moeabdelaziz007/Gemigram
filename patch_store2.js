const fs = require('fs');
let code = fs.readFileSync('lib/store/useGemigramStore.ts', 'utf8');
code = code.replace(/user: state\.user,/g, 'user: (state as any).user,');
fs.writeFileSync('lib/store/useGemigramStore.ts', code);
