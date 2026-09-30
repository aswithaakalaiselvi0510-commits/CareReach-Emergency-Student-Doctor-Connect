import React from 'react';
import { AppState } from '../../services/store';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  User,
  Phone,
  Building2
} from 'lucide-react';

interface Props {
  state: AppState;
}

export const DoctorAppointmentsPage: React.FC<Props> = ({ state }) => {
  const currentDoc =
    state.doctors.find((d) => d.id === state.currentUserId) || state.doctors[0];

  const appointments = state.appointments.filter(
    (a) => a.doctorId === currentDoc.id
  );

  const [attendedId, setAttendedId] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {attendedId && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-lg animate-in fade-in">
            ✓ Marked follow-up physical examination as Completed in clinical record.
          </div>
        )}
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
            Clinic Schedule
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Follow-Up Clinic Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Patients booked for in-person evaluations after previous night tele-triage.
          </p>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No scheduled follow-up visits</p>
              <p className="text-xs text-slate-400 mt-1">
                When you recommend follow-up during a consultation and the student chooses a slot, it will appear here.
              </p>
            </div>
          ) : (
            appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900">
                      {appt.studentName}
                    </span>
                    <span className="text-xs text-slate-500">({appt.studentPhone})</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      {appt.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700">
                    Location: {appt.facilityName} ({appt.facilityAddress})
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-teal-600" /> {appt.date}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-teal-600" /> {appt.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                    Clinical Reason: {appt.reason}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${appt.studentPhone}`}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call Student
                  </a>
                  <button
                    onClick={() => {
                      setAttendedId(appt.id);
                      setTimeout(() => setAttendedId(null), 3000);
                    }}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Attended
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
