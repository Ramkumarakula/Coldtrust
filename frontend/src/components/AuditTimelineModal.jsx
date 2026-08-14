import React, { useEffect, useState } from 'react';
import { X, History, ShieldCheck, Thermometer, MapPin, Clock, FileCode } from 'lucide-react';

export default function AuditTimelineModal({ isOpen, shipment, onClose, fetchHistory }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && shipment) {
      setLoading(true);
      fetchHistory(shipment.shipmentID)
        .then((data) => setHistory(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, shipment, fetchHistory]);

  if (!isOpen || !shipment) return null;

  return (
    <div className="modal-backdrop">
      <div className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl border-cyan-500/30">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">Cryptographic Audit History</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {shipment.shipmentID}
                </span>
              </div>
              <p className="text-xs text-slate-400">Immutable Ledger Traceability • Fabric v2.5</p>
            </div>
          </div>

          <span className={`badge badge-${shipment.status}`}>
            {shipment.status}
          </span>
        </div>

        {/* Temperature & Asset Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 mb-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Product</span>
            <strong className="text-slate-200">{shipment.productName}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Current Temp</span>
            <strong className={shipment.currentTemp > shipment.maxTemp ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {shipment.currentTemp}°C (Max {shipment.maxTemp}°C)
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Owner MSP</span>
            <strong className="text-cyan-400 font-mono">{shipment.owner}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Current Location</span>
            <strong className="text-slate-300">{shipment.location}</strong>
          </div>
        </div>

        {/* Step-by-Step Block Audit Timeline */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Fabric Ledger Commit History</span>
          </h4>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
              Querying Hyperledger Fabric key history...
            </div>
          ) : history.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No previous ledger revisions recorded.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {history.map((record, index) => {
                const val = record.value || {};
                const isCompromised = val.status === 'COMPROMISED';

                return (
                  <div key={record.txId || index} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 ${
                        isCompromised
                          ? 'bg-rose-500 border-rose-300 pulse-alert'
                          : 'bg-cyan-500 border-slate-900'
                      }`}
                    ></div>

                    <div className="glass-card p-3.5 rounded-lg text-xs space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-300">
                            Tx #{index + 1}
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
                        <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">TxID: {record.txId}</span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                        <div>
                          <span className="text-slate-500 block text-[9px]">Owner MSP</span>
                          <span className="text-slate-300 font-medium">{val.owner || 'ManufacturerMSP'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px]">Temperature</span>
                          <span className={val.currentTemp > val.maxTemp ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            {val.currentTemp !== undefined ? `${val.currentTemp}°C` : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px]">Location</span>
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
          <div className="mt-6 border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-indigo-400" />
              <span>IoT Telemetry Logs ({shipment.telemetryLogs.length})</span>
            </h4>

            <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-semibold">
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Temperature</th>
                    <th className="py-2 px-3">Humidity</th>
                    <th className="py-2 px-3">Location</th>
                    <th className="py-2 px-3">Reporter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {shipment.telemetryLogs.map((log, i) => (
                    <tr key={i} className={log.temperature > shipment.maxTemp ? 'bg-rose-950/20' : ''}>
                      <td className="py-2 px-3 font-mono text-slate-400 text-[10px]">{log.timestamp}</td>
                      <td className={`py-2 px-3 font-mono font-bold ${log.temperature > shipment.maxTemp ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {log.temperature}°C
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-300">{log.humidity}%</td>
                      <td className="py-2 px-3 text-slate-300">{log.location}</td>
                      <td className="py-2 px-3 font-mono text-slate-400 text-[10px]">{log.recordedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

