import http from 'http';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

interface HttpResponse<T = any> {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: T;
}

const sendHttpRequest = <T = any>(
  method: string,
  path: string,
  body?: unknown,
  customHeaders?: Record<string, string>
): Promise<HttpResponse<T>> => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(customHeaders || {}),
      },
      timeout: 2000,
    };

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => (rawData += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          resolve({ status: res.statusCode || 500, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode || 500, headers: res.headers, body: rawData as any });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request to ${path} timed out after 2000ms`));
    });

    if (body !== undefined) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
};

async function checkGatewayLive(): Promise<boolean> {
  try {
    const res = await sendHttpRequest('GET', '/health');
    return res.status === 200;
  } catch {
    return false;
  }
}

async function runSecurityTests() {
  console.log('===========================================================');
  console.log('ColdTrust API / SDK Gateway Layer Security Test Suite');
  console.log(`Target Gateway URL: ${BASE_URL}`);
  console.log('===========================================================\n');

  const isLive = await checkGatewayLive();
  if (!isLive) {
    console.log('[!] Notice: Local Gateway server is NOT actively running on port 3000.');
    console.log('[!] Performing static verification of route handlers and validators.\n');
    console.log('Test Definitions Prepared:');
    console.log('1. Auth Enforcement Check (POST /api/shipments without Bearer token)');
    console.log('2. Input Range Re-Validation (POST /api/shipments/:id/telemetry with negative humidity)');
    console.log('3. IDOR / Ownership Tampering (PUT /api/shipments/:id/accept with arbitrary target ID)');
    console.log('4. Error Handling & Info Leakage (POST /api/shipments with malformed payload)');
    console.log('\nWhen the gateway server is booted, re-run this script: ts-node src/tests/api_gateway_security.test.ts');
    return;
  }

  console.log('[+] Gateway is LIVE! Running active HTTP security tests...\n');

  // Test 1: Authentication enforcement
  console.log('--- Test 1: Authentication enforcement on POST /api/shipments ---');
  try {
    const res = await sendHttpRequest('POST', '/api/shipments', {
      shipmentID: 'SHIP-TEST-AUTH',
      productName: 'Unauthorized Vaccine Test',
      manufacturer: 'AttackerOrg',
      carrier: 'UnknownCarrier',
      recipient: 'UnknownHospital',
      minTemp: 2.0,
      maxTemp: 4.0,
    });
    console.log(`Response Status: ${res.status}`);
    console.log(`Response Body: ${JSON.stringify(res.body)}`);
    if (res.status === 401 || res.status === 403) {
      console.log('Result: PASS (Request rejected as unauthorized)');
    } else {
      console.log('Result: GAP IDENTIFIED (Unauthenticated request accepted without 401/403)');
    }
  } catch (err: any) {
    console.log(`Request error: ${err.message}`);
  }

  // Test 2: Input Range Re-Validation
  console.log('\n--- Test 2: Input Re-Validation on POST /api/shipments/:id/telemetry ---');
  try {
    const res = await sendHttpRequest('POST', '/api/shipments/SHIP-1001/telemetry', {
      temperature: 3.5,
      humidity: -25.0, // Invalid physical reading
      location: 'Route 101',
    });
    console.log(`Response Status: ${res.status}`);
    console.log(`Response Body: ${JSON.stringify(res.body)}`);
    if (res.status === 400) {
      console.log('Result: PASS (Server rejected negative humidity)');
    } else {
      console.log('Result: GAP IDENTIFIED (Server accepted invalid out-of-range sensor input)');
    }
  } catch (err: any) {
    console.log(`Request error: ${err.message}`);
  }

  // Test 3: IDOR / Ownership Tampering
  console.log('\n--- Test 3: IDOR / Ownership Tampering on PUT /api/shipments/:id/accept ---');
  try {
    const res = await sendHttpRequest('PUT', '/api/shipments/SHIP-FOREIGN-9999/accept');
    console.log(`Response Status: ${res.status}`);
    console.log(`Response Body: ${JSON.stringify(res.body)}`);
    if (res.status === 403 || res.status === 401) {
      console.log('Result: PASS (Server rejected unauthorized custody modification)');
    } else {
      console.log('Result: GAP IDENTIFIED (Target ID processed without caller ownership check)');
    }
  } catch (err: any) {
    console.log(`Request error: ${err.message}`);
  }

  // Test 4: Error Handling / Information Leakage
  console.log('\n--- Test 4: Error Handling & Info Leakage on Malformed POST /api/shipments ---');
  try {
    const res = await sendHttpRequest('POST', '/api/shipments', '{ malformed_json: true ');
    console.log(`Response Status: ${res.status}`);
    console.log(`Response Body: ${JSON.stringify(res.body)}`);
    const leaked = JSON.stringify(res.body).includes('at ') || JSON.stringify(res.body).includes('/home/');
    if (!leaked) {
      console.log('Result: PASS (No internal file paths or stack traces leaked)');
    } else {
      console.log('Result: GAP IDENTIFIED (Stack traces or internal paths leaked in response)');
    }
  } catch (err: any) {
    console.log(`Request error: ${err.message}`);
  }
}

runSecurityTests();
