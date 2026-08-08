import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import KpiGrid from './components/KpiGrid';
import ShipmentTable from './components/ShipmentTable';
import CreateShipmentModal from './components/CreateShipmentModal';
import TelemetryModal from './components/TelemetryModal';
import AuditTimelineModal from './components/AuditTimelineModal';

const API_BASE = 'http://localhost:3000';

export default function App() {
  const [shipments, setShipments] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('Manufacturer');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedShipmentForTelemetry, setSelectedShipmentForTelemetry] = useState(null);
  const [selectedShipmentForAudit, setSelectedShipmentForAudit] = useState(null);

  // Fetch all shipments from REST API backend
  const fetchShipments = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/api/shipments`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setShipments(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch shipments from backend API:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch & 4-second auto-poll
  useEffect(() => {
    fetchShipments();
    const interval = setInterval(fetchShipments, 4000);
    return () => clearInterval(interval);
  }, [fetchShipments]);

  // Create Shipment Handler
  const handleCreateShipment = async (formData) => {
    const res = await fetch(`${API_BASE}/api/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (!json.success) {
      alert(`Error creating shipment: ${json.error?.message || 'Failed'}`);
    } else {
      fetchShipments();
    }
  };

  // Accept Custody Handler (Transport Org)
  const handleAcceptCustody = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/shipments/${id}/accept`, {
        method: 'PUT',
      });
      const json = await res.json();
      if (!json.success) {
        alert(`Error accepting custody: ${json.error?.message}`);
      } else {
        fetchShipments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Record Telemetry Handler
  const handleRecordTelemetry = async (id, telemetryData) => {
    try {
      const res = await fetch(`${API_BASE}/api/shipments/${id}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telemetryData),
      });
      const json = await res.json();
      if (!json.success) {
        alert(`Error recording telemetry: ${json.error?.message}`);
      } else {
        fetchShipments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Receive Delivery Handler (Retailer Org)
  const handleReceiveDelivery = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/shipments/${id}/receive`, {
        method: 'PUT',
      });
      const json = await res.json();
      if (!json.success) {
        alert(`Error receiving shipment: ${json.error?.message}`);
      } else {
        fetchShipments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch History for Audit Modal
  const fetchShipmentHistory = async (id) => {
    const res = await fetch(`${API_BASE}/api/shipments/${id}/history`);
    const json = await res.json();
    if (json.success) {
      return json.data;
    }
    return [];
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Top Navbar */}
      <Navbar
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        onRefresh={fetchShipments}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* KPI Cards Grid */}
      <KpiGrid shipments={shipments} />

      {/* Main Logistics Shipment Table */}
      <ShipmentTable
        shipments={shipments}
        selectedOrg={selectedOrg}
        onInspectAudit={(s) => setSelectedShipmentForAudit(s)}
        onAcceptCustody={handleAcceptCustody}
        onSimulateTelemetry={(s) => setSelectedShipmentForTelemetry(s)}
        onReceiveDelivery={handleReceiveDelivery}
      />

      {/* Create Shipment Modal */}
      <CreateShipmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateShipment}
      />

      {/* Simulate IoT Telemetry Modal */}
      <TelemetryModal
        isOpen={!!selectedShipmentForTelemetry}
        shipment={selectedShipmentForTelemetry}
        onClose={() => setSelectedShipmentForTelemetry(null)}
        onSubmit={handleRecordTelemetry}
      />

      {/* Audit History & Timeline Modal */}
      <AuditTimelineModal
        isOpen={!!selectedShipmentForAudit}
        shipment={selectedShipmentForAudit}
        onClose={() => setSelectedShipmentForAudit(null)}
        fetchHistory={fetchShipmentHistory}
      />
    </div>
  );
}
