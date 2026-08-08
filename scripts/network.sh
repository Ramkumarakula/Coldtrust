#!/usr/bin/env bash

# Master CLI management script for ColdTrust Fabric Consortium Network
export PATH=/home/ramkumar/projects/fabric-samples/bin:$PATH
BLOCKCHAIN_DIR="${PWD}/blockchain"

MODE=$1

function printHelp() {
  echo "Usage: ./scripts/network.sh [up|down|generate|help]"
  echo "  up       - Bring up 4-Org Fabric network containers"
  echo "  down     - Tear down all containers, volumes, and networks"
  echo "  generate - Generate cryptographic material and channel artifacts"
}

function generateCrypto() {
  echo "Generating certificates and channel transaction artifacts..."
  cd "${BLOCKCHAIN_DIR}" || exit 1
  bash ./scripts/generate-artifacts.sh
  cd ..
}

function networkUp() {
  if [ ! -f "${BLOCKCHAIN_DIR}/channel/genesis.block" ]; then
    echo "Channel artifacts not found. Generating artifacts first..."
    generateCrypto
  fi
  echo "Bringing up ColdTrust Consortium Network containers (1 Orderer, 4 CAs, 4 Peers, 4 CouchDBs)..."
  cd "${BLOCKCHAIN_DIR}" || exit 1
  docker compose -f compose/docker-compose-net.yaml up -d
  cd ..
}

function networkDown() {
  echo "Stopping and cleaning up ColdTrust Consortium Network containers..."
  cd "${BLOCKCHAIN_DIR}" || exit 1
  docker compose -f compose/docker-compose-net.yaml down -v --remove-orphans
  rm -rf channel/*.block channel/*.tx
  cd ..
}

if [ "${MODE}" == "up" ]; then
  networkUp
elif [ "${MODE}" == "down" ]; then
  networkDown
elif [ "${MODE}" == "generate" ]; then
  generateCrypto
else
  printHelp
fi
