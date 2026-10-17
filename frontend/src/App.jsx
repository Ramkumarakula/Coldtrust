import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TopNavBar from './components/TopNavBar.jsx';
import SideNavBar from './components/SideNavBar.jsx';
import ManufacturerNode from './components/ManufacturerNode.jsx';
import TransportNode from './components/TransportNode.jsx';
import RetailerNode from './components/RetailerNode.jsx';
import RegulatorNode from './components/RegulatorNode.jsx';
import CreateShipmentModal from './components/CreateShipmentModal.jsx';
import TelemetryModal from './components/TelemetryModal.jsx';
import AuditTimelineModal from './components/AuditTimelineModal.jsx';
import NotificationToast from './components/NotificationToast.jsx';
import LoginPage from './components/LoginPage.jsx';

const API_BASE = 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem('coldtrust_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function AppContent({ currentUser, onLogout }) {
  const [shipments, setShipments] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(currentUser?.role || 'Manufacturer');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedShipmentForTelemetry, setSelectedShipmentForTelemetry] = useState(null);
  const [selectedShipmentForAudit, setSelectedShipmentForAudit] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/transport') setSelectedOrg('Transport');
    else if (location.pathname === '/retailer') setSelectedOrg('Retailer');
    else if (location.pathname === '/regulator') setSelectedOrg('Regulator');
    else setSelectedOrg('Manufacturer');
  }, [location.pathname]);

  const fetchShipments = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(API_BASE + '/api/shipments', {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        onLogout();
        return;
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setShipments(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch shipments from backend API:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchShipments();
    const interval = setInterval(fetchShipments, 4000);
    return () => clearInterval(interval);
  }, [fetchShipments]);

  const handleCreateShipment = async (formData) => {
    try {
      const res = await fetch(API_BASE + '/api/shipments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) {
        setToast({ type: 'error', message: 'Error creating consignment: ' + (json.error?.message || 'Failed') });
      } else {
        setToast({ type: 'success', message: 'Consignment ' + formData.shipmentID + ' committed to Fabric ledger.' });
        fetchShipments();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Network error creating consignment: ' + err.message });
    }
  };

  const handleAcceptCustody = async (id) => {
    try {
      const res = await fetch(API_BASE + '/api/shipments/' + id + '/accept', {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!json.success) {
        setToast({ type: 'error', message: 'Error accepting custody: ' + (json.error?.message || 'Failed') });
      } else {
        setToast({ type: 'success', message: 'Custody of ' + id + ' transferred to TransportMSP.' });
        fetchShipments();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Network error: ' + err.message });
    }
  };

  const handleRecordTelemetry = async (id, telemetryData) => {
    try {
      const res = await fetch(API_BASE + '/api/shipments/' + id + '/telemetry', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(telemetryData),
      });
      const json = await res.json();
      if (!json.success) {
        setToast({ type: 'error', message: 'Error recording telemetry: ' + (json.error?.message || 'Failed') });
      } else {
        setToast({
          type: telemetryData.temperature > 4.0 ? 'warning' : 'success',
          message: telemetryData.temperature > 4.0
            ? 'Telemetry recorded. Breach detected (' + telemetryData.temperature + '°C). Asset COMPROMISED!'
            : 'Telemetry recorded cleanly (' + telemetryData.temperature + '°C).',
        });
        fetchShipments();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Network error recording telemetry: ' + err.message });
    }
  };

  const handleReceiveDelivery = async (id) => {
    try {
      const res = await fetch(API_BASE + '/api/shipments/' + id + '/receive', {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!json.success) {
        setToast({ type: 'error', message: 'Error receiving consignment: ' + (json.error?.message || 'Failed') });
      } else {
        setToast({ type: 'success', message: 'Consignment ' + id + ' marked DELIVERED to RetailerMSP.' });
        fetchShipments();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Network error receiving delivery: ' + err.message });
    }
  };

  const fetchShipmentHistory = async (id) => {
    try {
      const res = await fetch(API_BASE + '/api/shipments/' + id + '/history', {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        return json.data;
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  };

  const handlePrimaryAction = () => {
    if (selectedOrg === 'Manufacturer') setIsCreateOpen(true);
    else if (selectedOrg === 'Transport') {
      const activeInTransit = shipments.find((s) => s.status === 'IN_TRANSIT');
      if (activeInTransit) setSelectedShipmentForTelemetry(activeInTransit);
      else setToast({ type: 'info', message: 'No active in-transit consignment available for telemetry.' });
    } else if (selectedOrg === 'Retailer') {
      const activeInTransit = shipments.find((s) => s.status === 'IN_TRANSIT');
      if (activeInTransit) handleReceiveDelivery(activeInTransit.shipmentID);
      else setToast({ type: 'info', message: 'No incoming consignment available for receiving.' });
    } else if (selectedOrg === 'Regulator') {
      const compromised = shipments.find((s) => s.status === 'COMPROMISED');
      if (compromised) setSelectedShipmentForAudit(compromised);
      else if (shipments.length > 0) setSelectedShipmentForAudit(shipments[0]);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-standard antialiased min-h-screen flex flex-col overflow-x-hidden">
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      {/* Global Auth Status & Logout Pill */}
      <div className="fixed top-2 right-4 z-[60] flex items-center gap-2 bg-surface-container-high/90 backdrop-blur px-3 py-1 rounded-full border border-outline-variant text-xs shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-on-surface font-medium">
          {currentUser?.name || currentUser?.username} ({currentUser?.role})
        </span>
        <button
          onClick={onLogout}
          className="ml-2 px-2 py-0.5 rounded bg-error-container/20 text-error-container hover:bg-error-container/40 text-[10px] font-semibold cursor-pointer transition-colors"
          title="Sign out of ColdTrust"
        >
          Sign Out
        </button>
      </div>

      <TopNavBar
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        onRefresh={fetchShipments}
        isRefreshing={isRefreshing}
      />

      <div className="flex flex-1">
        <SideNavBar activeOrg={selectedOrg} onPrimaryAction={handlePrimaryAction} />

        <main className="flex-1 mt-12 lg:ml-72 p-container-padding overflow-y-auto overflow-x-hidden bg-background">
          <Routes>
            <Route path="/" element={<Navigate to="/manufacturer" replace />} />
            <Route
              path="/manufacturer"
              element={
                <ManufacturerNode
                  shipments={shipments}
                  onOpenCreateModal={() => setIsCreateOpen(true)}
                  onInspectAudit={(s) => setSelectedShipmentForAudit(s)}
                />
              }
            />
            <Route
              path="/transport"
              element={
                <TransportNode
                  shipments={shipments}
                  onAcceptCustody={handleAcceptCustody}
                  onSimulateTelemetry={(s) => setSelectedShipmentForTelemetry(s)}
                  onInspectAudit={(s) => setSelectedShipmentForAudit(s)}
                />
              }
            />
            <Route
              path="/retailer"
              element={
                <RetailerNode
                  shipments={shipments}
                  onReceiveDelivery={handleReceiveDelivery}
                  onInspectAudit={(s) => setSelectedShipmentForAudit(s)}
                />
              }
            />
            <Route
              path="/regulator"
              element={
                <RegulatorNode
                  shipments={shipments}
                  onInspectAudit={(s) => setSelectedShipmentForAudit(s)}
                />
              }
            />
          </Routes>
        </main>
      </div>

      <CreateShipmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateShipment}
      />

      <TelemetryModal
        isOpen={!!selectedShipmentForTelemetry}
        shipment={selectedShipmentForTelemetry}
        onClose={() => setSelectedShipmentForTelemetry(null)}
        onSubmit={handleRecordTelemetry}
      />

      <AuditTimelineModal
        isOpen={!!selectedShipmentForAudit}
        shipment={selectedShipmentForAudit}
        onClose={() => setSelectedShipmentForAudit(null)}
        fetchHistory={fetchShipmentHistory}
      />
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('coldtrust_user');
      const token = localStorage.getItem('coldtrust_jwt_token');
      if (savedUser && token) {
        return JSON.parse(savedUser);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem('coldtrust_jwt_token');
    localStorage.removeItem('coldtrust_user');
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <AppContent currentUser={currentUser} onLogout={handleLogout} />
    </Router>
  );
}
