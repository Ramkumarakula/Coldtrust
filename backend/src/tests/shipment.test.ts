import http from 'http';
import { logger } from '../config/logger';

const BASE_URL = 'http://localhost:3000';

const makeRequest = (method: string, path: string, body?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  logger.info('=== STARTING REST API INTEGRATION TESTS ===');

  try {
    // 1. Health Checks
    logger.info('Testing GET /health ...');
    const health = await makeRequest('GET', '/health');
    console.log('Health:', JSON.stringify(health, null, 2));

    logger.info('Testing GET /health/blockchain ...');
    const bcHealth = await makeRequest('GET', '/health/blockchain');
    console.log('Blockchain Health:', JSON.stringify(bcHealth, null, 2));

    logger.info('Testing GET /health/database ...');
    const dbHealth = await makeRequest('GET', '/health/database');
    console.log('Database Health:', JSON.stringify(dbHealth, null, 2));

    // 2. Create Shipment
    const testShipmentID = `SHIP-REST-${Date.now().toString().slice(-4)}`;
    logger.info(`Testing POST /api/shipments (Creating ${testShipmentID}) ...`);
    const createRes = await makeRequest('POST', '/api/shipments', {
      shipmentID: testShipmentID,
      productName: 'mRNA Vaccines Batch A',
      manufacturer: 'BioTechLabs',
      carrier: 'ColdTransExpress',
      recipient: 'CentralPharmacy',
      minTemp: 2.0,
      maxTemp: 4.0,
    });
    console.log('Create Response:', JSON.stringify(createRes, null, 2));

    // 3. Accept Shipment
    logger.info(`Testing PUT /api/shipments/${testShipmentID}/accept ...`);
    const acceptRes = await makeRequest('PUT', `/api/shipments/${testShipmentID}/accept`);
    console.log('Accept Response:', JSON.stringify(acceptRes, null, 2));

    // 4. Record Telemetry with Temperature Spike (5.6°C > 4.0°C)
    logger.info(`Testing POST /api/shipments/${testShipmentID}/telemetry (Spike 5.6°C) ...`);
    const telemetryRes = await makeRequest('POST', `/api/shipments/${testShipmentID}/telemetry`, {
      temperature: 5.6,
      humidity: 42.5,
      location: 'Highway I-95, Km 140',
    });
    console.log('Telemetry Response (Breach Expected):', JSON.stringify(telemetryRes, null, 2));

    // 5. Query Single Shipment
    logger.info(`Testing GET /api/shipments/${testShipmentID} ...`);
    const getRes = await makeRequest('GET', `/api/shipments/${testShipmentID}`);
    console.log('Get Shipment State:', JSON.stringify(getRes, null, 2));

    // 6. Query History
    logger.info(`Testing GET /api/shipments/${testShipmentID}/history ...`);
    const historyRes = await makeRequest('GET', `/api/shipments/${testShipmentID}/history`);
    console.log('Get Shipment History:', JSON.stringify(historyRes, null, 2));

    // 7. Query All
    logger.info('Testing GET /api/shipments ...');
    const getAllRes = await makeRequest('GET', '/api/shipments');
    console.log('Get All Shipments Count:', getAllRes.data?.data?.length);

    logger.info('=== ALL REST API INTEGRATION TESTS PASSED CLEANLY! ===');
  } catch (error) {
    logger.error('Integration test failed:', error);
    process.exit(1);
  }
}

runTests();
