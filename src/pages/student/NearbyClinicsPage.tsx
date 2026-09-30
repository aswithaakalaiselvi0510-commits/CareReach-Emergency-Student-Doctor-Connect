import React, { useState } from 'react';
import { AppState } from '../../services/store';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Navigation,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { InteractiveVectorMap } from '../../components/map/InteractiveVectorMap';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
}

export const NearbyClinicsPage: React.FC<Props> = ({ state, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const facilities = state.facilities;
  const studentCoords = state.student.coordinates;

  const [navNotice, setNavNotice] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {navNotice && (
          <div className="p-4 bg-sky-600 text-white rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
            <span>{navNotice}</span>
            <button onClick={() => setNavNotice(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
              Campus Vicinity Healthcare Map
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Nearby Clinics, Hospitals & Pharmacies
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified campus health centres, 24/7 emergency rooms, and all-night pharmacies within 3 km.
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 w-fit font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span><strong>Offline Resilient:</strong> These addresses, hotlines, and walking distances are cached by Service Worker for offline emergency use.</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-4 py-2 rounded-xl transition-all ${
                viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('MAP')}
              className={`px-4 py-2 rounded-xl transition-all ${
                viewMode === 'MAP' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Radar Map
            </button>
          </div>
        </div>

        {viewMode === 'MAP' ? (
          <InteractiveVectorMap
            studentCoords={studentCoords}
            doctors={state.doctors}
            facilities={facilities}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((fac) => {
              const is24x7 = fac.isOpen24x7;

              return (
                <div
                  key={fac.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 ${
                            fac.hasEmergencyTrauma ? 'bg-red-600' : 'bg-sky-600'
                          }`}
                        >
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                            {fac.name}
                          </h3>
                          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {fac.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          is24x7
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {is24x7 ? '🟢 Open 24/7' : 'Closed at Night'}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                        <span>{fac.address} ({fac.distanceKm} km from hostel)</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                        <span>{fac.openHours}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                        <span className="font-semibold text-slate-800">{fac.phone}</span>
                      </p>
                    </div>

                    {fac.hasEmergencyTrauma && (
                      <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>Equipped with 24/7 Trauma Surgery & Ambulance Bay</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <a
                      href={`tel:${fac.phone.split(' ')[0]}`}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call Reception
                    </a>

                    <button
                      onClick={() => setNavNotice(`Simulating live routing from ${studentCoords.address} to ${fac.name}. Estimated transit: ~${Math.round(fac.distanceKm * 3 + 2)} minutes.`)}
                      className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Directions
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
