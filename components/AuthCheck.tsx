'use client';

import { useEffect, useState } from 'react';
import { getDeviceToken } from '@/lib/settings';
import SetupScreen from './SetupScreen';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getDeviceToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const handleSetupComplete = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📄</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  return <>{children}</>;
}
