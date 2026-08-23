import React, { useState } from 'react';
import { X, Thermometer, AlertTriangle, Send } from 'lucide-react';

export default function TelemetryModal({ isOpen, shipment, onClose, onSubmit }) {
  const [temperature, setTemperature] = useState(3.0);
  const [humidity, setHumidity] = useState(65.0);
  const [location, setLocation] = useState('In Transit (Hub-Central)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !shipment) return null;

  const isBreaching = Number(temperature) > Number(shipment.maxTemp);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(shipment.shipmentID, {
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        location,
      });
      onClose();
    } catch (err) {
      console.error(err);
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
          aria-label="Close Telemetry Form"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">Record IoT Sensor Telemetry</h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-950 text-sky-400 border border-slate-800">
                {shipment.shipmentID}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Automated Ledger Breach Rule Evaluation</p>
          </div>
        </div>

        {/* Breach Alert Warning Box */}
        {isBreaching ? (
          <div className="mb-4 p-3 rounded-md bg-rose-950/80 border border-rose-800 text-rose-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>IMMUTABLE BREACH WARNING</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Temperature ({temperature}°C) exceeds max threshold ({shipment.maxTemp}°C). Smart Contract will instantly transition status to <strong className="underline">COMPROMISED</strong>.
            </p>
          </div>
        ) : (
          <div className="mb-4 p-3 rounded-md bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs font-mono">
            <span>Temperature within safe storage threshold ({shipment.minTemp}°C - {shipment.maxTemp}°C).</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1 font-mono">
              <label className="text-xs font-semibold text-slate-300">
                Temperature (°C)
              </label>
              <span className={`text-xs font-bold ${isBreaching ? 'text-rose-400' : 'text-emerald-400'}`}>
                {temperature}°C
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="10.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0°C (Freezing)</span>
              <span className="text-rose-400 font-bold">{shipment.maxTemp}°C (Max Threshold)</span>
              <span>10°C (Spike)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Relative Humidity (%)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Current Location / GPS Hub
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
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
              className={`text-xs ${isBreaching ? 'bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-md transition-colors flex items-center gap-1.5' : 'btn-primary'}`}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Broadcasting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Telemetry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
