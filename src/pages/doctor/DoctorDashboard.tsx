import React, { useState, useEffect } from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  Stethoscope,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  MessageSquare,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { DoctorStatus } from '../../types';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
}

export const DoctorDashboard: React.FC<Props> = ({ state, onNavigate }) => {
  const currentDoc =
    state.doctors.find((d) => d.id === state.currentUserId) || state.doctors[0];

  const pendingRequests = state.requests.filter(
    (r) => r.status === 'PENDING_MATCH' && !r.isEmergencyFlagged
  );

  const activeConsultations = state.consultations.filter(
    (c) => c.doctorId === currentDoc.id && c.status === 'ACTIVE'
  );

  const todayAppointments = state.appointments.filter(
    (a) => a.doctorId === currentDoc.id && a.status === 'CONFIRMED'
  );

  const handleStatusToggle = (newStatus: DoctorStatus) => {
    CareReachStore.updateDoctorStatus(currentDoc.id, newStatus);
  };

  const handleAcceptRequest = (requestId: string) => {
    const consult = CareReachStore.acceptRequest(requestId, currentDoc.id);
    if (consult) {
      onNavigate(`/student/consultation/${consult.id}`);
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    CareReachStore.declineRequest(requestId, currentDoc.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Doctor Profile & Status Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentDoc.avatarUrl}
              alt={currentDoc.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-teal-500/40 shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {currentDoc.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  <ShieldCheck className="h-3.5 w-3.5" /> {currentDoc.verificationStatus}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentDoc.specialization} • License: {currentDoc.licenseNumber}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {currentDoc.clinicAffiliation} ({currentDoc.clinicAddress})
              </p>
            </div>
          </div>

          {/* Availability Status Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => handleStatusToggle('AVAILABLE')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentDoc.status === 'AVAILABLE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Available</span>
            </button>

            <button
              onClick={() => handleStatusToggle('BUSY')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentDoc.status === 'BUSY'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              <span>In Consult</span>
            </button>

            <button
              onClick={() => handleStatusToggle('OFFLINE')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentDoc.status === 'OFFLINE'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>Offline</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Incoming Requests</span>
            <p className="text-2xl font-black text-rose-600 mt-1">{pendingRequests.length}</p>
            <span className="text-[11px] text-slate-500">Hostel emergency queue</span>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Tele-Triage</span>
            <p className="text-2xl font-black text-teal-600 mt-1">{activeConsultations.length}</p>
            <span className="text-[11px] text-slate-500">Live chat & guidance</span>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Clinic Follow-ups</span>
            <p className="text-2xl font-black text-sky-600 mt-1">{todayAppointments.length}</p>
            <span className="text-[11px] text-slate-500">Booked for tomorrow</span>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Doctor Rating</span>
            <p className="text-2xl font-black text-amber-500 mt-1">⭐ {currentDoc.rating}</p>
            <span className="text-[11px] text-slate-500">{currentDoc.totalReviews} student reviews</span>
          </div>
        </div>

        {/* INCOMING EMERGENCY REQUESTS QUEUE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <h3 className="font-extrabold text-base text-slate-900">
                Incoming Student Medical Requests
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {pendingRequests.length} Pending
              </span>
            </div>

            <button
              onClick={() => onNavigate('/doctor/requests')}
              className="text-xs text-teal-700 font-bold hover:underline"
            >
              View Full Queue →
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-slate-200 rounded-2xl">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No active student requests right now</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Keep your status set to "Available" to receive alerts when students nearby trigger triage.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-rose-50/60 border-2 border-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{req.studentName} ({req.studentAge} y/o)</span>
                      <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                        {req.severity} SEVERITY
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-rose-950">
                      Primary Concern: {req.symptoms.join(', ')} • Onset: {req.startedWhen}
                    </p>

                    <p className="text-xs text-slate-600 italic">
                      "{req.description}"
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="h-3.5 w-3.5 text-sky-600" /> {req.studentHostel}
                      </span>
                      <span>•</span>
                      <span>Requested: {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-black shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Accept & Open Triage</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIVE CONSULTATIONS LIST */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal-600" />
            Active Triage Workspaces
          </h3>

          {activeConsultations.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-200 rounded-2xl">
              No active consultations in progress.
            </p>
          ) : (
            <div className="space-y-3">
              {activeConsultations.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Patient: {c.studentName} ({c.studentAge} y/o)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Location: {c.studentHostel}
                    </p>
                    <span className="text-[10px] text-teal-800 font-semibold bg-teal-100 px-2 py-0.5 rounded inline-block mt-1">
                      Started: {new Date(c.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate(`/student/consultation/${c.id}`)}
                    className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
