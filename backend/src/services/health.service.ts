import { fabricGateway } from '../blockchain/fabricGateway';
import http from 'http';

export class HealthService {
  public getSystemHealth() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  public async getBlockchainHealth() {
    const isConnected = await fabricGateway.checkHealth();
    return {
      status: isConnected ? 'UP' : 'DOWN',
      channel: 'coldchain-channel',
      chaincode: 'coldchain',
      timestamp: new Date().toISOString(),
    };
  }

  public async getDatabaseHealth(): Promise<{ status: string; couchDB: string; timestamp: string }> {
    return new Promise((resolve) => {
      const req = http.get('http://admin:adminpw@localhost:5984/', (res) => {
        if (res.statusCode === 200) {
          resolve({ status: 'UP', couchDB: 'CouchDB 3.4.2 Connected', timestamp: new Date().toISOString() });
        } else {
          resolve({ status: 'DOWN', couchDB: 'CouchDB unreachable', timestamp: new Date().toISOString() });
        }
      });
      req.on('error', () => {
        resolve({ status: 'DOWN', couchDB: 'CouchDB connection error', timestamp: new Date().toISOString() });
      });
      req.setTimeout(2000, () => {
        req.destroy();
        resolve({ status: 'DOWN', couchDB: 'CouchDB timeout', timestamp: new Date().toISOString() });
      });
    });
  }
}

export const healthService = new HealthService();
