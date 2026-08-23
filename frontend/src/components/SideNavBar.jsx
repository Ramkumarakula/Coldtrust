import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SideNavBar({ activeOrg, onPrimaryAction }) {
  const navigate = useNavigate();
  const location = useLocation();

  const orgProfiles = {
    Manufacturer: {
      name: 'BioPharma Corp',
      msp: 'ManufacturerMSP',
      initials: 'BP',
      actionLabel: 'NEW DISPATCH',
      actionIcon: 'add',
      route: '/manufacturer',
    },
    Transport: {
      name: 'SwiftCold Logistics',
      msp: 'TransportMSP',
      initials: 'SC',
      actionLabel: 'POST TELEMETRY',
      actionIcon: 'sensors',
      route: '/transport',
    },
    Retailer: {
      name: 'Apex Pharmacy',
      msp: 'RetailerMSP',
      initials: 'AP',
      actionLabel: 'RECEIVING DOCK',
      actionIcon: 'inventory_2',
      route: '/retailer',
    },
    Regulator: {
      name: 'Standards Authority',
      msp: 'RegulatorMSP',
      initials: 'SA',
      actionLabel: 'AUDIT RADAR',
      actionIcon: 'radar',
      route: '/regulator',
    },
  };

  const profile = orgProfiles[activeOrg] || orgProfiles.Manufacturer;

  const navLinks = [
    { label: 'Manufacturer Node', route: '/manufacturer', icon: 'biotech', msp: 'ManufacturerMSP' },
    { label: 'Transport Control', route: '/transport', icon: 'local_shipping', msp: 'TransportMSP' },
    { label: 'Retailer Dock', route: '/retailer', icon: 'storefront', msp: 'RetailerMSP' },
    { label: 'Regulator Radar', route: '/regulator', icon: 'gavel', msp: 'RegulatorMSP' },
  ];

  return (
    <aside className="fixed left-0 top-12 h-[calc(100vh-48px)] w-64 bg-surface-container border-r border-outline-variant flex flex-col z-40 hidden lg:flex">
      <div className="p-container-padding border-b border-outline-variant flex items-center gap-4">
        <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center text-on-primary-container font-headline-table text-headline-table font-bold">
          {profile.initials}
        </div>
        <div>
          <div className="font-headline-table text-headline-table text-on-surface font-bold">{profile.name}</div>
          <div className="font-body-dense text-body-dense text-on-surface-variant">{profile.msp}</div>
        </div>
      </div>

      <div className="px-container-padding py-4">
        <button
          onClick={onPrimaryAction}
          className="w-full bg-primary-container text-on-primary-container font-label-caps text-label-caps py-2 px-3 rounded hover:bg-primary-container/80 transition-colors flex items-center justify-center gap-2 font-bold shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">{profile.actionIcon}</span>
          <span>{profile.actionLabel}</span>
        </button>
      </div>

      <nav className="flex-1 px-container-padding space-y-1 overflow-y-auto">
        <div className="font-label-caps text-[10px] text-outline uppercase tracking-wider mb-2">Consortium Nodes</div>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.route || (location.pathname === '/' && link.route === '/manufacturer');
          return (
            <button
              key={link.route}
              onClick={() => navigate(link.route)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors font-body-dense text-body-dense ${
                isActive
                  ? 'bg-surface-container-highest text-primary font-bold border-l-2 border-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{link.icon}</span>
              <div className="flex flex-col">
                <span className="font-label-caps text-xs">{link.label}</span>
                <span className="font-data-mono text-[9px] opacity-75">{link.msp}</span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-container-padding border-t border-outline-variant font-data-mono text-[11px] text-on-surface-variant flex items-center justify-between">
        <span>Channel: coldchain-channel</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-live"></span>
      </div>
    </aside>
  );
}