#!/usr/bin/env bash

ORDERER_CA="/etc/hyperledger/fabric/orderer/tls/ca.crt"
MANUFACTURER_TLS_CA="/etc/hyperledger/fabric/organizations/peerOrganizations/manufacturer.coldchain.com/peers/peer0.manufacturer.coldchain.com/tls/ca.crt"
TRANSPORT_TLS_CA="/etc/hyperledger/fabric/organizations/peerOrganizations/transport.coldchain.com/peers/peer0.transport.coldchain.com/tls/ca.crt"
RETAILER_TLS_CA="/etc/hyperledger/fabric/organizations/peerOrganizations/retailer.coldchain.com/peers/peer0.retailer.coldchain.com/tls/ca.crt"

echo "=== 1. Creating Shipment SHIP-1001 (Manufacturer, Transport, Retailer Endorsements) ==="
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp \
  peer0.manufacturer.coldchain.com peer chaincode invoke \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --tls \
  --cafile "${ORDERER_CA}" \
  -C coldchain-channel \
  -n coldchain \
  --peerAddresses peer0.manufacturer.coldchain.com:7051 --tlsRootCertFiles "${MANUFACTURER_TLS_CA}" \
  --peerAddresses peer0.transport.coldchain.com:8051 --tlsRootCertFiles "${TRANSPORT_TLS_CA}" \
  --peerAddresses peer0.retailer.coldchain.com:9051 --tlsRootCertFiles "${RETAILER_TLS_CA}" \
  -c '{"function":"CreateShipment","Args":["SHIP-1001","COVID-19 Vaccine Vials","BioTechLabs","SwiftLogistics","MetroHospital","2.0","4.0"]}'

sleep 3

echo "=== 2. Reading Shipment SHIP-1001 State ==="
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp \
  peer0.manufacturer.coldchain.com peer chaincode query \
  -C coldchain-channel \
  -n coldchain \
  -c '{"function":"GetShipment","Args":["SHIP-1001"]}'

echo "=== 3. Accept Shipment by Transport Org ==="
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@transport.coldchain.com/msp \
  peer0.transport.coldchain.com peer chaincode invoke \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --tls \
  --cafile "${ORDERER_CA}" \
  -C coldchain-channel \
  -n coldchain \
  --peerAddresses peer0.manufacturer.coldchain.com:7051 --tlsRootCertFiles "${MANUFACTURER_TLS_CA}" \
  --peerAddresses peer0.transport.coldchain.com:8051 --tlsRootCertFiles "${TRANSPORT_TLS_CA}" \
  --peerAddresses peer0.retailer.coldchain.com:9051 --tlsRootCertFiles "${RETAILER_TLS_CA}" \
  -c '{"function":"AcceptShipment","Args":["SHIP-1001"]}'

sleep 3

echo "=== 4. Record Telemetry with Temperature Spike (5.2°C > 4.0°C) ==="
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@transport.coldchain.com/msp \
  peer0.transport.coldchain.com peer chaincode invoke \
  -o orderer.coldchain.com:7050 \
  --ordererTLSHostnameOverride orderer.coldchain.com \
  --tls \
  --cafile "${ORDERER_CA}" \
  -C coldchain-channel \
  -n coldchain \
  --peerAddresses peer0.manufacturer.coldchain.com:7051 --tlsRootCertFiles "${MANUFACTURER_TLS_CA}" \
  --peerAddresses peer0.transport.coldchain.com:8051 --tlsRootCertFiles "${TRANSPORT_TLS_CA}" \
  --peerAddresses peer0.retailer.coldchain.com:9051 --tlsRootCertFiles "${RETAILER_TLS_CA}" \
  -c '{"function":"RecordTelemetry","Args":["SHIP-1001","5.2","45.0","Warehouse B, Dock 4"]}'

sleep 3

echo "=== 5. Query Shipment to Verify AUTOMATED COMPROMISED Status ==="
docker exec \
  -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/users/Admin@manufacturer.coldchain.com/msp \
  peer0.manufacturer.coldchain.com peer chaincode query \
  -C coldchain-channel \
  -n coldchain \
  -c '{"function":"GetShipment","Args":["SHIP-1001"]}'
