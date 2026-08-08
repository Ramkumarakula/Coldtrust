#!/usr/bin/env bash

# Hyperledger Fabric 2.5 Smart Contract (Chaincode) Lifecycle Deployment Script
export PATH="/home/ramkumar/projects/fabric-samples/bin:$PATH"
export FABRIC_CFG_PATH="/home/ramkumar/projects/fabric-samples/config"

CHANNEL_NAME="coldchain-channel"
CC_NAME="coldchain"
CC_SRC_PATH="../chaincode/shipment"
CC_VERSION="1.1"
CC_SEQUENCE="2"
CC_LABEL="${CC_NAME}_${CC_VERSION}"

ORDERER_CA="/etc/hyperledger/fabric/orderer/tls/ca.crt"
MANUFACTURER_TLS_CA="/etc/hyperledger/fabric/organizations/peerOrganizations/manufacturer.coldchain.com/peers/peer0.manufacturer.coldchain.com/tls/ca.crt"
TRANSPORT_TLS_CA="/etc/hyperledger/fabric/organizations/peerOrganizations/transport.coldchain.com/peers/peer0.transport.coldchain.com/tls/ca.crt"
RETAILER_TLS_CA="/etc/hyperledger/fabric/organizations/peerOrganizations/retailer.coldchain.com/peers/peer0.retailer.coldchain.com/tls/ca.crt"
REGULATOR_TLS_CA="/etc/hyperledger/fabric/organizations/peerOrganizations/regulator.coldchain.com/peers/peer0.regulator.coldchain.com/tls/ca.crt"

echo "=== Step 1: Packaging Chaincode ==="
cd /home/ramkumar/projects/Enterprise-Cold-Chain-Network/blockchain || exit 1
/home/ramkumar/projects/fabric-samples/bin/peer lifecycle chaincode package ./channel/${CC_NAME}.tar.gz \
  --path ${CC_SRC_PATH} \
  --lang golang \
  --label ${CC_LABEL}

echo "=== Step 2: Installing Chaincode on All 4 Organization Peers ==="

echo "Installing on Manufacturer peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp \
  peer0.manufacturer.coldchain.com peer lifecycle chaincode install /etc/hyperledger/fabric/channel/${CC_NAME}.tar.gz

echo "Installing on Transport peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@transport.coldchain.com/msp \
  peer0.transport.coldchain.com peer lifecycle chaincode install /etc/hyperledger/fabric/channel/${CC_NAME}.tar.gz

echo "Installing on Retailer peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@retailer.coldchain.com/msp \
  peer0.retailer.coldchain.com peer lifecycle chaincode install /etc/hyperledger/fabric/channel/${CC_NAME}.tar.gz

echo "Installing on Regulator peer..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@regulator.coldchain.com/msp \
  peer0.regulator.coldchain.com peer lifecycle chaincode install /etc/hyperledger/fabric/channel/${CC_NAME}.tar.gz

echo "=== Step 3: Querying Package ID ==="
PACKAGE_ID=$(docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp peer0.manufacturer.coldchain.com peer lifecycle chaincode queryinstalled | grep "${CC_LABEL}" | sed -n 's/.*Package ID: \(.*\), Label:.*/\1/p' | head -n 1)

echo "Chaincode Package ID: ${PACKAGE_ID}"

if [ -z "${PACKAGE_ID}" ]; then
  echo "Error: Failed to query Package ID"
  exit 1
fi

echo "=== Step 4: Approving Chaincode Definition for Organizations ==="

echo "Approving for ManufacturerOrg..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp \
  peer0.manufacturer.coldchain.com peer lifecycle chaincode approveformyorg \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --channelID ${CHANNEL_NAME} \
  --name ${CC_NAME} \
  --version ${CC_VERSION} \
  --package-id ${PACKAGE_ID} \
  --sequence ${CC_SEQUENCE} \
  --tls \
  --cafile "${ORDERER_CA}"

echo "Approving for TransportOrg..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@transport.coldchain.com/msp \
  peer0.transport.coldchain.com peer lifecycle chaincode approveformyorg \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --channelID ${CHANNEL_NAME} \
  --name ${CC_NAME} \
  --version ${CC_VERSION} \
  --package-id ${PACKAGE_ID} \
  --sequence ${CC_SEQUENCE} \
  --tls \
  --cafile "${ORDERER_CA}"

echo "Approving for RetailerOrg..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@retailer.coldchain.com/msp \
  peer0.retailer.coldchain.com peer lifecycle chaincode approveformyorg \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --channelID ${CHANNEL_NAME} \
  --name ${CC_NAME} \
  --version ${CC_VERSION} \
  --package-id ${PACKAGE_ID} \
  --sequence ${CC_SEQUENCE} \
  --tls \
  --cafile "${ORDERER_CA}"

echo "Approving for RegulatorOrg..."
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@regulator.coldchain.com/msp \
  peer0.regulator.coldchain.com peer lifecycle chaincode approveformyorg \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --channelID ${CHANNEL_NAME} \
  --name ${CC_NAME} \
  --version ${CC_VERSION} \
  --package-id ${PACKAGE_ID} \
  --sequence ${CC_SEQUENCE} \
  --tls \
  --cafile "${ORDERER_CA}"

echo "=== Step 5: Committing Chaincode Definition on ${CHANNEL_NAME} ==="
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp \
  peer0.manufacturer.coldchain.com peer lifecycle chaincode commit \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --channelID ${CHANNEL_NAME} \
  --name ${CC_NAME} \
  --version ${CC_VERSION} \
  --sequence ${CC_SEQUENCE} \
  --tls \
  --cafile "${ORDERER_CA}" \
  --peerAddresses peer0.manufacturer.coldchain.com:7051 --tlsRootCertFiles "${MANUFACTURER_TLS_CA}" \
  --peerAddresses peer0.transport.coldchain.com:8051 --tlsRootCertFiles "${TRANSPORT_TLS_CA}" \
  --peerAddresses peer0.retailer.coldchain.com:9051 --tlsRootCertFiles "${RETAILER_TLS_CA}" \
  --peerAddresses peer0.regulator.coldchain.com:10051 --tlsRootCertFiles "${REGULATOR_TLS_CA}"

echo "=== Step 6: Verifying Committed Chaincode ==="
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp \
  peer0.manufacturer.coldchain.com peer lifecycle chaincode querycommitted --channelID ${CHANNEL_NAME} --name ${CC_NAME}

echo "=== Smart Contract lifecycle deployment completed successfully! ==="
