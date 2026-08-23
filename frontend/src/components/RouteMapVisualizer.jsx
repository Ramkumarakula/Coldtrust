import React from 'react';
import { Building2, Truck, Hospital, CheckCircle2, AlertOctagon, ArrowRight } from 'lucide-react';

export default function RouteMapVisualizer({ shipment }) {
  if (!shipment) return null;

  const {
    manufacturer = 'BioTechLabs',
    carrier = 'SwiftLogistics',
    recipient = 'MetroHospital',
    location = 'Origin Facility',
    owner = 'ManufacturerMSP',
    status = 'CREATED',
  } = shipment;

  const stages = [
    {
      id: 'MANUFACTURER',
      title: 'Origin / Lab',
      org: manufacturer,
      msp: 'ManufacturerMSP',
      icon: Building2,
      isCompleted: true,
      isActive: status === 'CREATED',
    },
    {
      id: 'TRANSPORT',
      title: 'Transit Custody',
      org: carrier,
      msp: 'TransportMSP',
      icon: Truck,
      isCompleted: status === 'IN_TRANSIT' || status === 'DELIVERED' || status === 'COMPROMISED',
      isActive: status === 'IN_TRANSIT',
    },
    {
      id: 'RETAILER',
      title: 'Destination',
      org: recipient,
      msp: 'RetailerMSP',
      icon: Hospital,
      isCompleted: status === 'DELIVERED',
      isActive: status === 'DELIVERED',
    },
  ];

  return (
    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span>Custody & Transport Route Visualizer</span>
        </h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-sky-400 border border-slate-800">
          Current Loc: {location}
        </span>
      </div>

      {/* Custody Nodes Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isCurrentOwner = owner.toLowerCase().includes(stage.id.toLowerCase());

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-lg border text-xs relative transition-all ${
                status === 'COMPROMISED' && stage.isActive
                  ? 'bg-rose-950/30 border-rose-800 text-rose-300'
                  : stage.isActive
                  ? 'bg-sky-950/40 border-sky-600 text-slate-100'
                  : stage.isCompleted
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                  : 'bg-slate-950 border-slate-900 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center ${
                      stage.isActive
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : stage.isCompleted
                        ? 'bg-slate-800 text-sky-400'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-[11px]">{stage.title}</span>
                    <span className="text-[10px] font-mono opacity-80">{stage.msp}</span>
                  </div>
                </div>

                {stage.isCompleted && status !== 'COMPROMISED' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {status === 'COMPROMISED' && stage.isActive && (
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </div>

              <p className="text-[11px] font-medium truncate mt-1 text-slate-200">{stage.org}</p>

              {isCurrentOwner && (
                <span className="mt-2 inline-block text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-mono">
                  Active Custodian
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
