import React from 'react';
import { AppState } from '../../services/store';
import {
  PhoneCall,
  ShieldAlert,
  User,
  Building2,
  MapPin,
  Share2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface Props {
  state: AppState;
  onOpenSOSModal: () => void;
}

export const EmergencyContactsPage: React.FC<Props> = ({ state, onOpenSOSModal }) => {
  const student = state.student;
  const [copiedSOS, setCopiedSOS] = React.useState(false);

  const handleShareLocationSMS = () => {
    const text = `URGENT MEDICAL NOTICE: I am unwell in my hostel (${student.hostelName}, ${student.hostelRoom}). Room coordinates: Lat ${student.coordinates.lat}, Lng ${student.coordinates.lng}. Please check on me.`;
    navigator.clipboard.writeText(text);
    setCopiedSOS(true);
    setTimeout(() => setCopiedSOS(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {copiedSOS && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-lg animate-in fade-in">
            ✓ Emergency SOS dispatch text with hostel room & GPS coordinates copied to your clipboard!
          </div>
        )}
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/30">
              Hostel Rapid Response
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              Emergency Support & Warden Contacts
            </h1>
            <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-lg">
              One-tap dials for critical ambulance transport, hostel block wardens, campus night nurses, and registered family members.
            </p>
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-emerald-200 bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-400/30 w-fit font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>Available Offline: Direct phone dialers (tel:) work directly via device telephony even without internet.</span>
            </div>
          </div>

          <button
            onClick={onOpenSOSModal}
            className="px-6 py-3.5 bg-white text-red-700 font-extrabold text-sm rounded-2xl shadow-xl hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <PhoneCall className="h-5 w-5 animate-bounce" />
            <span>Launch SOS Dial</span>
          </button>
        </div>

        {/* Emergency Contacts Cards */}
        <div className="space-y-4">
          {/* National Ambulance 108 */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black text-xl shrink-0">
                108
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">National Emergency Ambulance</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                    24/7 TOLL FREE
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Government Paramedic & Trauma Dispatch (108 / 112)</p>
              </div>
            </div>
            <a
              href="tel:108"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="h-4 w-4" /> Call 108
            </a>
          </div>

          {/* Campus Chief Warden */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Hostel Chief Warden</h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  Prof. K. Murugan • Kaveri Hostel Block Office
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Available for hostel room door access & emergency vehicle entry</p>
              </div>
            </div>
            <a
              href="tel:+919443210987"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="h-4 w-4" /> Call Warden (+91 94432 10987)
            </a>
          </div>

          {/* Campus Night Infirmary Nurse */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Campus Infirmary Night Nurse</h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">Dispensary Desk (0.4 km from Hostel)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">First-aid supplies, wheelchair, stretcher, campus EV ambulance</p>
              </div>
            </div>
            <a
              href="tel:+918023456701"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="h-4 w-4" /> Call Nurse Desk
            </a>
          </div>

          {/* Registered Family Contact */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Primary Emergency Contact</h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  {student.emergencyContact.name} ({student.emergencyContact.relation})
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{student.emergencyContact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${student.emergencyContact.phone}`}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="h-4 w-4" /> Call Family
              </a>
              <button
                onClick={handleShareLocationSMS}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                title="Copy emergency location message"
              >
                <Share2 className="h-4 w-4" /> Share Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
