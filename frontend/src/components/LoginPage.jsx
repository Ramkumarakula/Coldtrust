import React, { useState } from 'react';

const API_BASE = 'http://localhost:3000';

const DEMO_PRESETS = [
  {
    role: 'Manufacturer',
    username: 'manufacturer',
    label: 'BioPharma Corp (Manufacturer)',
    icon: '🏭',
    badge: 'ManufacturerMSP',
  },
  {
    role: 'Transport',
    username: 'transport',
    label: 'SwiftCold Logistics (Carrier)',
    icon: '🚚',
    badge: 'TransportMSP',
  },
  {
    role: 'Retailer',
    username: 'retailer',
    label: 'Apex Central Pharmacy (Retailer)',
    icon: '🏥',
    badge: 'RetailerMSP',
  },
];

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('manufacturer');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectPreset = (preset) => {
    setUsername(preset.username);
    setPassword('Password123!');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Login failed. Please check credentials.');
      }

      const { token, user } = data.data;

      // Sensitive Data Exposed in Client-Side Storage: Store raw JWT in localStorage
      localStorage.setItem('coldtrust_jwt_token', token);
      localStorage.setItem('coldtrust_user', JSON.stringify(user));

      if (onLoginSuccess) {
        onLoginSuccess(user, token);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 py-12 text-on-surface">
      <div className="w-full max-w-md bg-surface-container rounded-2xl border border-outline-variant shadow-2xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-container/20 text-primary-container text-2xl font-bold border border-primary-container/30">
            ❄️
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">ColdTrust Network</h1>
          <p className="text-sm text-on-surface-variant">
            Consortium Role-Based Authentication Gateway
          </p>
        </div>

        {/* Quick Role Fill Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
            Select Consortium Demo Role
          </label>
          <div className="grid grid-cols-1 gap-2">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.username}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-sm transition-all ${
                  username.toLowerCase() === preset.username
                    ? 'border-primary-container bg-primary-container/10 text-on-surface shadow-sm'
                    : 'border-outline-variant hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{preset.icon}</span>
                  <div>
                    <div className="font-medium text-on-surface">{preset.label}</div>
                    <div className="text-xs text-on-surface-variant font-mono">User: {preset.username}</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-primary-container font-mono">
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-on-surface-variant block mb-1">
              Username / Identity
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container text-sm"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-on-surface-variant block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container text-sm"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-error-container/20 border border-error-container/40 text-error-container text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-primary-container text-on-primary-container font-semibold hover:brightness-110 active:brightness-95 transition-all text-sm shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate & Enter Dashboard'}
          </button>
        </form>

        <div className="pt-2 border-t border-outline-variant/60 text-center">
          <p className="text-xs text-on-surface-variant">
            Default Demo Password: <code className="text-primary-container font-mono">Password123!</code>
          </p>
        </div>
      </div>
    </div>
  );
}
