import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TopNavBar({ selectedOrg, setSelectedOrg, onRefresh, isRefreshing }) {
  const navigate = useNavigate();
  const location = useLocation();

  const orgs = [
    { id: 'Manufacturer', name: 'BioPharma Corp (ManufacturerMSP)', route: '/manufacturer' },
    { id: 'Transport', name: 'SwiftCold Logistics (TransportMSP)', route: '/transport' },
    { id: 'Retailer', name: 'Apex Pharmacy (RetailerMSP)', route: '/retailer' },
    { id: 'Regulator', name: 'Standards Authority (RegulatorMSP)', route: '/regulator' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding h-12 bg-surface-container-low border-b border-outline-variant">
      <div className="flex items-center gap-6">
        <div className="font-display-center text-display-center text-primary-container tracking-tight">ColdTrust</div>
        <nav className="hidden md:flex items-center gap-2 h-full">
          {orgs.map((o) => {
            const isActive = location.pathname === o.route || (location.pathname === '/' && o.route === '/manufacturer');
            return (
              <button
                key={o.route}
                onClick={() => navigate(o.route)}
                className={`h-full flex items-center px-3 text-xs font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'text-primary-container font-semibold border-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-highest border-transparent'
                }`}
              >
                {o.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            className="bg-surface-container border border-outline-variant rounded py-1 px-3 text-body-dense font-body-dense text-on-surface focus:outline-none focus:border-primary w-48 md:w-64 transition-colors text-xs"
            placeholder="Search shipments, blocks, peers..."
            type="text"
          />
          <span className="material-symbols-outlined absolute right-2 top-1.5 text-on-surface-variant text-sm">search</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center p-1 rounded"
          title="Sync Ledger State"
        >
          <span className={`material-symbols-outlined text-lg ${isRefreshing ? 'animate-spin text-primary' : ''}`}>
            sync
          </span>
        </button>

        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-live" title="Fabric Network Live"></span>

        <div className="w-8 h-8 rounded-full border border-outline-variant bg-surface-container-highest flex items-center justify-center font-bold text-xs text-primary">
          CT
        </div>
      </div>
    </header>
  );
}