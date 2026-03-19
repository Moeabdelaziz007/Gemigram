const fs = require('fs');
let code = fs.readFileSync('lib/store/useGemigramStore.ts', 'utf8');
code = code.replace(/mcpServers: state\.mcpServers,/g, 'mcpServers: (state as any).mcpServers,');
fs.writeFileSync('lib/store/useGemigramStore.ts', code);
