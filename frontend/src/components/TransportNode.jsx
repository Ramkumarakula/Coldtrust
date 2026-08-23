import React from 'react';

export default function TransportNode({ shipments = [], onAcceptCustody, onSimulateTelemetry, onInspectAudit }) {
  const pendingAcceptance = shipments.filter((s) => s.status === 'CREATED');
  const activeInTransit = shipments.filter((s) => s.status === 'IN_TRANSIT');

  const activeMonitored = activeInTransit.length > 0 ? activeInTransit[0] : (shipments.length > 0 ? shipments[0] : null);

  const telemetryLogs = activeMonitored && activeMonitored.telemetryLogs ? activeMonitored.telemetryLogs : [
    { timestamp: '14:02:11', type: 'UPDATE', message: 'TRK-882: Location updated (Lat: 40.71, Lon: -75.00)', isError: false },
    { timestamp: '14:02:08', type: 'BREACH', message: 'SEN-B-404: Temp exceeded 5.0°C (Value: 4.8°C)', isError: true },
    { timestamp: '14:01:55', type: 'UPDATE', message: 'SEN-A-901: Humidity nominal (45%)', isError: false },
    { timestamp: '14:01:30', type: 'EVENT', message: 'PKG-102: Custody accepted by TransportMSP', isError: false },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Carrier Control Tower Header Banner */}
      <div className="col-span-12 bg-surface-container border border-outline-variant rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
            <h1 className="font-display-center text-lg font-bold text-on-surface">SwiftCold Logistics</h1>
            <span className="font-data-mono text-[10px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-bold">
              TransportMSP
            </span>
          </div>
          <div className="font-body-dense text-xs text-on-surface-variant mt-0.5">
            CARRIER CONTROL TOWER &bull; PEER0.TRANSPORT.COLDCHAIN.COM:8051
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pendingAcceptance.length > 0 && (
            <span className="font-data-mono text-xs bg-amber-950/60 text-amber-400 border border-amber-800 px-2.5 py-1 rounded">
              {pendingAcceptance.length} PENDING CUSTODY
            </span>
          )}
          {activeMonitored && (
            <button
              onClick={() => onSimulateTelemetry(activeMonitored)}
              className="bg-primary-container text-on-primary-container font-label-caps text-xs font-bold py-2 px-3 rounded hover:bg-primary-container/80 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">sensors</span>
              <span>POST TELEMETRY</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Temperature Dashboard (Centerpiece) */}
      <section className="col-span-12 xl:col-span-8 bg-surface-container-high border border-outline-variant rounded p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
          <h2 className="font-headline-table text-headline-table text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">thermostat</span>
            Live Temperature Monitoring
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-data-mono text-data-mono text-on-surface-variant">
              Target SLA: {activeMonitored ? `${activeMonitored.minTemp}°C - ${activeMonitored.maxTemp}°C` : '2.0°C - 5.0°C'}
            </span>
            <span className="flex items-center gap-1 font-label-caps text-label-caps text-primary bg-primary/10 px-2 py-1 rounded">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-live"></span> LIVE SENSOR
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
          {/* Sensor 1 (Safe) */}
          <div className="bg-surface-container border border-outline-variant rounded p-4 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="font-data-mono text-data-mono text-on-surface-variant">SEN-A-901</span>
              <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
            </div>
            <div className="font-display-center text-display-center text-primary mt-2">
              {activeMonitored && activeMonitored.telemetryLogs && activeMonitored.telemetryLogs.length > 0
                ? `${activeMonitored.telemetryLogs[activeMonitored.telemetryLogs.length - 1].temperature}°C`
                : '2.4°C'}
            </div>
            <div className="mt-auto pt-4">
              <svg className="w-full h-8 text-primary opacity-50" viewBox="0 0 100 30">
                <path className="sparkline" d="M0,15 Q10,10 20,18 T40,15 T60,20 T80,12 T100,16"></path>
              </svg>
            </div>
          </div>

          {/* Sensor 2 (Breach) */}
          <div className="bg-error-container/20 border border-error rounded p-4 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-error animate-pulse-live"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="font-data-mono text-data-mono text-on-error-container">SEN-B-404</span>
              <span className="material-symbols-outlined text-error text-sm">warning</span>
            </div>
            <div className="font-display-center text-display-center text-error mt-2">4.8°C</div>
            <div className="mt-auto pt-4">
              <svg className="w-full h-8 text-error" viewBox="0 0 100 30">
                <path className="sparkline" d="M0,15 Q10,18 20,12 T40,8 T60,5 T80,2 T100,4"></path>
              </svg>
            </div>
          </div>

          {/* Sensor 3 (Safe) */}
          <div className="bg-surface-container border border-outline-variant rounded p-4 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="font-data-mono text-data-mono text-on-surface-variant">SEN-C-112</span>
              <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
            </div>
            <div className="font-display-center text-display-center text-primary mt-2">3.1°C</div>
            <div className="mt-auto pt-4">
              <svg className="w-full h-8 text-primary opacity-50" viewBox="0 0 100 30">
                <path className="sparkline" d="M0,15 Q10,16 20,14 T40,15 T60,17 T80,15 T100,16"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry Stream */}
      <aside className="col-span-12 xl:col-span-4 bg-surface-container border border-outline-variant rounded p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">stream</span>
            Live Telemetry Stream
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto font-data-mono text-data-mono space-y-2 pr-1 max-h-[220px]">
          {telemetryLogs.map((log, index) => (
            <div
              key={index}
              className={`flex gap-2 border-b border-outline-variant/50 pb-2 ${log.isError ? 'bg-error/5 -mx-2 px-2' : ''}`}
            >
              <span className="text-on-surface-variant">{log.timestamp || '14:02'}</span>
              <span className={log.isError ? 'text-error font-bold' : 'text-primary'}>
                [{log.type || 'LOG'}]
              </span>
              <span className="text-on-surface truncate">{log.message || log.location || 'Telemetry payload committed'}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Custody Acceptance Queue Banner (If items pending) */}
      {pendingAcceptance.length > 0 && (
        <div className="col-span-12 bg-amber-950/40 border border-amber-800 rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline-table text-sm font-bold text-amber-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-base">move_to_inbox</span>
              Dispatches Awaiting Custody Transfer ({pendingAcceptance.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingAcceptance.map((s) => (
              <div key={s.shipmentID} className="bg-surface-container border border-outline-variant p-3 rounded flex flex-col gap-2">
                <div className="flex justify-between items-center font-data-mono text-xs">
                  <span className="font-bold text-primary">{s.shipmentID}</span>
                  <span className="text-amber-400 font-bold">{s.status}</span>
                </div>
                <div className="font-body-dense text-xs text-on-surface font-semibold">{s.itemName}</div>
                <div className="font-data-mono text-[10px] text-on-surface-variant">
                  From: {s.manufacturer} &bull; To: {s.destination}
                </div>
                <button
                  onClick={() => onAcceptCustody(s.shipmentID)}
                  className="mt-1 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-label-caps text-xs font-bold py-1.5 px-3 rounded transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>ACCEPT CUSTODY (TAKE RESPONSIBILITY)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Shipments (In-Transit) Table */}
      <section className="col-span-12 bg-surface-container-high border border-outline-variant rounded flex flex-col overflow-hidden">
        <div className="p-4 border-b border-outline-variant bg-surface-container flex justify-between items-center">
          <h2 className="font-headline-table text-headline-table text-on-surface">Active Shipments (In-Transit & Ledger Roster)</h2>
          <span className="font-data-mono text-xs text-on-surface-variant">{shipments.length} consignments logged</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">Shipment ID</th>
                <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">Item Name</th>
                <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">Status</th>
                <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">SLA Range</th>
                <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">Current Holder</th>
                <th className="p-3 font-label-caps text-label-caps text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-dense text-body-dense">
              {shipments.map((s) => {
                const isBreached = s.status === 'COMPROMISED';
                return (
                  <tr
                    key={s.shipmentID}
                    className={`border-b border-outline-variant/50 hover:bg-surface-container-highest transition-colors ${
                      isBreached ? 'bg-error/5' : ''
                    }`}
                  >
                    <td className={`p-3 font-data-mono text-data-mono ${isBreached ? 'text-error font-bold' : 'text-primary'}`}>
                      {s.shipmentID}
                    </td>
                    <td className="p-3 font-body font-medium text-on-surface">{s.itemName}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                        s.status === 'IN_TRANSIT' ? 'bg-sky-950/60 text-sky-400 border border-sky-800' :
                        s.status === 'DELIVERED' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' :
                        s.status === 'COMPROMISED' ? 'bg-rose-950/60 text-rose-400 border border-rose-800' :
                        'bg-amber-950/60 text-amber-400 border border-amber-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isBreached ? 'bg-error animate-pulse-live' : 'bg-primary'}`}></span>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 font-data-mono text-on-surface-variant">
                      {s.minTemp}°C to {s.maxTemp}°C
                    </td>
                    <td className="p-3 text-on-surface">{s.currentHolder}</td>
                    <td className="p-3 text-right space-x-2">
                      {s.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => onSimulateTelemetry(s)}
                          className="font-label-caps text-xs text-primary hover:underline font-bold"
                        >
                          + Telemetry
                        </button>
                      )}
                      <button
                        onClick={() => onInspectAudit(s)}
                        className="font-label-caps text-xs text-on-surface-variant hover:text-on-surface hover:underline"
                      >
                        Audit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}