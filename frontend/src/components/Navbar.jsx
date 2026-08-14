import React, { useState } from 'react';
import { Shield, Building2, RefreshCw, Plus, Cpu, Activity, Menu, X } from 'lucide-react';

export default function Navbar({
  selectedOrg,
  setSelectedOrg,
  onRefresh,
  onOpenCreateModal,
  isRefreshing,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const orgs = [
    { id: 'Manufacturer', name: 'BioTechLabs', role: 'Manufacturer', msp: 'ManufacturerMSP' },
    { id: 'Transport', name: 'SwiftLogistics', role: 'Carrier', msp: 'TransportMSP' },
    { id: 'Retailer', name: 'MetroHospital', role: 'Retailer', msp: 'RetailerMSP' },
    { id: 'Regulator', name: 'FDA / EMEA', role: 'Regulator', msp: 'RegulatorMSP' },
  ];

  const currentOrg = orgs.find((o) => o.id === selectedOrg) || orgs[0];

  return (
    <header className="enterprise-card mb-6 px-4 py-3 sm:px-6 sm:py-3.5">
      {/* Main Desktop Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Platform Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-950 border border-sky-800/80 flex items-center justify-center text-sky-400 shrink-0">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                ColdTrust
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
                Command Center
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 font-mono">
              <Cpu className="w-3 h-3 text-sky-400 inline" />
              <span>Hyperledger Fabric v2.5.16</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">coldchain-channel</span>
            </p>
          </div>
        </div>

        {/* Desktop Controls (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Network Health Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <span className="live-indicator"></span>
            <span className="text-[11px] text-slate-400">Consortium Network:</span>
            <strong className="text-emerald-400 font-semibold text-[11px] font-mono">ACTIVE</strong>
          </div>

          {/* Organization Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-md px-3 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
              aria-label="Select Active Organization Role"
            >
              {orgs.map((org) => (
                <option key={org.id} value={org.id} className="bg-slate-900 text-slate-200">
                  {org.name} ({org.msp})
                </option>
              ))}
            </select>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {currentOrg.msp}
            </span>
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn-secondary text-xs"
            title="Refresh Network Ledger Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            <span>Refresh Ledger</span>
          </button>

          {/* Create Shipment CTA (Manufacturer Only) */}
          {selectedOrg === 'Manufacturer' && (
            <button onClick={onOpenCreateModal} className="btn-primary text-xs">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Consignment</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Quick Create Action on Mobile Header if Manufacturer */}
          {selectedOrg === 'Manufacturer' && (
            <button onClick={onOpenCreateModal} className="btn-primary text-xs px-2.5 py-1">
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-3 mt-3 border-t border-slate-800/80 space-y-3">
          {/* Mobile Network Health Status */}
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 text-xs flex items-center gap-2">
              <span className="live-indicator"></span>
              <span>Hyperledger Consortium</span>
            </span>
            <strong className="text-emerald-400 font-semibold font-mono text-xs">Active</strong>
          </div>

          {/* Mobile Org Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Active Organization Role
            </label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-md px-3 py-2">
              <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
              <select
                value={selectedOrg}
                onChange={(e) => {
                  setSelectedOrg(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer w-full"
              >
                {orgs.map((org) => (
                  <option key={org.id} value={org.id} className="bg-slate-900 text-slate-200">
                    {org.name} ({org.msp})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Refresh Button */}
          <button
            onClick={() => {
              onRefresh();
              setMobileMenuOpen(false);
            }}
            disabled={isRefreshing}
            className="btn-secondary text-xs w-full justify-center py-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            <span>Refresh Ledger Data</span>
          </button>
        </div>
      )}
    </header>
  );
}
