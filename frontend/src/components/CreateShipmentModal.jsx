import React, { useState } from 'react';
import { X, Package, Check, AlertCircle } from 'lucide-react';

export default function CreateShipmentModal({ isOpen, onClose, onSubmit }) {
  const defaultID = `SHIP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const [formData, setFormData] = useState({
    shipmentID: defaultID,
    productName: 'COVID-19 Vaccine Vials',
    manufacturer: 'BioTechLabs',
    carrier: 'SwiftLogistics',
    recipient: 'MetroHospital',
    minTemp: 2.0,
    maxTemp: 4.0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (Number(formData.minTemp) >= Number(formData.maxTemp)) {
      setErrorMsg('Min Target Temp must be strictly less than Max Threshold Temp.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        minTemp: parseFloat(formData.minTemp),
        maxTemp: parseFloat(formData.maxTemp),
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to initialize cold chain asset on ledger.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="enterprise-card w-full max-w-lg p-6 relative shadow-2xl border-sky-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-md hover:bg-slate-800"
          aria-label="Close Create Shipment Form"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Initialize Cold Chain Consignment</h3>
            <p className="text-xs text-slate-400 font-mono">Fabric Ledger Asset Creation • ManufacturerMSP</p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-md bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
              Shipment Identifier (ID)
            </label>
            <input
              type="text"
              required
              value={formData.shipmentID}
              onChange={(e) => setFormData({ ...formData, shipmentID: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono text-sky-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Manufacturer
              </label>
              <input
                type="text"
                required
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assigned Carrier
              </label>
              <input
                type="text"
                required
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recipient / Destination
              </label>
              <input
                type="text"
                required
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-md bg-slate-950 border border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono">
                Min Target Temp (°C)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.minTemp}
                onChange={(e) => setFormData({ ...formData, minTemp: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 font-mono">
                Max Threshold Temp (°C)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.maxTemp}
                onChange={(e) => setFormData({ ...formData, maxTemp: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-xs font-mono text-rose-400 font-bold focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-xs"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Submitting to Ledger...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Commit Asset</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
