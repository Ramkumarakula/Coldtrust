import React, { useState } from 'react';
import { X, Thermometer, AlertTriangle, Send } from 'lucide-react';

export default function TelemetryModal({ isOpen, shipment, onClose, onSubmit }) {
  if (!isOpen || !shipment) return null;

  const [temperature, setTemperature] = useState(3.2);
  const [humidity, setHumidity] = useState(42.0);
  const [location, setLocation] = useState('Highway I-95, Km 210');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBreach = temperature > shipment.maxTemp;

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
      <div className="glass-card w-full max-w-md p-6 relative shadow-2xl border-indigo-500/30">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Simulate IoT Sensor Telemetry</h3>
            <p className="text-xs text-slate-400">Asset: <span className="font-mono text-cyan-400 font-bold">{shipment.shipmentID}</span></p>
          </div>
        </div>

        {/* Breach Alert Banner */}
        {isBreach ? (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs mb-4 flex items-start gap-2 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-rose-400">AUTOMATED BREACH WARNING</strong>
              Temperature ({temperature}°C) exceeds max threshold ({shipment.maxTemp}°C). Smart Contract will instantly mark status as <strong>COMPROMISED</strong>.
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Temperature within safe storage threshold ({shipment.minTemp}°C - {shipment.maxTemp}°C).</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Temperature (°C)
              </label>
              <span className={`font-mono font-bold text-xs ${isBreach ? 'text-rose-400' : 'text-emerald-400'}`}>
                {temperature}°C
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="10.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>0°C (Freezing)</span>
              <span className="text-rose-400 font-bold">4.0°C (Max Limit)</span>
              <span>10°C (High Spike)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Humidity (%)
            </label>
            <input
              type="number"
              step="0.5"
              required
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              GPS Location Reading
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary text-xs">
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting...' : 'Post IoT Reading'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
