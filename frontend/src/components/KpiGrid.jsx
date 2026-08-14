import React from 'react';
import { Package, Truck, CheckCircle2, AlertOctagon, Thermometer } from 'lucide-react';

export default function KpiGrid({ shipments }) {
  const total = shipments.length;
  const inTransit = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const delivered = shipments.filter((s) => s.status === 'DELIVERED').length;
  const compromised = shipments.filter((s) => s.status === 'COMPROMISED').length;

  const complianceRate = total > 0 ? (((total - compromised) / total) * 100).toFixed(1) : '100.0';

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {/* 1. Total Consignments */}
      <div className="enterprise-card p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
          <Package className="w-5 h-5 stroke-[2]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Consignments</p>
          <p className="text-2xl font-bold font-mono text-slate-100 tracking-tight">{total}</p>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">coldchain-channel ledger</p>
        </div>
      </div>

      {/* 2. In Transit */}
      <div className="enterprise-card p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
          <Truck className="w-5 h-5 stroke-[2]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Transit</p>
          <p className="text-2xl font-bold font-mono text-sky-400 tracking-tight">{inTransit}</p>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">Active carrier custody</p>
        </div>
      </div>

      {/* 3. Delivered */}
      <div className="enterprise-card p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5 stroke-[2]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Delivered Safely</p>
          <p className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">{delivered}</p>
          <p className="text-[10px] text-emerald-400/80 truncate mt-0.5">Destination verified</p>
        </div>
      </div>

      {/* 4. COMPROMISED Alert Card */}
      <div
        className={`enterprise-card p-4 flex items-center gap-3.5 ${
          compromised > 0 ? 'pulse-alert bg-rose-950/20' : ''
        }`}
      >
        <div
          className={`w-11 h-11 rounded-md border flex items-center justify-center shrink-0 ${
            compromised > 0
              ? 'bg-rose-950/40 border-rose-800/80 text-rose-400'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <AlertOctagon className="w-5 h-5 stroke-[2]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Compromised</p>
          <p className="text-2xl font-bold font-mono text-rose-400 tracking-tight">{compromised}</p>
          <p className="text-[10px] text-rose-300/80 truncate mt-0.5">Temp breach (&gt; 4.0°C)</p>
        </div>
      </div>

      {/* 5. Temperature Compliance Rate */}
      <div className="enterprise-card p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
          <Thermometer className="w-5 h-5 stroke-[2]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Temp Compliance</p>
          <p className="text-2xl font-bold font-mono text-indigo-300 tracking-tight">{complianceRate}%</p>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">Target range 2.0°C - 4.0°C</p>
        </div>
      </div>
    </section>
  );
}
