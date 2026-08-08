import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const POLL_INTERVAL_MS = 5000;

interface Shipment {
  shipmentID: string;
  productName: string;
  status: string;
  maxTemp: number;
}

const locations = [
  'Distribution Hub North, Dock 2',
  'Highway I-95 North, Mile 120',
  'Regional Transit Depot, Cold Room 4',
  'Highway I-95 North, Mile 240',
  'City Metro Perimeter, Dock 1',
];

async function runSimulator() {
  console.log('====================================================');
  console.log('🌡️  COLDTRUST REAL-TIME IOT TELEMETRY SIMULATOR');
  console.log(`📡 Connecting to Backend REST API: ${BACKEND_URL}`);
  console.log(`⏱️  Telemetry Interval: Every ${POLL_INTERVAL_MS / 1000} seconds`);
  console.log('====================================================');

  let tickCount = 0;

  setInterval(async () => {
    tickCount++;
    try {
      // 1. Fetch active shipments from backend
      const res = await axios.get(`${BACKEND_URL}/api/shipments`);
      if (!res.data || !res.data.success || !Array.isArray(res.data.data)) {
        console.log('⚠️ No shipments retrieved from backend.');
        return;
      }

      const shipments: Shipment[] = res.data.data;
      const activeShipments = shipments.filter(
        (s) => s.status === 'CREATED' || s.status === 'IN_TRANSIT' || s.status === 'COMPROMISED'
      );

      if (activeShipments.length === 0) {
        console.log('ℹ️ No active in-transit shipments to simulate. Create a shipment on dashboard first.');
        return;
      }

      console.log(`\n[Cycle #${tickCount}] Streaming IoT Telemetry for ${activeShipments.length} active assets...`);

      for (const s of activeShipments) {
        // Generate realistic temp: normal (2.2°C - 3.8°C) or breach (5.4°C - 6.2°C) on cycle #4
        let temperature: number;
        if (tickCount === 4 && s.status !== 'COMPROMISED') {
          // Trigger simulated temperature breach!
          temperature = +(5.2 + Math.random() * 1.5).toFixed(1);
          console.log(`🚨 SIMULATING TEMPERATURE SPIKE BREACH (${temperature}°C > ${s.maxTemp}°C) for ${s.shipmentID}!`);
        } else if (s.status === 'COMPROMISED') {
          temperature = +(4.8 + Math.random() * 1.0).toFixed(1);
        } else {
          temperature = +(2.2 + Math.random() * 1.4).toFixed(1);
        }

        const humidity = +(40 + Math.random() * 10).toFixed(1);
        const loc = locations[tickCount % locations.length];

        const telemetryPayload = {
          temperature,
          humidity,
          location: loc,
        };

        const postRes = await axios.post(
          `${BACKEND_URL}/api/shipments/${s.shipmentID}/telemetry`,
          telemetryPayload
        );

        if (postRes.data && postRes.data.success) {
          const updated = postRes.data.data;
          console.log(
            `  ✅ [${s.shipmentID}] Temp: ${temperature}°C | Humidity: ${humidity}% | Loc: ${loc} | Status: ${updated.status}`
          );
        }
      }
    } catch (err: any) {
      console.error('❌ Telemetry transmission error:', err.message || err);
    }
  }, POLL_INTERVAL_MS);
}

runSimulator();
