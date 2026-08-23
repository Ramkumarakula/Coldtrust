import React from 'react';
import { Package, Truck, CheckCircle2, AlertOctagon, Thermometer } from 'lucide-react';

export default function KpiGrid({ shipments }) {
  const total = shipments.length;
  const inTransit = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const delivered = shipments.filter((s) => s.status === 'DELIVERED').length;
  const compromised = shipments.filter((s) => s.status === 'COMPROMISED').length;

  const complianceRate = total > 0 ? (((total - compromised) / total) * 100).toFixed(1) : '100.0';

  const inTransitPct = total > 0 ? Math.round((inTransit / total) * 100) : 0;
  const deliveredPct = total > 0 ? Math.round((delivered / total) * 100) : 0;
  const compromisedPct = total > 0 ? Math.round((compromised / total) * 100) : 0;
  const compliancePct = Number(complianceRate);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Consignments */}
      <div className="enterprise-card p-4 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Total Assets
          </span>
          <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold font-mono text-slate-100 tracking-tight">{total}</p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">coldchain-channel ledger</p>
        </div>
        {/* Progress Sparkline Bar */}
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div className="bg-sky-500 h-full rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* 2. In Transit */}
      <div className="enterprise-card p-4 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            In Transit
          </span>
          <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold font-mono text-sky-400 tracking-tight">{inTransit}</p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{inTransitPct}% of total assets</p>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div className="bg-sky-400 h-full rounded-full" style={{ width: `${inTransitPct}%` }}></div>
        </div>
      </div>

      {/* 3. Delivered */}
      <div className="enterprise-card p-4 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Delivered
          </span>
          <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">{delivered}</p>
          <p className="text-[10px] text-emerald-400/80 mt-0.5 font-mono">{deliveredPct}% destination verified</p>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${deliveredPct}%` }}></div>
        </div>
      </div>

      {/* 4. COMPROMISED Alert Card */}
      <div
        className={`enterprise-card p-4 flex flex-col justify-between space-y-3 ${
          compromised > 0 ? 'pulse-alert bg-rose-950/20' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider font-mono">
            Compromised
          </span>
          <div
            className={`w-8 h-8 rounded border flex items-center justify-center ${
              compromised > 0 ? 'bg-rose-950 border-rose-800 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold font-mono text-rose-400 tracking-tight">{compromised}</p>
          <p className="text-[10px] text-rose-300/80 mt-0.5 font-mono">Temp breach (&gt;4.0°C)</p>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div className="bg-rose-500 h-full rounded-full" style={{ width: `${compromisedPct}%` }}></div>
        </div>
      </div>

      {/* 5. Temperature Compliance Rate */}
      <div className="enterprise-card p-4 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Compliance Rate
          </span>
          <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
            <Thermometer className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold font-mono text-indigo-300 tracking-tight">{complianceRate}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Target 2.0°C - 4.0°C</p>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${compliancePct}%` }}></div>
        </div>
      </div>
    </section>
  );
}
