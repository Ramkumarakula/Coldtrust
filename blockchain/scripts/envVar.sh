#!/usr/bin/env bash

# Export helper functions to target specific Organization Peers
export FABRIC_CFG_PATH="/home/ramkumar/projects/fabric-samples/config"

setGlobals() {
  USING_ORG=$1
  echo "Setting globals for Org: ${USING_ORG}"

  if [ "${USING_ORG}" == "Manufacturer" ]; then
    export CORE_PEER_LOCALMSPID="ManufacturerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE="${PWD}/organizations/peerOrganizations/manufacturer.coldchain.com/peers/peer0.manufacturer.coldchain.com/tls/ca.crt"
    export CORE_PEER_MSPCONFIGPATH="${PWD}/organizations/peerOrganizations/manufacturer.coldchain.com/users/Admin@manufacturer.coldchain.com/msp"
    export CORE_PEER_ADDRESS="localhost:7051"
  elif [ "${USING_ORG}" == "Transport" ]; then
    export CORE_PEER_LOCALMSPID="TransportMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE="${PWD}/organizations/peerOrganizations/transport.coldchain.com/peers/peer0.transport.coldchain.com/tls/ca.crt"
    export CORE_PEER_MSPCONFIGPATH="${PWD}/organizations/peerOrganizations/transport.coldchain.com/users/Admin@transport.coldchain.com/msp"
    export CORE_PEER_ADDRESS="localhost:8051"
  elif [ "${USING_ORG}" == "Retailer" ]; then
    export CORE_PEER_LOCALMSPID="RetailerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE="${PWD}/organizations/peerOrganizations/retailer.coldchain.com/peers/peer0.retailer.coldchain.com/tls/ca.crt"
    export CORE_PEER_MSPCONFIGPATH="${PWD}/organizations/peerOrganizations/retailer.coldchain.com/users/Admin@retailer.coldchain.com/msp"
    export CORE_PEER_ADDRESS="localhost:9051"
  elif [ "${USING_ORG}" == "Regulator" ]; then
    export CORE_PEER_LOCALMSPID="RegulatorMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE="${PWD}/organizations/peerOrganizations/regulator.coldchain.com/peers/peer0.regulator.coldchain.com/tls/ca.crt"
    export CORE_PEER_MSPCONFIGPATH="${PWD}/organizations/peerOrganizations/regulator.coldchain.com/users/Admin@regulator.coldchain.com/msp"
    export CORE_PEER_ADDRESS="localhost:10051"
  else
    echo "Unknown Organization: ${USING_ORG}"
  fi

  export CORE_PEER_TLS_ENABLED=true
}
