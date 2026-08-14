import React, { useState } from 'react';
import {
  Search,
  Filter,
  History,
  Truck,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Building,
} from 'lucide-react';

export default function ShipmentTable({
  shipments,
  selectedOrg,
  onInspectAudit,
  onAcceptCustody,
  onSimulateTelemetry,
  onReceiveDelivery,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.shipmentID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="glass-card overflow-hidden">
      {/* Toolbar & Filters */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-100">Cold Chain Consignment Roster</h2>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md font-mono">
            {filteredShipments.length} records
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shipment ID, product, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="CREATED" className="bg-slate-900">CREATED</option>
              <option value="IN_TRANSIT" className="bg-slate-900">IN_TRANSIT</option>
              <option value="COMPROMISED" className="bg-slate-900">COMPROMISED</option>
              <option value="DELIVERED" className="bg-slate-900">DELIVERED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <th className="py-3.5 px-4">Shipment ID</th>
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Custody (Owner)</th>
              <th className="py-3.5 px-4">Route & Location</th>
              <th className="py-3.5 px-4">Current Temp</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredShipments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No shipments found matching filters.
                </td>
              </tr>
            ) : (
              filteredShipments.map((s) => {
                const isTempBreached = s.currentTemp > s.maxTemp;

                return (
                  <tr
                    key={s.shipmentID}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      s.status === 'COMPROMISED' ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    {/* Shipment ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {s.shipmentID}
                    </td>

                    {/* Product & Manufacturer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{s.productName}</div>
                      <div className="text-[10px] text-slate-400">Mfg: {s.manufacturer}</div>
                    </td>

                    {/* Custody (Owner) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-300">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>{s.owner}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Carrier: {s.carrier}</div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-300">{s.location}</div>
                      <div className="text-[10px] text-slate-500">To: {s.recipient}</div>
                    </td>

                    {/* Current Temp */}
                    <td className="py-3.5 px-4">
                      <div
                        className={`font-mono font-bold flex items-center gap-1 ${
                          isTempBreached ? 'text-rose-400 font-extrabold' : 'text-emerald-400'
                        }`}
                      >
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>{s.currentTemp}°C</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          (Max: {s.maxTemp}°C)
                        </span>
                      </div>
                      {isTempBreached && (
                        <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wide">
                          ⚠️ BREACH EXCEEDED
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`badge badge-${s.status}`}>
                        {s.status === 'COMPROMISED' && <AlertTriangle className="w-3 h-3" />}
                        {s.status === 'DELIVERED' && <CheckCircle2 className="w-3 h-3" />}
                        {s.status === 'IN_TRANSIT' && <Truck className="w-3 h-3" />}
                        <span>{s.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 1. Inspect Ledger Audit Button */}
                        <button
                          onClick={() => onInspectAudit(s)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors"
                          title="Inspect Cryptographic Audit Timeline"
                        >
                          <History className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Audit</span>
                        </button>

                        {/* 2. Accept Custody Button (Transport Org) */}
                        {s.status === 'CREATED' && selectedOrg === 'Transport' && (
                          <button
                            onClick={() => onAcceptCustody(s.shipmentID)}
                            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                        )}

                        {/* 3. Simulate IoT Telemetry Button (Transport / Manufacturer / Simulator) */}
                        {s.status === 'IN_TRANSIT' && (
                          <button
                            onClick={() => onSimulateTelemetry(s)}
                            className="px-2.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                            title="Simulate IoT Sensor Reading"
                          >
                            <Thermometer className="w-3.5 h-3.5" />
                            <span>IoT Sensor</span>
                          </button>
                        )}

                        {/* 4. Receive Delivery Button (Retailer Org) */}
                        {s.status === 'IN_TRANSIT' && selectedOrg === 'Retailer' && (
                          <button
                            onClick={() => onReceiveDelivery(s.shipmentID)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Receive</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

