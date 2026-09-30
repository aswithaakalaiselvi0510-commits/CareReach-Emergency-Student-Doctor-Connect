import React, { useState, useEffect } from 'react';
import { onPushNotification } from '../../services/fcm';
import { HeartPulse, BellRing, ArrowRight, X, ShieldCheck } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const PushNotificationToast: React.FC<Props> = ({ onNavigate }) => {
  const [activeAlert, setActiveAlert] = useState<{
    title: string;
    body: string;
    consultationId?: string;
    doctorName?: string;
    doctorSpecialty?: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onPushNotification((payload) => {
      setActiveAlert({
        title: payload.notification?.title || '🚨 Doctor Matched!',
        body: payload.notification?.body || 'A nearby doctor has accepted your emergency request.',
        consultationId: payload.data?.consultationId,
        doctorName: payload.data?.doctorName,
        doctorSpecialty: payload.data?.doctorSpecialty
      });
    });

    return unsubscribe;
  }, []);

  if (!activeAlert) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full p-4 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-5 shadow-2xl border-2 border-emerald-500/60 ring-4 ring-emerald-500/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow">
                <BellRing className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Firebase Cloud Messaging Push
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-white mt-1">
                {activeAlert.title}
              </h4>
            </div>
          </div>

          <button
            onClick={() => setActiveAlert(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2.5 text-xs text-slate-300 leading-relaxed font-medium">
          {activeAlert.body}
        </p>

        {activeAlert.consultationId && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Doctor Joined Channel
            </span>
            <button
              onClick={() => {
                onNavigate(`/student/consultation/${activeAlert.consultationId}`);
                setActiveAlert(null);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Enter Consultation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
