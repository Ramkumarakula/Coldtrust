import React from 'react';

export default function RetailerNode({ shipments = [], onReceiveDelivery, onInspectAudit }) {
  const incoming = shipments.filter((s) => s.status === 'IN_TRANSIT');
  const targetShipment = incoming.length > 0 ? incoming[0] : null;

  const latestTelemetry = targetShipment && targetShipment.telemetryLogs && targetShipment.telemetryLogs.length > 0
    ? targetShipment.telemetryLogs[targetShipment.telemetryLogs.length - 1]
    : null;

  const isTemperatureBreached = latestTelemetry ? latestTelemetry.temperature > targetShipment.maxTemp : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container border border-outline-variant p-6 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-2xl">storefront</span>
            <h1 className="font-display-center text-xl font-extrabold text-on-surface">Apex Pharmacy Networks</h1>
            <span className="font-data-mono text-xs bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
              RetailerMSP
            </span>
          </div>
          <p className="font-label-caps text-xs text-on-surface-variant mt-1">
            RECEIVING DOCK &bull; PEER0.RETAILER.COLDCHAIN.COM:9051
          </p>
        </div>
      </div>

      {targetShipment ? (
        <div
          className={'p-6 rounded-lg border flex flex-col md:flex-row items-center justify-between gap-6 shadow-md ' + (
            isTemperatureBreached
              ? 'bg-rose-950/40 border-rose-800 text-rose-200'
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
          )}
        >
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="material-symbols-outlined text-3xl">
                {isTemperatureBreached ? 'warning' : 'verified_user'}
              </span>
              <h2 className="font-display-center text-lg font-extrabold tracking-wide uppercase">
                {isTemperatureBreached ? 'QA REJECTION WARNING: TEMPERATURE BREACH DETECTED' : 'QA SAFE: CONSIGNMENT WITHIN SLA BOUNDS'}
              </h2>
            </div>

            <p className="font-body text-sm">
              Consignment <span className="font-bold font-data-mono">{targetShipment.shipmentID}</span> ({targetShipment.itemName})
              is currently registered at <span className="font-bold">{latestTelemetry ? `${latestTelemetry.temperature}°C` : 'N/A'}</span>.
            </p>

            <div className="font-data-mono text-xs opacity-90">
              Allowed SLA Bounds: {targetShipment.minTemp}&deg;C to {targetShipment.maxTemp}&deg;C
            </div>
          </div>

          <button
            onClick={() => onReceiveDelivery(targetShipment.shipmentID)}
            className={'font-label-caps text-xs font-bold py-3 px-6 rounded transition-all shadow-md shrink-0 flex items-center gap-2 ' + (
              isTemperatureBreached
                ? 'bg-error text-on-error hover:bg-rose-600'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold'
            )}
          >
            <span className="material-symbols-outlined text-lg">inventory_2</span>
            <span>CONFIRM & RECEIVE DELIVERY</span>
          </button>
        </div>
      ) : (
        <div className="bg-surface-container border border-outline-variant p-6 rounded-lg text-center text-on-surface-variant font-label-caps text-xs">
          No dispatches currently in transit for receiving dock inspection.
        </div>
      )}

      <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <h2 className="font-headline-table text-sm font-bold text-on-surface">Retail Inventory & Receiving Roster</h2>
          <span className="font-data-mono text-xs text-on-surface-variant">{shipments.length} items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-highest font-label-caps text-on-surface-variant uppercase text-[10px] tracking-wider border-b border-outline-variant">
                <th className="p-3">Shipment ID</th>
                <th className="p-3">Item Name</th>
                <th className="p-3">Current Holder</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-data-mono">
              {shipments.map((s) => (
                <tr key={s.shipmentID} className="hover:bg-surface-container-highest/50 transition-colors">
                  <td className="p-3 font-bold text-primary">{s.shipmentID}</td>
                  <td className="p-3 font-body font-medium text-on-surface">{s.itemName}</td>
                  <td className="p-3 text-on-surface-variant">{s.currentHolder}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-container-highest text-on-surface">
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onInspectAudit(s)}
                      className="font-label-caps text-[11px] text-primary hover:underline"
                    >
                      Verify Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}