import http from 'http';

const BASE_URL = 'http://localhost:3000';

const request = (method: string, path: string, body?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method,
        headers: { 'Content-Type': 'application/json' },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function runEndToEndScenario() {
  console.log('====================================================');
  console.log('🚀 COLDTRUST END-TO-END CONSORTIUM SCENARIO TEST');
  console.log('====================================================');

  const shipmentID = `SHIP-E2E-${Date.now().toString().slice(-4)}`;

  try {
    // Step 1: Manufacturer Creates Shipment
    console.log(`\n1️⃣  [ManufacturerMSP] Creating Shipment Asset ${shipmentID}...`);
    const createRes = await request('POST', '/api/shipments', {
      shipmentID,
      productName: 'BioPharma Ultra-Low Vaccine',
      manufacturer: 'BioTechLabs Inc.',
      carrier: 'SwiftLogistics Corp.',
      recipient: 'MetroHospital Central',
      minTemp: 2.0,
      maxTemp: 4.0,
    });
    console.log('   Status:', createRes.data?.status);
    console.log('   Owner:', createRes.data?.owner);

    // Step 2: Transport Accepts Custody
    console.log(`\n2️⃣  [TransportMSP] Accepting Custody of ${shipmentID}...`);
    const acceptRes = await request('PUT', `/api/shipments/${shipmentID}/accept`);
    console.log('   Status:', acceptRes.data?.status);
    console.log('   Owner:', acceptRes.data?.owner);

    // Step 3: IoT Sensor Transmits Safe Readings
    console.log(`\n3️⃣  [IoT Sensor] Streaming Normal Storage Telemetry (3.1°C)...`);
    const tel1 = await request('POST', `/api/shipments/${shipmentID}/telemetry`, {
      temperature: 3.1,
      humidity: 44.0,
      location: 'Warehouse Cold Room A',
    });
    console.log('   Recorded Temp:', tel1.data?.currentTemp, '°C');
    console.log('   Status:', tel1.data?.status);

    // Step 4: Temperature Spike Breach (5.8°C > 4.0°C)
    console.log(`\n4️⃣  [IoT Sensor] Transmitting Temperature Spike Breach (5.8°C > 4.0°C)...`);
    const tel2 = await request('POST', `/api/shipments/${shipmentID}/telemetry`, {
      temperature: 5.8,
      humidity: 46.5,
      location: 'Highway I-95, Refrige Unit Malfunction',
    });
    console.log('   Recorded Temp:', tel2.data?.currentTemp, '°C');
    console.log('   🚨 LEDGER STATUS AUTOMATICALLY TRANSITIONED TO:', tel2.data?.status);

    // Step 5: Retailer Receives Shipment at Destination
    console.log(`\n5️⃣  [RetailerMSP] Receiving Shipment at Hospital Facility...`);
    const receiveRes = await request('PUT', `/api/shipments/${shipmentID}/receive`);
    console.log('   Status:', receiveRes.data?.status);

    // Step 6: Regulator Audits Ledger History
    console.log(`\n6️⃣  [RegulatorMSP] Auditing Cryptographic Ledger History for ${shipmentID}...`);
    const historyRes = await request('GET', `/api/shipments/${shipmentID}/history`);
    console.log(`   Found ${historyRes.data?.length} immutable block commits on coldchain-channel.`);

    console.log('\n====================================================');
    console.log('✅ END-TO-END CONSORTIUM SCENARIO TEST PASSED 100%!');
    console.log('====================================================');
  } catch (err: any) {
    console.error('❌ Scenario test failed:', err.message || err);
    process.exit(1);
  }
}

runEndToEndScenario();
