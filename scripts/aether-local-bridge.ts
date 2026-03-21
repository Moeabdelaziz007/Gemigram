/**
 * 🧬 Aether Neural Spine - Local Bridge Protocol
 * ------------------------------------------------
 * This script serves as the local connectivity layer for Gemigram AIOS.
 * It manages the 'Bridge' link type and provides a sovereign local substrate
 * for aetheric communications.
 */

import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const PORT = 3001;
const server = createServer();
const wss = new WebSocketServer({ server });

console.log(`
   ▄▄▄▄▀ ▄  █ ▄███▄   █▄▄▄▄ 
▀▀▀ █   █   █ █▀   ▀  █  ▄▀ 
    █   ██▀▀█ ██▄▄    █▀▀▌  
   █    █   █ █▄   ▄▀ █  █  
  ▀        █  ▀███▀     █   
          ▀            ▀    
`);

console.log('------------------------------------------------');
echo('🌐 Aether Neural Spine: Online');
echo(`📡 Listening on Protocol port: ${PORT}`);
echo('------------------------------------------------');

function echo(msg: string) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] ${msg}`);
}

wss.on('connection', (ws) => {
  echo('Neural Link Established: SECURE');
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      echo(`Protocol Request: ${message.type || 'UNKNOWN'}`);
      
      // Heartbeat / Ping logic
      if (message.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
    } catch {
      echo('Malformed brainwave signature received.');
    }
  });

  ws.on('close', () => {
    echo('Neural Link Severed.');
  });
});

process.on('SIGINT', () => {
  echo('Shutting down Neural Spine...');
  wss.close();
  process.exit();
});

server.listen(PORT);
