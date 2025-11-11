'use client';

import { useState } from 'react';
import { saveSettings } from '@/lib/settings';

interface SetupScreenProps {
  onComplete: () => void;
}

export default function SetupScreen({ onComplete }: SetupScreenProps) {
  const [familyCode, setFamilyCode] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyCode, deviceName: deviceName || 'My iPad' }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Save device token to localStorage
      saveSettings({
        deviceToken: data.deviceToken,
        deviceName: deviceName || 'My iPad',
      });

      onComplete();
    } catch (err) {
      setError('Something went wrong. Please try again!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-4">🎨</h1>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-origami-purple to-origami-pink bg-clip-text text-transparent mb-2">
            Welcome to Origami Fun!
          </h2>
          <p className="text-gray-600 text-lg">
            Let's set up your device to start folding!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Family Code 🔑
            </label>
            <input
              type="text"
              value={familyCode}
              onChange={(e) => setFamilyCode(e.target.value)}
              className="input-field"
              placeholder="Enter your family code"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Device Name (Optional) 📱
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="input-field"
              placeholder="My iPad"
            />
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Setting up...' : '🚀 Get Started!'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ask your parent for the family code!
        </p>
      </div>
    </div>
  );
}
