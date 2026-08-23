import React from 'react';
import { AlertOctagon, ShieldCheck, Activity, Cpu, ArrowUpRight, CheckCircle2, History } from 'lucide-react';

export default function OperationsSidebar({ shipments, onInspectAudit }) {
  const compromisedList = shipments.filter((s) => s.status === 'COMPROMISED');
  const inTransitList = shipments.filter((s) => s.status === 'IN_TRANSIT');

  return (
    <aside className="space-y-4">
      {/* 1. Critical Operational Alerts Box */}
      <div className={`enterprise-card p-4 ${compromisedList.length > 0 ? 'pulse-alert bg-rose-950/20' : ''}`}>
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className={`w-4 h-4 ${compromisedList.length > 0 ? 'text-rose-400' : 'text-slate-400'}`} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Operational Alerts
            </h3>
          </div>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              compromisedList.length > 0
                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}
          >
            {compromisedList.length} Critical
          </span>
        </div>

        {compromisedList.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-400 space-y-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
            <p className="font-semibold text-slate-300">All Consignments Compliant</p>
            <p className="text-[10px] text-slate-500">Zero active temperature breaches detected</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {compromisedList.map((s) => (
              <div
                key={s.shipmentID}
                className="p-2.5 rounded bg-slate-950 border border-rose-900/60 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-400 text-[11px]">{s.shipmentID}</span>
                  <span className="text-[10px] text-rose-300 font-bold bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
                    {s.currentTemp}°C (&gt;{s.maxTemp}°C)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium truncate">{s.productName}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                  <span>Owner: {s.owner}</span>
                  <button
                    onClick={() => onInspectAudit(s)}
                    className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5"
                  >
                    <span>Investigate</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Consortium Topology & Ledger Status */}
      <div className="enterprise-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Consortium Topology
            </h3>
          </div>
          <span className="live-indicator"></span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Channel</span>
            <span className="text-slate-200 font-semibold truncate block">coldchain</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Consconsensus</span>
            <span className="text-emerald-400 font-semibold block">Raft OK</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Peer Nodes</span>
            <span className="text-slate-200 font-semibold block">4 Active</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">State DB</span>
            <span className="text-slate-200 font-semibold block">CouchDB x4</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Smart Contract:</span>
          <span className="font-mono text-sky-400 font-semibold">shipment_cc v1.0</span>
        </div>
      </div>

      {/* 3. Live Active Transit Feed */}
      <div className="enterprise-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Active Custody Feed
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{inTransitList.length} Active</span>
        </div>

        {inTransitList.length === 0 ? (
          <p className="text-xs text-slate-500 py-2 text-center">No active consignments in transit.</p>
        ) : (
          <div className="space-y-2">
            {inTransitList.slice(0, 3).map((s) => (
              <div key={s.shipmentID} className="p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-400 text-[11px]">{s.shipmentID}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{s.currentTemp}°C</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  Location: <span className="text-slate-300">{s.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
