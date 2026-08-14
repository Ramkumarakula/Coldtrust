import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  History,
  Truck,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ArrowUpDown,
  X,
  MapPin,
  ShieldAlert,
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
  const [sortField, setSortField] = useState('shipmentID');
  const [sortAsc, setSortAsc] = useState(true);

  // Status Filter Tabs List
  const statusTabs = ['ALL', 'CREATED', 'IN_TRANSIT', 'COMPROMISED', 'DELIVERED'];

  // Filter & Sort Logic
  const processedShipments = useMemo(() => {
    let result = shipments.filter((s) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        s.shipmentID?.toLowerCase().includes(term) ||
        s.productName?.toLowerCase().includes(term) ||
        s.manufacturer?.toLowerCase().includes(term) ||
        s.carrier?.toLowerCase().includes(term) ||
        s.location?.toLowerCase().includes(term) ||
        s.owner?.toLowerCase().includes(term) ||
        s.recipient?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let valA = a[sortField] ?? '';
      let valB = b[sortField] ?? '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    return result;
  }, [shipments, searchTerm, statusFilter, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="enterprise-card overflow-hidden">
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Consignment Roster
          </h2>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-md">
            {processedShipments.length} records
          </span>
        </div>

        {/* Search & Status Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shipment ID, product, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-8 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs / Filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-md p-1 overflow-x-auto max-w-full">
            {statusTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase transition-colors shrink-0 ${
                  statusFilter === tab
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (Visible on md screens and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
              <th
                onClick={() => handleSort('shipmentID')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Shipment ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('productName')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Product & Mfg</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('owner')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Custody (Owner MSP)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('location')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Location & Route</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('currentTemp')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Telemetry Temp</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {processedShipments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                  No cold chain consignments found matching your filter criteria.
                </td>
              </tr>
            ) : (
              processedShipments.map((s) => {
                const isTempBreached = s.currentTemp > s.maxTemp;

                return (
                  <tr
                    key={s.shipmentID}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      s.status === 'COMPROMISED' ? 'bg-rose-950/15' : ''
                    }`}
                  >
                    {/* Shipment ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                      {s.shipmentID}
                    </td>

                    {/* Product & Manufacturer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{s.productName}</div>
                      <div className="text-[10px] text-slate-400">Mfg: {s.manufacturer}</div>
                    </td>

                    {/* Custody (Owner MSP) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>{s.owner}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Carrier: {s.carrier}</div>
                    </td>

                    {/* Location & Destination */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-medium text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.location}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">To: {s.recipient}</div>
                    </td>

                    {/* Telemetry Temp */}
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
                        <div className="flex items-center gap-1 text-[9px] text-rose-400 font-bold uppercase tracking-wide mt-0.5">
                          <ShieldAlert className="w-3 h-3" />
                          <span>BREACH EXCEEDED</span>
                        </div>
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
                        {/* Audit Action */}
                        <button
                          onClick={() => onInspectAudit(s)}
                          className="btn-secondary text-[11px] px-2.5 py-1"
                          title="Inspect Cryptographic Audit Timeline"
                        >
                          <History className="w-3.5 h-3.5 text-sky-400" />
                          <span>Audit</span>
                        </button>

                        {/* Accept Custody Action (Transport Org) */}
                        {s.status === 'CREATED' && selectedOrg === 'Transport' && (
                          <button
                            onClick={() => onAcceptCustody(s.shipmentID)}
                            className="px-2.5 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                        )}

                        {/* IoT Sensor Action */}
                        {s.status === 'IN_TRANSIT' && (
                          <button
                            onClick={() => onSimulateTelemetry(s)}
                            className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                            title="Simulate IoT Sensor Reading"
                          >
                            <Thermometer className="w-3.5 h-3.5" />
                            <span>IoT Sensor</span>
                          </button>
                        )}

                        {/* Receive Action (Retailer Org) */}
                        {s.status === 'IN_TRANSIT' && selectedOrg === 'Retailer' && (
                          <button
                            onClick={() => onReceiveDelivery(s.shipmentID)}
                            className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
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

      {/* MOBILE CARD VIEW (Visible on screens <= 768px) */}
      <div className="block md:hidden divide-y divide-slate-800/80">
        {processedShipments.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            No cold chain consignments found matching your filter criteria.
          </div>
        ) : (
          processedShipments.map((s) => {
            const isTempBreached = s.currentTemp > s.maxTemp;

            return (
              <div
                key={s.shipmentID}
                className={`p-4 space-y-3 ${s.status === 'COMPROMISED' ? 'bg-rose-950/20' : ''}`}
              >
                {/* Header Line: ID & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-sky-400 text-sm">
                    {s.shipmentID}
                  </span>
                  <span className={`badge badge-${s.status}`}>
                    {s.status === 'COMPROMISED' && <AlertTriangle className="w-3 h-3" />}
                    {s.status === 'DELIVERED' && <CheckCircle2 className="w-3 h-3" />}
                    {s.status === 'IN_TRANSIT' && <Truck className="w-3 h-3" />}
                    <span>{s.status}</span>
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Product</span>
                    <span className="font-semibold text-slate-200">{s.productName}</span>
                    <span className="text-[10px] text-slate-400 block">Mfg: {s.manufacturer}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Current Temp</span>
                    <div
                      className={`font-mono font-bold flex items-center gap-1 ${
                        isTempBreached ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      <Thermometer className="w-3.5 h-3.5" />
                      <span>{s.currentTemp}°C</span>
                      <span className="text-[10px] text-slate-400 font-normal">(Max {s.maxTemp}°C)</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Custodian MSP</span>
                    <span className="text-slate-300 font-medium">{s.owner}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Location</span>
                    <span className="text-slate-300">{s.location}</span>
                  </div>
                </div>

                {/* Mobile Actions Bar */}
                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onInspectAudit(s)}
                    className="btn-secondary text-xs flex-1 justify-center py-1.5"
                  >
                    <History className="w-3.5 h-3.5 text-sky-400" />
                    <span>Audit Trace</span>
                  </button>

                  {s.status === 'CREATED' && selectedOrg === 'Transport' && (
                    <button
                      onClick={() => onAcceptCustody(s.shipmentID)}
                      className="px-3 py-1.5 rounded-md bg-sky-600 text-white font-semibold text-xs flex-1 justify-center flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Accept Custody</span>
                    </button>
                  )}

                  {s.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => onSimulateTelemetry(s)}
                      className="px-3 py-1.5 rounded-md bg-indigo-600 text-white font-medium text-xs flex-1 justify-center flex items-center gap-1"
                    >
                      <Thermometer className="w-3.5 h-3.5" />
                      <span>IoT Telemetry</span>
                    </button>
                  )}

                  {s.status === 'IN_TRANSIT' && selectedOrg === 'Retailer' && (
                    <button
                      onClick={() => onReceiveDelivery(s.shipmentID)}
                      className="px-3 py-1.5 rounded-md bg-emerald-600 text-slate-950 font-bold text-xs flex-1 justify-center flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Receive Delivery</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
