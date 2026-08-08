#!/usr/bin/env bash

# Channel creation and peer joining script using docker exec inside container network
CHANNEL_NAME="coldchain-channel"
ORDERER_CA="/etc/hyperledger/fabric/orderer/tls/ca.crt"

echo "=== 1. Creating ${CHANNEL_NAME} on Orderer ==="
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp \
  peer0.manufacturer.coldchain.com peer channel create \
  -o orderer.coldchain.com:7050 \
  -c ${CHANNEL_NAME} \
  -f /etc/hyperledger/fabric/channel/coldchain.tx \
  --outputBlock /etc/hyperledger/fabric/channel/${CHANNEL_NAME}.block \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --tls \
  --cafile "${ORDERER_CA}"

sleep 2

echo "=== 2. Joining Peer Nodes to ${CHANNEL_NAME} ==="

echo "Joining Manufacturer peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp \
  peer0.manufacturer.coldchain.com peer channel join -b /etc/hyperledger/fabric/channel/${CHANNEL_NAME}.block

echo "Joining Transport peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@transport.coldchain.com/msp \
  peer0.transport.coldchain.com peer channel join -b /etc/hyperledger/fabric/channel/${CHANNEL_NAME}.block

echo "Joining Retailer peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@retailer.coldchain.com/msp \
  peer0.retailer.coldchain.com peer channel join -b /etc/hyperledger/fabric/channel/${CHANNEL_NAME}.block

echo "Joining Regulator peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@regulator.coldchain.com/msp \
  peer0.regulator.coldchain.com peer channel join -b /etc/hyperledger/fabric/channel/${CHANNEL_NAME}.block

echo "=== 3. Updating Anchor Peers ==="

echo "Updating Manufacturer anchor peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp \
  peer0.manufacturer.coldchain.com peer channel update \
  -f /etc/hyperledger/fabric/channel/ManufacturerMSPanchors.tx \
  -c ${CHANNEL_NAME} \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --tls \
  --cafile "${ORDERER_CA}"

echo "Updating Transport anchor peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@transport.coldchain.com/msp \
  peer0.transport.coldchain.com peer channel update \
  -f /etc/hyperledger/fabric/channel/TransportMSPanchors.tx \
  -c ${CHANNEL_NAME} \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --tls \
  --cafile "${ORDERER_CA}"

echo "Updating Retailer anchor peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@retailer.coldchain.com/msp \
  peer0.retailer.coldchain.com peer channel update \
  -f /etc/hyperledger/fabric/channel/RetailerMSPanchors.tx \
  -c ${CHANNEL_NAME} \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --tls \
  --cafile "${ORDERER_CA}"

echo "Updating Regulator anchor peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@regulator.coldchain.com/msp \
  peer0.regulator.coldchain.com peer channel update \
  -f /etc/hyperledger/fabric/channel/RegulatorMSPanchors.tx \
  -c ${CHANNEL_NAME} \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --tls \
  --cafile "${ORDERER_CA}"

echo "=== Channel creation, peer join, and anchor updates completed successfully! ==="
