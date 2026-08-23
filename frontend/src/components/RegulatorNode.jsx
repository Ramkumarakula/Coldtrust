import React from 'react';
import ConsortiumTopology from './ConsortiumTopology.jsx';

export default function RegulatorNode({ shipments = [], onInspectAudit }) {
  const totalAssets = shipments.length;
  const inTransitCount = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const compromisedCount = shipments.filter((s) => s.status === 'COMPROMISED').length;
  const deliveredCount = shipments.filter((s) => s.status === 'DELIVERED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container border border-outline-variant p-6 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-2xl">gavel</span>
            <h1 className="font-display-center text-xl font-extrabold text-on-surface">Health & Food Standards Authority</h1>
            <span className="font-data-mono text-xs bg-amber-950/60 text-amber-400 px-2 py-0.5 rounded border border-amber-800">
              RegulatorMSP
            </span>
          </div>
          <p className="font-label-caps text-xs text-on-surface-variant mt-1">
            GLOBAL AUDIT RADAR &bull; PEER0.REGULATOR.COLDCHAIN.COM:10051 &bull; UNRESTRICTED LEDGER ACCESS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Consortium Assets</span>
          <div className="font-display-center text-2xl font-extrabold text-on-surface mt-1">{totalAssets}</div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Active Transit</span>
          <div className="font-display-center text-2xl font-extrabold text-primary mt-1">{inTransitCount}</div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Delivered Clean</span>
          <div className="font-display-center text-2xl font-extrabold text-emerald-400 mt-1">{deliveredCount}</div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Breach Incidents</span>
          <div className="font-display-center text-2xl font-extrabold text-error mt-1">{compromisedCount}</div>
        </div>
      </div>

      <div className="bg-surface-container border border-outline-variant rounded-lg p-5">
        <h2 className="font-headline-table text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">hub</span>
          Hyperledger Fabric Consortium Peer Network
        </h2>
        <ConsortiumTopology />
      </div>

      <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <h2 className="font-headline-table text-sm font-bold text-on-surface">Unrestricted Audit Ledger</h2>
          <span className="font-data-mono text-xs text-on-surface-variant">{shipments.length} total entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-highest font-label-caps text-on-surface-variant uppercase text-[10px] tracking-wider border-b border-outline-variant">
                <th className="p-3">Shipment ID</th>
                <th className="p-3">Item Name</th>
                <th className="p-3">Manufacturer</th>
                <th className="p-3">Holder</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-data-mono">
              {shipments.map((s) => (
                <tr key={s.shipmentID} className="hover:bg-surface-container-highest/50 transition-colors">
                  <td className="p-3 font-bold text-primary">{s.shipmentID}</td>
                  <td className="p-3 font-body font-medium text-on-surface">{s.itemName}</td>
                  <td className="p-3 text-on-surface-variant">{s.manufacturer}</td>
                  <td className="p-3 text-on-surface-variant">{s.currentHolder}</td>
                  <td className="p-3">
                    <span
                      className={'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + (
                        s.status === 'COMPROMISED' ? 'bg-rose-950/60 text-rose-400 border border-rose-800' : 'bg-surface-container-highest text-on-surface'
                      )}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onInspectAudit(s)}
                      className="font-label-caps text-[11px] text-primary hover:underline font-bold"
                    >
                      FULL FABRIC AUDIT
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