import React, { useState } from 'react';
import { DoctorProfile, ClinicFacility } from '../../types';
import {
  MapPin,
  Crosshair,
  Layers,
  Sparkles,
  Stethoscope,
  Building2,
  Navigation,
  Clock,
  Award,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface Props {
  studentCoords: { lat: number; lng: number; address: string };
  doctors: DoctorProfile[];
  facilities: ClinicFacility[];
  selectedDoctorId?: string;
  onSelectDoctor?: (doctor: DoctorProfile) => void;
  onRequestDoctorDirectly?: (doctor: DoctorProfile) => void;
}

export const InteractiveVectorMap: React.FC<Props> = ({
  studentCoords,
  doctors,
  facilities,
  selectedDoctorId,
  onSelectDoctor,
  onRequestDoctorDirectly
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'DOCTORS' | 'CLINICS'>('ALL');
  const [activeDoctor, setActiveDoctor] = useState<DoctorProfile | null>(
    doctors.find((d) => d.id === selectedDoctorId) || doctors[0] || null
  );

  // Approximate relative offsets from student center for dynamic map pins
  const getCoordinatesOffset = (targetLat: number, targetLng: number) => {
    // 1 deg lat ~ 111km, 1 deg lng ~ 108km
    const dy = (studentCoords.lat - targetLat) * 3500; // inverted for SVG y (down)
    const dx = (targetLng - studentCoords.lng) * 3500;
    return {
      x: Math.max(50, Math.min(550, 300 + dx)),
      y: Math.max(50, Math.min(350, 200 + dy))
    };
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 text-white relative">
      {/* Top Map Bar Controls */}
      <div className="p-4 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Navigation className="h-4 w-4 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              Hostel Radius & Provider Radar
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Pulse
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
              Center: {studentCoords.address}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'ALL'
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({doctors.length + facilities.length})
          </button>
          <button
            onClick={() => setActiveTab('DOCTORS')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'DOCTORS'
                ? 'bg-teal-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Doctors ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('CLINICS')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'CLINICS'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Clinics ({facilities.length})
          </button>
        </div>
      </div>

      {/* Vector Campus Radar Graphic Area */}
      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 select-none overflow-hidden flex items-center justify-center">
        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Radar concentric rings from student location (center 300, 200) */}
        <svg viewBox="0 0 600 400" className="w-full h-full absolute inset-0">
          {/* 1km ring */}
          <circle cx="300" cy="200" r="70" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <text x="375" y="195" fill="#38bdf8" fontSize="9" opacity="0.7">1 km radius</text>

          {/* 2km ring */}
          <circle cx="300" cy="200" r="130" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
          <text x="435" y="195" fill="#38bdf8" fontSize="9" opacity="0.6">2 km radius</text>

          {/* 3km ring */}
          <circle cx="300" cy="200" r="190" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
          <text x="495" y="195" fill="#38bdf8" fontSize="9" opacity="0.5">3 km radius</text>

          {/* College Campus boundary outline */}
          <path
            d="M 230 140 L 370 130 L 410 240 L 260 270 Z"
            fill="#0284c7"
            fillOpacity="0.04"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.5"
          />
          <text x="270" y="150" fill="#94a3b8" fontSize="9" fontWeight="600" opacity="0.8">CAMPUS PERIMETER</text>

          {/* Connection line from student to active doctor */}
          {activeDoctor && (
            (() => {
              const pos = getCoordinatesOffset(activeDoctor.coordinates.lat, activeDoctor.coordinates.lng);
              return (
                <line
                  x1="300"
                  y1="200"
                  x2={pos.x}
                  y2={pos.y}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
              );
            })()
          )}
        </svg>

        {/* Student Central Pin (Hostel) */}
        <div
          className="absolute z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="relative">
            <span className="absolute -inset-2 rounded-full bg-sky-500/30 animate-ping" />
            <div className="h-9 w-9 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center text-white shadow-lg shadow-sky-500/50">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <span className="mt-1 px-2 py-0.5 rounded bg-slate-950/90 text-[10px] font-bold text-sky-300 border border-sky-500/40 shadow whitespace-nowrap">
            You (Hostel 4B)
          </span>
        </div>

        {/* Doctor Pins */}
        {(activeTab === 'ALL' || activeTab === 'DOCTORS') &&
          doctors.map((doc) => {
            const pos = getCoordinatesOffset(doc.coordinates.lat, doc.coordinates.lng);
            const isSelected = activeDoctor?.id === doc.id;
            const isAvailable = doc.status === 'AVAILABLE';

            return (
              <div
                key={doc.id}
                onClick={() => {
                  setActiveDoctor(doc);
                  if (onSelectDoctor) onSelectDoctor(doc);
                }}
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                style={{ left: `${(pos.x / 600) * 100}%`, top: `${(pos.y / 400) * 100}%` }}
              >
                <div className="relative flex flex-col items-center group">
                  {isAvailable && (
                    <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-pulse" />
                  )}
                  <div
                    className={`h-8 w-8 rounded-full border-2 overflow-hidden flex items-center justify-center shadow-lg transition-all ${
                      isSelected
                        ? 'border-sky-400 ring-4 ring-sky-400/30 scale-110'
                        : isAvailable
                        ? 'border-emerald-400 bg-slate-800'
                        : 'border-slate-500 bg-slate-800'
                    }`}
                  >
                    <img src={doc.avatarUrl} alt={doc.name} className="h-full w-full object-cover" />
                  </div>

                  {/* Micro badge */}
                  <span
                    className={`mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold border shadow whitespace-nowrap ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-400'
                        : isAvailable
                        ? 'bg-slate-900 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    {doc.name.split(' ')[1] || doc.name} ({doc.status === 'AVAILABLE' ? '🟢 ~3m' : '🟡 Busy'})
                  </span>
                </div>
              </div>
            );
          })}

        {/* Facilities Pins */}
        {(activeTab === 'ALL' || activeTab === 'CLINICS') &&
          facilities.map((fac) => {
            const pos = getCoordinatesOffset(fac.coordinates.lat, fac.coordinates.lng);
            return (
              <div
                key={fac.id}
                className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${(pos.x / 600) * 100}%`, top: `${(pos.y / 400) * 100}%` }}
              >
                <div className="flex flex-col items-center">
                  <div className="h-7 w-7 rounded-lg bg-indigo-600 border border-indigo-400 flex items-center justify-center text-white shadow">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[8px] font-medium text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                    {fac.name.split(' ')[0]} ({fac.distanceKm} km)
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Selected Doctor Summary Card at Bottom of Map */}
      {activeDoctor && (
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={activeDoctor.avatarUrl}
              alt={activeDoctor.name}
              className="h-12 w-12 rounded-xl object-cover ring-2 ring-sky-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-white text-sm">{activeDoctor.name}</h5>
                {activeDoctor.verificationStatus === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold rounded">
                    <ShieldCheck className="h-3 w-3" /> VERIFIED
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeDoctor.status === 'AVAILABLE'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {activeDoctor.status === 'AVAILABLE' ? '🟢 Available Now' : '🟡 Busy'}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-0.5">{activeDoctor.specialization}</p>

              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-sky-400" /> ~{activeDoctor.estimatedResponseTimeMinutes}m response
                </span>
                <span>•</span>
                <span>⭐ {activeDoctor.rating} ({activeDoctor.totalReviews} reviews)</span>
                <span>•</span>
                <span className="text-sky-400">{activeDoctor.clinicAddress}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onRequestDoctorDirectly && (
              <button
                onClick={() => onRequestDoctorDirectly(activeDoctor)}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Request Consultation</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
