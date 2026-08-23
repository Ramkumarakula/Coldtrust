import React from 'react';
import { Package, Plus, ShieldCheck, Truck, History, AlertTriangle, CheckCircle2 } from 'lucide-react';
export default function ManufacturerDashboard({ shipments, onOpenCreateModal, onInspectAudit }) {
  const mfgShipments = shipments;
  const totalCreated = mfgShipments.length;
  const pendingHandover = mfgShipments.filter((s) => s.status === 'CREATED').length;
  const activeInTransit = mfgShipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const compromised = mfgShipments.filter((s) => s.status === 'COMPROMISED').length;
  const slaCompliance = totalCreated > 0 ? (((totalCreated - compromised) / totalCreated) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-5">
      <div className="enterprise-card p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">1❠簏</span>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight font-heading">
              BioPharma Corp — Origin Manufacturing Console
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
              ManufacturerMSP
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consignment Issuance, SLA Cold Chain Parameterization (2.0 C ‐ 4.0 C), Carrier Assignment &amp; Custody Release.
          </p>
        </div>

        <button onClick={onOpenCreateModal} className="btn-primary text-xs shadow-md shrink-0">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Consignment</span>
        </button>
      </div>
    </div>
  );
}
