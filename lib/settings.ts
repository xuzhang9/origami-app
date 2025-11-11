import { Settings } from './types';

const SETTINGS_KEY = 'origami_settings';

export function getSettings(): Settings {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading settings:', error);
  }

  return {};
}

export function saveSettings(settings: Partial<Settings>): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export function getDeviceToken(): string | null {
  const settings = getSettings();
  return settings.deviceToken || null;
}

export function getApiKey(): string | null {
  const settings = getSettings();
  return settings.openaiApiKey || null;
}

export function clearSettings(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing settings:', error);
  }
}
