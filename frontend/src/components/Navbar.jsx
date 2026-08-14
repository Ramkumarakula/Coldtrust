import React from 'react';
import { Shield, Building, RefreshCw, Plus, Activity } from 'lucide-react';

export default function Navbar({
  selectedOrg,
  setSelectedOrg,
  onRefresh,
  onOpenCreateModal,
  isRefreshing,
}) {
  const orgs = [
    { id: 'Manufacturer', name: 'BioTechLabs (Manufacturer)', msp: 'ManufacturerMSP' },
    { id: 'Transport', name: 'SwiftLogistics (Transport Co.)', msp: 'TransportMSP' },
    { id: 'Retailer', name: 'MetroHospital (Retailer / Hospital)', msp: 'RetailerMSP' },
    { id: 'Regulator', name: 'FDA / EMEA (Global Regulator)', msp: 'RegulatorMSP' },
  ];

  return (
    <header className="glass-card mb-6 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Platform */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center ">
          <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100">
              ColdTrust
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              Ops Center
            </span>
          </div>
          <p className="text-xs text-slate-400">Enterprise Cold Chain Network • Fabric v2.5</p>
        </div>
      </div>

      {/* Organization Switcher & Status Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Network Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <span className="live-indicator"></span>
          <span>Hyperledger Consortium: <strong className="text-emerald-400 font-semibold">Active</strong></span>
        </div>

        {/* Organization Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5">
          <Building className="w-4 h-4 text-cyan-400" />
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {orgs.map((org) => (
              <option key={org.id} value={org.id} className="bg-slate-900 text-slate-200">
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="btn-secondary text-xs"
          title="Refresh Network Ledger Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh</span>
        </button>

        {/* Create Shipment CTA */}
        {selectedOrg === 'Manufacturer' && (
          <button onClick={onOpenCreateModal} className="btn-primary text-xs">
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Shipment</span>
          </button>
        )}
      </div>
    </header>
  );
}

