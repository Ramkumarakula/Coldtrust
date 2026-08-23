import React, { withState } from 'react';
import { Shield, RefreshCw, Plus, Cpu, Server, Network, Menu, X } from 'lucide-react';

export default function ConsortiumNavbar({
  selectedOrg,
  setSelectedOrg,
  onRefresh,
  onOpenCreateModal,
  isRefreshing,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const orgs = [
    {
      id: 'Manufacturer',
      name: 'BioPharma Corp',
      role: 'Manufacturer',
      msp: 'ManufacturerMSP',
      peer: 'peer0.manufacturer.coldchain.com:7051',
      icon: '🏭',
      color: 'border-indigo-500/50 text-indigo-400 bg-indigo-950/40',
    },
    {
      id: 'Transport',
      name: 'SwiftCold Logistics',
      role: 'Carrier',
      msp: 'TransportMSP',
      peer: 'peer0.transport.coldchain.com:8051',
      icon: '🚛',
      color: 'border-sky-500/50 text-sky-400 bg-sky-950/40',
    },
    {
      id: 'Retailer',
      name: 'Apex Pharmacy Networks',
      role: 'Retailer',
      msp: 'RetailerMSP',
      peer: 'peer0.retailer.coldchain.com:9051',
      icon: '🏪',
      color: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40',
    },
    {
      id: 'Regulator',
      name: 'Health & Food Standards Authority',
      role: 'Regulator / Auditor',
      msp: 'RegulatorMSP',
      peer: 'peer0.regulator.coldchain.com:10051',
      icon: '⚖️',
      color: 'border-amber-500/50 text-amber-400 bg-amber-950/40',
    },
  ];

  const currentOrg = orgs.find((o) => o.id === selectedOrg) || orgs[0];

  return (
    <header className="enterprise-card mb-5 px-4 py-3.5 sm:px-6">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-leg bg-sky-950/90 border border-sky-800 flex items-center justify-center text-sky-400 shrink-0 shadow-sm">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight font-heading">
                ColdTrust
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/70">
                Consortium Network
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1">
                <Network className="w-3 h-3 text-sky-400" />
                coldchain-channel
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2 font-mono mt-0.5">
              <Cpu className="w-3 h-3 text-sky-400 inline" />
              <span>Hyperledger Fabric v2.5.16</span>
              <span className="text-slate-600"></span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Gateway Connected
              </span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
