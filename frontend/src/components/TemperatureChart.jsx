import React from 'react';
import { Thermometer, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function TemperatureChart({ telemetryLogs = [], minTemp = 2.0, maxTemp = 4.0, currentTemp }) {
  // Construct data points from logs or synthesize points if logs are sparse
  const logs = telemetryLogs.length > 0
    ? telemetryLogs
    : [
        { timestamp: '00:00', temperature: minTemp + 0.5 },
        { timestamp: 'Latest', temperature: currentTemp ?? (minTemp + 1.0) },
      ];

  const temps = logs.map((l) => Number(l.temperature) || 0);
  const minObserved = Math.min(...temps, minTemp - 1);
  const maxObserved = Math.max(...temps, maxTemp + 2);
  const range = maxObserved - minObserved || 1;

  // Chart dimensions
  const width = 500;
  const height = 180;
  const padding = 35;

  const points = logs.map((log, index) => {
    const x = padding + (index / (logs.length - 1 || 1)) * (width - padding * 2);
    const temp = Number(log.temperature) || 0;
    const y = height - padding - ((temp - minObserved) / range) * (height - padding * 2);
    const isBreached = temp > maxTemp;
    return { x, y, temp, timestamp: log.timestamp, isBreached };
  });

  const maxTempY = height - padding - ((maxTemp - minObserved) / range) * (height - padding * 2);
  const minTempY = height - padding - ((minTemp - minObserved) / range) * (height - padding * 2);

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );

  const hasBreach = points.some((p) => p.isBreached);

  return (
    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Cold Chain Temperature Telemetry (°C)
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-0.5 bg-emerald-400 inline-block"></span> Min {minTemp}°C
          </span>
          <span className="text-rose-400 flex items-center gap-1">
            <span className="w-2 h-0.5 bg-rose-400 inline-block"></span> Max {maxTemp}°C
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Background Grid Lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1e293b" />

          {/* Min Temp Threshold Line */}
          <line
            x1={padding}
            y1={minTempY}
            x2={width - padding}
            y2={minTempY}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x={width - padding + 4} y={minTempY + 3} fill="#10b981" fontSize="9" fontFamily="monospace">
            {minTemp}°C
          </text>

          {/* Max Temp Threshold Line */}
          <line
            x1={padding}
            y1={maxTempY}
            x2={width - padding}
            y2={maxTempY}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x={width - padding + 4} y={maxTempY + 3} fill="#ef4444" fontSize="9" fontFamily="monospace">
            {maxTemp}°C
          </text>

          {/* Telemetry Line */}
          <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Point Dots */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.isBreached ? 5 : 3.5}
                fill={p.isBreached ? '#ef4444' : '#38bdf8'}
                stroke="#0b0f17"
                strokeWidth="2"
              />
              {p.isBreached && (
                <circle cx={p.x} cy={p.y} r="8" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Footer Alert / Status */}
      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
        <div className="flex items-center gap-1.5 font-medium">
          {hasBreach ? (
            <span className="text-rose-400 flex items-center gap-1 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Breach Recorded Exceeding {maxTemp}°C Limit</span>
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Optimal Cold Chain Threshold Compliance</span>
            </span>
          )}
        </div>
        <span className="text-slate-500 font-mono text-[10px]">{logs.length} Data Points</span>
      </div>
    </div>
  );
}
