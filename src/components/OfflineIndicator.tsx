import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-[#141413] text-white px-3.5 py-2 text-xs font-medium shadow-lg border border-white/10"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#E8A54B] shrink-0" />
      <span>Offline mode — Menu and saved orders remain available.</span>
    </div>
  );
};
