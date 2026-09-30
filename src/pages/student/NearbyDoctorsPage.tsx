import React, { useState } from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  Stethoscope,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  HeartPulse,
  Phone,
  Video,
  MessageSquare
} from 'lucide-react';
import { InteractiveVectorMap } from '../../components/map/InteractiveVectorMap';
import { DoctorProfile } from '../../types';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
}

export const NearbyDoctorsPage: React.FC<Props> = ({ state, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE'>('ALL');

  const studentCoords = state.student.coordinates;

  const specialties = ['ALL', 'Internal Medicine', 'Emergency Medicine', 'General Practice', 'Pediatrics'];

  const filteredDoctors = state.doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec =
      selectedSpecialty === 'ALL' || doc.specialization.includes(selectedSpecialty);
    const matchesStatus =
      statusFilter === 'ALL' || doc.status === 'AVAILABLE';
    return matchesSearch && matchesSpec && matchesStatus;
  });

  const handleRequestDoctor = (doc: DoctorProfile) => {
    onNavigate('/student/request-doctor');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
              Campus & Neighborhood Network
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Nearby Verified Doctors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Available licensed physicians on-duty near {studentCoords.address.split(',')[0]}.
            </p>
          </div>

          {/* Toggle Map / List */}
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

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, or hospital..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
            <button
              onClick={() => setStatusFilter(statusFilter === 'ALL' ? 'AVAILABLE' : 'ALL')}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors border ${
                statusFilter === 'AVAILABLE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🟢 Online Now Only
            </button>
          </div>
        </div>

        {/* MAP VIEW */}
        {viewMode === 'MAP' ? (
          <InteractiveVectorMap
            studentCoords={studentCoords}
            doctors={filteredDoctors}
            facilities={state.facilities}
            onRequestDoctorDirectly={handleRequestDoctor}
          />
        ) : (
          /* LIST VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((doc) => {
              const isAvailable = doc.status === 'AVAILABLE';

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start gap-4">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                            {doc.name}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {isAvailable ? '🟢 Available' : '🟡 In Consult'}
                          </span>
                        </div>

                        <p className="text-xs text-sky-700 font-semibold mt-0.5">
                          {doc.specialization}
                        </p>

                        <p className="text-[11px] text-slate-500 mt-1">
                          {doc.qualification} • {doc.experienceYears} yrs experience
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-sky-600" /> Response Time:
                        </span>
                        <span className="font-bold text-slate-800">
                          ~{doc.estimatedResponseTimeMinutes} mins
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-sky-600" /> Clinic:
                        </span>
                        <span className="text-slate-800 truncate max-w-[200px]">
                          {doc.clinicAffiliation}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Patient Rating:
                        </span>
                        <span className="font-bold text-slate-800">
                          {doc.rating} ({doc.totalReviews} reviews)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Languages: {doc.languages.join(', ')}</span>
                        <span>License: {doc.licenseNumber.split('-')[0]}-VERIFIED</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => handleRequestDoctor(doc)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <HeartPulse className="h-4 w-4" />
                      <span>Request Triage with {doc.name.split(' ')[1] || doc.name}</span>
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
