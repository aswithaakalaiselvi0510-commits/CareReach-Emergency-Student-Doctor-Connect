import React, { useState, useEffect } from 'react';
import { WifiOff, PhoneCall, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const OfflineStatusIndicator: React.FC<Props> = ({ onNavigate }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-medium shadow-md flex items-center justify-between border-b border-amber-600 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2.5 max-w-4xl mx-auto flex-1">
        <div className="p-1 rounded-lg bg-amber-600/30 text-slate-950">
          <WifiOff className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <span className="font-extrabold mr-1.5">Offline Medical Resilience Active:</span>
          <span>
            Network connectivity lost. Local campus infirmary, 24/7 hospital emergency lines, and clinic contacts are cached locally.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/student/clinics')}
            className="px-3 py-1 bg-slate-950 text-white font-bold rounded-lg hover:bg-slate-800 text-[11px] shadow-sm flex items-center gap-1"
          >
            <PhoneCall className="h-3 w-3" /> Cached Clinics
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-900 hover:text-black font-bold text-sm"
            title="Dismiss notice"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
