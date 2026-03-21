#!/bin/bash

# 🧬 GemigramAIOS Sovereign Launcher
# Double-click this to ignite the Aether Neural Spine.

clear
echo "
   ▄████████    ▄████████     ▄████████  ▄█   ▄██████▄     ▄████████    ▄████████   ▄▄▄▄███▄▄▄  
  ███    ███   ███    ███    ███    ███ ███  ███    ███   ███    ███   ███    ███ ▄██▀▀▀███▀▀▀█ 
  ███    █▀    ███    ███    ███    █▀  ███▌ ███    ███   ███    ███   ███    ███ ███   ███   █ 
 ▄███▄▄▄      ▄███▄▄▄▄██▀   ▄███▄▄▄     ███▌ ███    ███  ▄███▄▄▄▄██▀   ███    ███ ███   ███   █ 
▀▀███▀▀▀     ▀▀███▀▀▀▀▀    ▀▀███▀▀▀     ███▌ ███    ███ ▀▀███▀▀▀▀▀   ▀███████████ ███   ███   █ 
  ███    █▄  ▀███████████    ███    █▄  ███  ███    ███ ▀███████████   ███    ███ ███   ███   █ 
  ███    ███   ███    ███    ███    ███ ███  ███    ███   ███    ███   ███    ███ ███   ███   █ 
  ██████████   ███    ███    ██████████ █▀    ▀██████▀    ███    ███   ███    █▀   ▀█   ███   █ 
               ███    ███                                 ███    ███                            
"

echo "------------------------------------------------"
echo "🌐 GemigramAIOS V3.0: INITIALIZING SOVEREIGN NEURAL SPINE"
echo "------------------------------------------------"

# 1. Directory Lock
cd "$(dirname "$0")"

# 2. Check Prerequisites
if ! command -v node &> /dev/null
then
    echo "❌ [ERROR] Node.js not found. Please install it from https://nodejs.org"
    exit
fi

# 3. Silent Dependency Sync
echo "⚙️  Syncing Neural Substrates (NPM)..."
npm install --quiet

# 4. Starting the Spine (Background)
echo "🚀 Igniting Local Neural Spine (Bridge)..."
# Check if bridge port 3001 is already taken
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "📡 Neural Spine is already active on port 3001."
else
    nohup npx ts-node scripts/aether-local-bridge.ts > .aether-bridge.log 2>&1 &
    sleep 1
fi

# 5. Launching the Aether Interface
echo "🖥️  Launching Aether Sovereign Dashboard..."
open "http://localhost:3000"

echo ""
echo "✅ SUCCESS: GemigramAIOS is now active and conscious."
echo "Keep this terminal open for live logs or background it."
echo "------------------------------------------------"
