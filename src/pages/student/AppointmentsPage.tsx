import React, { useState } from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Sparkles,
  Thermometer
} from 'lucide-react';
import { AppointmentType } from '../../types';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
  onOpenAssistant?: () => void;
}

export const AppointmentsPage: React.FC<Props> = ({ state, onNavigate, onOpenAssistant }) => {
  const student = state.student;
  const appointments = state.appointments.filter((a) => a.studentId === student.id);
  const slots = state.appointmentSlots.filter((s) => !s.isBooked);

  const [filterDate, setFilterDate] = useState<'ALL' | 'TOMORROW' | 'UPCOMING'>('ALL');
  const [showBookNewModal, setShowBookNewModal] = useState(false);

  const handleCancel = (id: string) => {
    if (window.confirm('Cancel this follow-up clinic visit?')) {
      CareReachStore.cancelAppointment(id, 'Student cancelled via portal');
    }
  };

  const handleBook = (slot: any) => {
    CareReachStore.bookAppointment({
      studentId: student.id,
      studentName: student.name,
      studentPhone: student.phone,
      doctorId: slot.doctorId,
      doctorName: slot.doctorName,
      doctorSpecialty: 'Internal Medicine / Urgent Care',
      facilityName: slot.facilityName,
      facilityAddress: slot.facilityAddress,
      type: slot.type,
      date: slot.date,
      time: slot.time,
      reason: 'General follow-up consultation'
    });
    setShowBookNewModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
              Clinical Follow-Up Care
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              My Appointments & Next-Day Visits
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Scheduled in-person evaluations at the campus clinic or local urgent care centres.
            </p>
          </div>

          <button
            onClick={() => setShowBookNewModal(true)}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Book Follow-Up Slot</span>
          </button>
        </div>

        {/* Preliminary Guidance Symptom Checker Callout */}
        {onOpenAssistant && (
          <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 p-5 rounded-3xl border border-sky-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow">
                <Thermometer className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Not sure what doctor to book?
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    Gemini AI
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                  Use our <strong>1-Tap Symptom Checker</strong> for preliminary guidance, home first-aid steps, and audio-readout before booking your visit.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAssistant}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all shrink-0"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Check Symptoms First</span>
            </button>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <CalendarCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No appointments booked yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                When a doctor recommends a follow-up visit after a consultation, or when you book directly, your confirmed pass will appear here.
              </p>
              <button
                onClick={() => setShowBookNewModal(true)}
                className="mt-4 px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl"
              >
                Browse Next-Day Slots
              </button>
            </div>
          ) : (
            appointments.map((appt) => {
              const isConfirmed = appt.status === 'CONFIRMED';

              return (
                <div
                  key={appt.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{appt.facilityName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isConfirmed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900">
                      With {appt.doctorName} ({appt.doctorSpecialty})
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-sky-600" /> Date: {appt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-sky-600" /> Time: {appt.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-sky-600" /> {appt.facilityAddress}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 italic">
                      Clinical Reason: {appt.reason}
                    </p>
                  </div>

                  {isConfirmed && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCancel(appt.id)}
                        className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const passNotice = document.getElementById(`pass-notice-${appt.id}`);
                          if (passNotice) {
                            passNotice.classList.toggle('hidden');
                          }
                        }}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        View Digital Pass
                      </button>
                    </div>
                  )}

                  {/* Collapsible Digital Pass */}
                  <div id={`pass-notice-${appt.id}`} className="hidden mt-3 p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs space-y-1">
                    <p className="font-extrabold text-sky-950">📋 Verified Clinic Pass Issued:</p>
                    <p className="text-slate-700">Patient: <strong>{student.name}</strong> • Scheduled: <strong>{appt.date} at {appt.time}</strong></p>
                    <p className="text-slate-500">Facility: {appt.facilityName} ({appt.facilityAddress}). Please show this screen at reception.</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Book New Slot */}
        {showBookNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">
                  Available Next-Day Appointment Slots
                </h3>
                <button
                  onClick={() => setShowBookNewModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-72 overflow-y-auto">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{slot.facilityName}</span>
                      <p className="text-slate-500 text-[11px]">{slot.doctorName} • {slot.facilityAddress}</p>
                      <span className="text-[10px] text-sky-700 font-semibold mt-1 inline-block">
                        📅 {slot.date} at {slot.time} ({slot.distanceKm} km away)
                      </span>
                    </div>
                    <button
                      onClick={() => handleBook(slot)}
                      className="px-3.5 py-1.5 bg-sky-600 text-white font-bold rounded-xl text-[11px] hover:bg-sky-700"
                    >
                      Book Slot
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowBookNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
