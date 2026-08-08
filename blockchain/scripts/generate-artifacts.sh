#!/usr/bin/env bash

# Path setup for Fabric binaries
export PATH=/home/ramkumar/projects/fabric-samples/bin:$PATH
export FABRIC_CFG_PATH="${PWD}/config"

echo "=== 1. Generating Cryptographic Material using cryptogen ==="

if [ ! -d "organizations/peerOrganizations" ]; then
  cryptogen generate --config=./organizations/cryptogen/crypto-config-orderer.yaml --output="organizations"
  cryptogen generate --config=./organizations/cryptogen/crypto-config-manufacturer.yaml --output="organizations"
  cryptogen generate --config=./organizations/cryptogen/crypto-config-transport.yaml --output="organizations"
  cryptogen generate --config=./organizations/cryptogen/crypto-config-retailer.yaml --output="organizations"
  cryptogen generate --config=./organizations/cryptogen/crypto-config-regulator.yaml --output="organizations"
  echo "=== Cryptographic material generated successfully ==="
else
  echo "=== Cryptographic material already exists, reusing existing certificates ==="
fi

echo "=== 2. Creating Channel Artifacts using configtxgen ==="

mkdir -p channel

configtxgen -profile FourOrgsOrdererGenesis -channelID system-channel -outputBlock ./channel/genesis.block
configtxgen -profile ColdChainChannel -outputCreateChannelTx ./channel/coldchain.tx -channelID coldchain-channel

configtxgen -profile ColdChainChannel -outputAnchorPeersUpdate ./channel/ManufacturerMSPanchors.tx -channelID coldchain-channel -asOrg ManufacturerMSP
configtxgen -profile ColdChainChannel -outputAnchorPeersUpdate ./channel/TransportMSPanchors.tx -channelID coldchain-channel -asOrg TransportMSP
configtxgen -profile ColdChainChannel -outputAnchorPeersUpdate ./channel/RetailerMSPanchors.tx -channelID coldchain-channel -asOrg RetailerMSP
configtxgen -profile ColdChainChannel -outputAnchorPeersUpdate ./channel/RegulatorMSPanchors.tx -channelID coldchain-channel -asOrg RegulatorMSP

echo "=== Channel transaction artifacts generated successfully ==="
