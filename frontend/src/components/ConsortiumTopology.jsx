import React from 'react';
import { Network, Server, ArrowRight, ShieldCheck, Database, Cpu } from 'lucide-react';

export default function ConsortiumTopology({ selectedOrg }) {
  const nodes = [
    {
      id: 'Manufacturer',
      name: 'BioPharma Peer',
      msp: 'ManufacturerMSP',
      host: 'peer0.manufacturer',
      port: '7051',
      icon: '🏭',
      activeColor: 'border-indigo-500 bg-indigo-950/60 text-indigo-300 ring-2 ring-indigo-500/30',
    },
    {
      id: 'Transport',
      name: 'SwiftCold Peer',
      msp: 'TransportMSP',
      host: 'peer0.transport',
      port: '8051',
      icon: 'UT0001F69B',
      activeColor: 'border-sky-500 bg-sky-950/60 text-sky-300 ring-2 ring-sky-500/30',
    },
    {
      id: 'Retailer',
      name: 'Apex Retail Peer',
      msp: 'RetailerMSP',
      host: 'peer0.retailer',
      port: '9051',
      icon: '🏪',
      activeColor: 'border-emerald-500 bg-emerald-950/60 text-emerald-300 ring-2 ring-emerald-500/30',
    },
    {
      id: 'Regulator',
      name: 'Regulator Peer',
      msp: 'RegulatorMSP',
      host: 'peer0.regulator',
      port: '10051',
      icon: '⚖️',
      activeColor: 'border-amber-500 bg-amber-950/60 text-amber-300 ring-2 ring-amber-500/30',
    },
  ];

  return (
    <div className="enterprise-card mb-5 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-sky-400 shrink-0" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-heading">
            ConsortiumNetwork Topology & Consensus Pipeline
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Raft Orderer: orderer.coldchain.com:7050</span>
        </div>
      </div>
    </div>
  );
}
