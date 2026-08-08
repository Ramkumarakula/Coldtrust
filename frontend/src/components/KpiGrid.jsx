import React from 'react';
import { Package, Truck, CheckCircle2, AlertTriangle, Thermometer } from 'lucide-react';

export default function KpiGrid({ shipments }) {
  const total = shipments.length;
  const inTransit = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const delivered = shipments.filter((s) => s.status === 'DELIVERED').length;
  const compromised = shipments.filter((s) => s.status === 'COMPROMISED').length;

  const complianceRate = total > 0 ? (((total - compromised) / total) * 100).toFixed(1) : '100.0';

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* 1. Total Shipments */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Total Assets</p>
          <p className="text-2xl font-extrabold text-slate-100">{total}</p>
          <p className="text-[10px] text-blue-400 mt-0.5">On coldchain-channel</p>
        </div>
      </div>

      {/* 2. In Transit */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">In Transit</p>
          <p className="text-2xl font-extrabold text-cyan-400">{inTransit}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Active transport custody</p>
        </div>
      </div>

      {/* 3. Delivered */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Delivered Safely</p>
          <p className="text-2xl font-extrabold text-emerald-400">{delivered}</p>
          <p className="text-[10px] text-emerald-400/80 mt-0.5">Verified destination</p>
        </div>
      </div>

      {/* 4. COMPROMISED Alert */}
      <div className={`glass-card p-4 flex items-center gap-4 ${compromised > 0 ? 'glow-red pulse-alert' : ''}`}>
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">COMPROMISED</p>
          <p className="text-2xl font-extrabold text-rose-400">{compromised}</p>
          <p className="text-[10px] text-rose-300/80 mt-0.5">Temp breach (&gt; 4.0°C)</p>
        </div>
      </div>

      {/* 5. Compliance Rate */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Thermometer className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Temp Compliance</p>
          <p className="text-2xl font-extrabold text-indigo-300">{complianceRate}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Threshold 2.0°C - 4.0°C</p>
        </div>
      </div>
    </section>
  );
}
