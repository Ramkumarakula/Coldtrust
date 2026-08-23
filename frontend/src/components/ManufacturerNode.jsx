import React from 'react';

export default function ManufacturerNode({ shipments = [], onOpenCreateModal, onInspectAudit }) {
  const createdBatches = shipments.filter(
    (s) => s.status === 'CREATED' || s.manufacturer === 'BioPharma Corp' || s.status === 'IN_TRANSIT' || s.status === 'DELIVERED' || s.status === 'COMPROMISED'
  );

  const totalCreated = shipments.length;
  const activeInTransit = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const totalDelivered = shipments.filter((s) => s.status === 'DELIVERED').length;
  const compromisedCount = shipments.filter((s) => s.status === 'COMPROMISED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container border border-outline-variant p-6 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">biotech</span>
            <h1 className="font-display-center text-xl font-extrabold text-on-surface">BioPharma Corp</h1>
            <span className="font-data-mono text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded border border-primary/20">
              ManufacturerMSP
            </span>
          </div>
          <p className="font-label-caps text-xs text-on-surface-variant mt-1">
            ORIGIN DISPATCH TERMINAL &bull; PEER0.MANUFACTURER.COLDCHAIN.COM:7051
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="bg-primary text-on-primary font-label-caps text-xs font-bold py-2.5 px-4 rounded hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2 shadow-sm self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>CREATE NEW CONSIGNMENT</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Batches</span>
          <div className="font-display-center text-2xl font-extrabold text-on-surface mt-1">{totalCreated}</div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">In Transit</span>
          <div className="font-display-center text-2xl font-extrabold text-primary mt-1">{activeInTransit}</div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Delivered</span>
          <div className="font-display-center text-2xl font-extrabold text-emerald-400 mt-1">{totalDelivered}</div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Compromised</span>
          <div className="font-display-center text-2xl font-extrabold text-error mt-1">{compromisedCount}</div>
        </div>
      </div>

      <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <h2 className="font-headline-table text-sm font-bold text-on-surface">Manufactured Consignment Batches</h2>
          <span className="font-data-mono text-xs text-on-surface-variant">{createdBatches.length} items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-highest font-label-caps text-on-surface-variant uppercase text-[10px] tracking-wider border-b border-outline-variant">
                <th className="p-3">Shipment ID</th>
                <th className="p-3">Item Name</th>
                <th className="p-3">SLA Range</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Current Custody</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-data-mono">
              {createdBatches.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-on-surface-variant font-label-caps">
                    No consignments logged yet. Click "CREATE NEW CONSIGNMENT" to dispatch first batch.
                  </td>
                </tr>
              ) : (
                createdBatches.map((s) => (
                  <tr key={s.shipmentID} className="hover:bg-surface-container-highest/50 transition-colors">
                    <td className="p-3 font-bold text-primary">{s.shipmentID}</td>
                    <td className="p-3 font-body font-medium text-on-surface">{s.itemName}</td>
                    <td className="p-3 text-on-surface-variant">
                      {s.minTemp}&deg;C to {s.maxTemp}&deg;C
                    </td>
                    <td className="p-3 text-on-surface-variant">{s.destination}</td>
                    <td className="p-3 text-on-surface">{s.currentHolder}</td>
                    <td className="p-3">
                      <span
                        className={'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + (
                          s.status === 'CREATED'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                            : s.status === 'IN_TRANSIT'
                            ? 'bg-sky-950/60 text-sky-400 border border-sky-800'
                            : s.status === 'DELIVERED'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800 animate-pulse'
                        )}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onInspectAudit(s)}
                        className="font-label-caps text-[11px] text-primary hover:underline"
                      >
                        Inspect Audit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}