# ColdTrust IoT Simulator

This directory contains a **TypeScript** IoT telemetry simulator for the ColdTrust enterprise network.

## Prerequisites (WSL Ubuntu)

1. **Node.js & npm** – Install inside the WSL Ubuntu environment:
   `ash
   sudo apt update
   sudo apt install -y nodejs npm
   # Verify installation
   node -v
   npm -v
   `
   > *If you prefer 
vm, you can install it and then 
vm install --lts.

2. **Global TypeScript tools** (optional but convenient):
   `ash
   npm install -g ts-node typescript
   `
   This makes the 	s-node command available globally.

## Project setup

`ash
# Navigate to the simulator folder (inside WSL)
cd /home/ramkumar/projects/Enterprise-Cold-Chain-Network/simulator

# Install the simulator's npm dependencies
npm install
`

The package.json defines the following scripts:
- **build** – Compiles TypeScript to JavaScript (	sc).
- **start** – Runs the original simulator (	s-node src/simulator.ts).

## Auth‑enabled simulator

An alternative entry point (src/auth_simulator.ts) has been added. It injects a JWT token into every request so the simulator can communicate with the backend without getting 401 errors.

### Running the auth simulator

You can start it directly with **ts-node**:

`ash
# Ensure ts-node is available (installed globally or via npm install)
# If you installed it globally as shown above, simply run:
ts-node src/auth_simulator.ts
`

Alternatively, add a custom npm script:

`json
  
