import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import KpiGrid from './components/KpiGrid';
import ShipmentTable from './components/ShipmentTable';
import CreateShipmentModal from './components/CreateShipmentModal';
import TelemetryModal from './components/TelemetryModal';
import AuditTimelineModal from './components/AuditTimelineModal';
import NotificationToast from './components/NotificationToast';

const API_BASE = 'http://localhost:3000';

export default function App() {
  const [shipments, setShipments] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('Manufacturer');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

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
    try {
      const res = await fetch(`${API_BASE}/api/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) {
        setToast({ type: 'error', message: `Error creating consignment: ${json.error?.message || 'Failed'}` });
      } else {
        setToast({ type: 'success', message: `Consignment ${formData.shipmentID} committed to Fabric ledger.` });
        fetchShipments();
      }
    } catch (err) {
      setToast({ type: 'error', message: `Network error creating consignment: ${err.message}` });
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
        setToast({ type: 'error', message: `Error accepting custody: ${json.error?.message}` });
      } else {
        setToast({ type: 'success', message: `Custody of ${id} transferred to TransportMSP.` });
        fetchShipments();
      }
    } catch (err) {
      setToast({ type: 'error', message: `Network error: ${err.message}` });
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
        setToast({ type: 'error', message: `Error recording telemetry: ${json.error?.message}` });
      } else {
        setToast({
          type: telemetryData.temperature > 4.0 ? 'warning' : 'success',
          message: telemetryData.temperature > 4.0
            ? `Telemetry recorded. Breach detected (${telemetryData.temperature}°C). Asset COMPROMISED!`
            : `Telemetry telemetry recorded cleanly (${telemetryData.temperature}°C).`,
        });
        fetchShipments();
      }
    } catch (err) {
      setToast({ type: 'error', message: `Network error recording telemetry: ${err.message}` });
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
        setToast({ type: 'error', message: `Error receiving consignment: ${json.error?.message}` });
      } else {
        setToast({ type: 'success', message: `Consignment ${id} marked DELIVERED to RetailerMSP.` });
        fetchShipments();
      }
    } catch (err) {
      setToast({ type: 'error', message: `Network error receiving delivery: ${err.message}` });
    }
  };

  // Fetch History for Audit Drawer
  const fetchShipmentHistory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/shipments/${id}/history`);
      const json = await res.json();
      if (json.success) {
        return json.data;
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Toast Notification Container */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navbar */}
      <Navbar
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        onRefresh={fetchShipments}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* Operational KPI Grid */}
      <KpiGrid shipments={shipments} />

      {/* Main Logistics Consignment Table */}
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

      {/* Audit History & Telemetry Drawer */}
      <AuditTimelineModal
        isOpen={!!selectedShipmentForAudit}
        shipment={selectedShipmentForAudit}
        onClose={() => setSelectedShipmentForAudit(null)}
        fetchHistory={fetchShipmentHistory}
      />
    </div>
  );
}
