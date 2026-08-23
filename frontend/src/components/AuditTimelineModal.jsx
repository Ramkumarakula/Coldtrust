import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Clock, FileCode, Thermometer, History, Building2 } from 'lucide-react';
import TemperatureChart from './TemperatureChart';
import RouteMapVisualizer from './RouteMapVisualizer';

export default function AuditTimelineModal({ isOpen, shipment, onClose, fetchHistory }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && shipment) {
      setLoading(true);
      fetchHistory(shipment.shipmentID)
        .then((data) => setHistory(data || []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, shipment, fetchHistory]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !shipment) return null;

  return (
    <div className="modal-backdrop">
      <div
        className="enterprise-card w-full max-w-3xl h-[90vh] max-h-[900px] flex flex-col relative shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-drawer-title"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="audit-drawer-title" className="text-base font-bold text-slate-100">
                  Consignment Audit & Telemetry Trace
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-950 text-sky-400 border border-slate-800">
                  {shipment.shipmentID}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Immutable Ledger Traceability • Fabric v2.5
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`badge badge-${shipment.status}`}>
              {shipment.status}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close Audit Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Asset Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Product Name</span>
              <strong className="text-slate-200">{shipment.productName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Telemetry Temp</span>
              <strong className={shipment.currentTemp > shipment.maxTemp ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                {shipment.currentTemp}°C (Max {shipment.maxTemp}°C)
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Custodian MSP</span>
              <strong className="text-sky-400 font-mono">{shipment.owner}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Current Location</span>
              <strong className="text-slate-300">{shipment.location}</strong>
            </div>
          </div>

          {/* Custody Route Progression */}
          <RouteMapVisualizer shipment={shipment} />

          {/* Time-Series Temperature Telemetry Chart */}
          <TemperatureChart
            telemetryLogs={shipment.telemetryLogs}
            minTemp={shipment.minTemp}
            maxTemp={shipment.maxTemp}
            currentTemp={shipment.currentTemp}
          />

          {/* Fabric Ledger Revision History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Hyperledger Fabric Key Revision History</span>
            </h4>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400 animate-pulse font-mono">
                Querying Hyperledger Fabric key history on coldchain-channel...
              </div>
            ) : history.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 font-mono">
                No previous ledger revisions recorded.
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {history.map((record, index) => {
                  const val = record.value || {};
                  const isCompromised = val.status === 'COMPROMISED';

                  return (
                    <div key={record.txId || index} className="relative group">
                      <div
                        className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 ${
                          isCompromised
                            ? 'bg-rose-500 border-rose-300'
                            : 'bg-sky-500 border-slate-900'
                        }`}
                      ></div>

                      <div className="enterprise-card p-3.5 text-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-slate-300">
                              Revision #{index + 1}
                            </span>
                            <span className={`badge badge-${val.status || 'CREATED'}`}>
                              {val.status || 'CREATED'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{record.timestamp}</span>
                          </div>
                        </div>

                        {/* Tx Hash */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                          <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate">TxID: {record.txId}</span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
                          <div>
                            <span className="text-slate-500 block text-[9px] uppercase">Owner MSP</span>
                            <span className="text-slate-300">{val.owner || 'ManufacturerMSP'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px] uppercase">Temp</span>
                            <span className={val.currentTemp > val.maxTemp ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                              {val.currentTemp !== undefined ? `${val.currentTemp}°C` : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px] uppercase">Location</span>
                            <span className="text-slate-300">{val.location || 'Origin'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Telemetry Logs Table */}
          {shipment.telemetryLogs && shipment.telemetryLogs.length > 0 && (
            <div className="border-t border-slate-800 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-mono">
                <Thermometer className="w-4 h-4 text-indigo-400" />
                <span>Raw Sensor Telemetry Log Stream ({shipment.telemetryLogs.length})</span>
              </h4>

              <div className="bg-slate-950 rounded-lg overflow-x-auto border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-semibold">
                      <th className="py-2 px-3">Timestamp</th>
                      <th className="py-2 px-3">Temperature</th>
                      <th className="py-2 px-3">Humidity</th>
                      <th className="py-2 px-3">Location</th>
                      <th className="py-2 px-3">Reporter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-[11px]">
                    {shipment.telemetryLogs.map((log, i) => (
                      <tr key={i} className={log.temperature > shipment.maxTemp ? 'bg-rose-950/20' : ''}>
                        <td className="py-2 px-3 text-slate-400 text-[10px]">{log.timestamp}</td>
                        <td className={`py-2 px-3 font-bold ${log.temperature > shipment.maxTemp ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {log.temperature}°C
                        </td>
                        <td className="py-2 px-3 text-slate-300">{log.humidity}%</td>
                        <td className="py-2 px-3 text-slate-300">{log.location}</td>
                        <td className="py-2 px-3 text-slate-400 text-[10px]">{log.recordedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
