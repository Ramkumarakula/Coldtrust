import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const baseDir = path.resolve(__dirname, '../../../blockchain');

export const fabricConfig = {
  channelName: process.env.FABRIC_CHANNEL_NAME || 'coldchain-channel',
  chaincodeName: process.env.FABRIC_CHAINCODE_NAME || 'coldchain',
  mspId: process.env.FABRIC_MSPID || 'ManufacturerMSP',
  peerEndpoint: process.env.FABRIC_PEER_ENDPOINT || 'localhost:7051',
  peerHostOverride: process.env.FABRIC_PEER_HOST_OVERRIDE || 'peer0.manufacturer.coldchain.com',
  certPath: path.join(baseDir, 'organizations/peerOrganizations/manufacturer.coldchain.com/users/Admin@manufacturer.coldchain.com/msp/signcerts'),
  keyDirectoryPath: path.join(baseDir, 'organizations/peerOrganizations/manufacturer.coldchain.com/users/Admin@manufacturer.coldchain.com/msp/keystore'),
  tlsCertPath: path.join(baseDir, 'organizations/peerOrganizations/manufacturer.coldchain.com/peers/peer0.manufacturer.coldchain.com/tls/ca.crt'),
};
