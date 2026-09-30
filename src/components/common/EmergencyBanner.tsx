import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, Building2, X, ShieldAlert } from 'lucide-react';

interface Props {
  onOpenSOSModal?: () => void;
}

export const EmergencyBanner: React.FC<Props> = ({ onOpenSOSModal }) => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md border-b border-red-800">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 font-medium">
            <span className="flex h-6 w-6 rounded-full bg-white/20 items-center justify-center shrink-0 animate-pulse">
              <AlertTriangle className="h-4 w-4 text-white" />
            </span>
            <p className="text-xs sm:text-sm text-red-50">
              <strong className="font-bold text-white">Emergency Warning:</strong> If experiencing chest pain, severe breathing difficulty, loss of consciousness, or heavy bleeding, seek emergency hospital care immediately.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (onOpenSOSModal) {
                  onOpenSOSModal();
                } else {
                  setShowEmergencyModal(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-red-700 font-bold text-xs hover:bg-red-50 active:scale-95 transition-all shadow-sm"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Emergency SOS / 108</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-red-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-xl text-red-600">
                  <ShieldAlert className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Emergency Support Dial</h3>
                  <p className="text-xs text-red-600 font-semibold tracking-wide uppercase">Immediate In-Person Care</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              CareReach is designed for non-life-threatening triage and urgent medical guidance. For critical emergencies, every second counts.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href="tel:108"
                className="flex items-center justify-between p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 hover:bg-red-100 transition-colors font-medium"
              >
                <div className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-red-600" />
                  <div className="text-left">
                    <p className="font-bold text-sm">National Emergency Ambulance (108 / 112)</p>
                    <p className="text-xs text-red-600">Free 24x7 Government Emergency Response</p>
                  </div>
                </div>
                <span className="text-xs bg-red-600 text-white font-bold px-3 py-1 rounded-full">Call 108</span>
              </a>

              <a
                href="tel:+918023456701"
                className="flex items-center justify-between p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-800 hover:bg-sky-100 transition-colors font-medium"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-sky-600" />
                  <div className="text-left">
                    <p className="font-bold text-sm">Campus Health Centre & Night Nurse</p>
                    <p className="text-xs text-sky-600">Dispensary Block, 0.4 km away</p>
                  </div>
                </div>
                <span className="text-xs bg-sky-600 text-white font-bold px-3 py-1 rounded-full">Call Campus</span>
              </a>

              <a
                href="tel:+918040009999"
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors font-medium"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-slate-600" />
                  <div className="text-left">
                    <p className="font-bold text-sm">City Care 24/7 Trauma Emergency</p>
                    <p className="text-xs text-slate-500">Outer Ring Road (2.8 km away)</p>
                  </div>
                </div>
                <span className="text-xs bg-slate-700 text-white font-bold px-3 py-1 rounded-full">Call Trauma</span>
              </a>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors"
              >
                Close & Return to CareReach
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
