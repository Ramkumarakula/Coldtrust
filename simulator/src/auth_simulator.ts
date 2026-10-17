// auth_simulator.ts – run this instead of the original simulator to send a JWT token
import axios from 'axios';

// Backend endpoint (same as original)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const POLL_INTERVAL_MS = 5000;

// JWT token – you can replace this with a fresh token if it expires
const JWT_TOKEN = process.env.SIMULATOR_JWT ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbnVmYWN0dXJlciIsInJvbGUiOiJNYW51ZmFjdHVyZXIiLCJtc3BJZCI6Ik1hbnVmYWN0dXJlck1TUCIsImlhdCI6MTc5MjEyODE4NCwiZXhwIjoxNzkyMTU2OTg0fQ.r8JyGj44KyIC3eY8fkakbr_Vm4J45mk6t3CzAELSwBg';

// Attach the token to every outgoing request
axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`;

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
  console.log('🌡️  COLDTRUST REAL‑TIME IOT TELEMETRY SIMULATOR');
  console.log(`📡 Connecting to Backend REST API: ${BACKEND_URL}`);
  console.log(`⏱️  Telemetry Interval: Every ${POLL_INTERVAL_MS / 1000} seconds`);
  console.log('====================================================');

  let tickCount = 0;

  setInterval(async () => {
    tickCount++;
    try {
      const res = await axios.get(`${BACKEND_URL}/api/shipments`);
      if (!res.data?.success || !Array.isArray(res.data.data)) {
        console.log('⚠️ No shipments retrieved from backend.');
        return;
      }
      const shipments: Shipment[] = res.data.data;
      const active = shipments.filter(s =>
        s.status === 'CREATED' || s.status === 'IN_TRANSIT' || s.status === 'COMPROMISED'
      );
      if (active.length === 0) {
        console.log('ℹ️ No active shipments – create one via the dashboard first.');
        return;
      }
      console.log(`\n[Cycle #${tickCount}] Streaming telemetry for ${active.length} shipments...`);

      for (const s of active) {
        let temperature: number;
        if (tickCount === 4 && s.status !== 'COMPROMISED') {
          temperature = +(5.2 + Math.random() * 1.5).toFixed(1);
          console.log(`🚨 SIMULATED BREACH (${temperature}°C > ${s.maxTemp}°C) for ${s.shipmentID}`);
        } else if (s.status === 'COMPROMISED') {
          temperature = +(4.8 + Math.random() * 1.0).toFixed(1);
        } else {
          temperature = +(2.2 + Math.random() * 1.4).toFixed(1);
        }
        const humidity = +(40 + Math.random() * 10).toFixed(1);
        const loc = locations[tickCount % locations.length];
        const payload = { temperature, humidity, location: loc };
        const post = await axios.post(`${BACKEND_URL}/api/shipments/${s.shipmentID}/telemetry`, payload);
        if (post.data?.success) {
          console.log(`  ✅ [${s.shipmentID}] ${temperature}°C | ${humidity}% | ${loc} | ${post.data.data.status}`);
        }
      }
    } catch (e: any) {
      console.error('❌ Telemetry error:', e.message || e);
    }
  }, POLL_INTERVAL_MS);
}

runSimulator();
