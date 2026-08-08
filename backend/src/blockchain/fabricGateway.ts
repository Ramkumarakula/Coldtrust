import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { fabricConfig } from '../config/fabric';
import { logger } from '../config/logger';

class FabricGateway {
  private contract: Contract | null = null;
  private client: grpc.Client | null = null;

  public async getContract(): Promise<Contract> {
    if (this.contract) {
      return this.contract;
    }

    try {
      const tlsRootCert = await fs.readFile(fabricConfig.tlsCertPath);
      const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
      this.client = new grpc.Client(fabricConfig.peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': fabricConfig.peerHostOverride,
      });

      const identity = await this.newIdentity();
      const signer = await this.newSigner();

      const gateway = connect({
        client: this.client,
        identity,
        signer,
      });

      const network = gateway.getNetwork(fabricConfig.channelName);
      this.contract = network.getContract(fabricConfig.chaincodeName);
      logger.info(`Successfully connected to Fabric Gateway: channel=${fabricConfig.channelName}, chaincode=${fabricConfig.chaincodeName}`);
      return this.contract;
    } catch (error) {
      logger.error('Failed to connect to Fabric Gateway:', error);
      throw error;
    }
  }

  private async newIdentity(): Promise<Identity> {
    const certFiles = await fs.readdir(fabricConfig.certPath);
    const certFile = certFiles.find((f) => f.endsWith('.pem') || f.endsWith('.crt'));
    if (!certFile) {
      throw new Error(`No certificate file found in ${fabricConfig.certPath}`);
    }
    const credentials = await fs.readFile(path.join(fabricConfig.certPath, certFile));
    return { mspId: fabricConfig.mspId, credentials };
  }

  private async newSigner(): Promise<Signer> {
    const keyFiles = await fs.readdir(fabricConfig.keyDirectoryPath);
    const keyFile = keyFiles.find((f) => f.endsWith('_sk') || f.endsWith('.key') || f.endsWith('.pem'));
    if (!keyFile) {
      throw new Error(`No private key file found in ${fabricConfig.keyDirectoryPath}`);
    }
    const privateKeyPem = await fs.readFile(path.join(fabricConfig.keyDirectoryPath, keyFile));
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const contract = await this.getContract();
      return contract !== null;
    } catch {
      return false;
    }
  }
}

export const fabricGateway = new FabricGateway();
