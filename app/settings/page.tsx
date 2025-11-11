'use client';

import { useState, useEffect } from 'react';
import { getSettings, saveSettings, clearSettings } from '@/lib/settings';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = getSettings();
    setApiKey(settings.openaiApiKey || '');
    setDeviceName(settings.deviceName || '');
  }, []);

  const handleSave = () => {
    saveSettings({
      openaiApiKey: apiKey || undefined,
      deviceName: deviceName || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all settings?')) {
      clearSettings();
      setApiKey('');
      setDeviceName('');
      alert('Settings cleared! You will need to re-register your device.');
      window.location.href = '/';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-origami-blue to-origami-purple bg-clip-text text-transparent mb-4">
          ⚙️ Settings
        </h1>
        <p className="text-xl text-gray-600">
          Configure your Origami Fun app
        </p>
      </div>

      {/* OpenAI API Key Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🔑 OpenAI API Key
        </h2>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-700">
            <strong>Why do I need this?</strong><br />
            The API key is used to search for new origami instructions using AI.
            Without it, you can only browse the built-in origami collection.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input-field pr-24"
                placeholder="sk-..."
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold"
              >
                {showApiKey ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>How to get an API key:</strong>
            </p>
            <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
              <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">OpenAI API Keys</a></li>
              <li>Sign up or log in to your account</li>
              <li>Create a new API key</li>
              <li>Copy and paste it here</li>
            </ol>
            <p className="text-xs text-gray-600 mt-2">
              💡 Typical cost: $1-5/month depending on usage
            </p>
          </div>
        </div>
      </div>

      {/* Device Settings */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📱 Device Settings
        </h2>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Device Name
          </label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="input-field"
            placeholder="My iPad"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="btn-primary flex-1 text-xl"
        >
          {saved ? '✅ Saved!' : '💾 Save Settings'}
        </button>

        <button
          onClick={handleClear}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-lg"
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Info Section */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          📊 Privacy & Storage
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>✅ All settings are stored locally on your device</li>
          <li>✅ Your API key is never sent to our servers</li>
          <li>✅ Your API key is only used to call OpenAI directly</li>
          <li>✅ You control your own API costs and usage</li>
        </ul>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <a href="/" className="btn-secondary inline-block">
          ⬅️ Back to Home
        </a>
      </div>
    </div>
  );
}
