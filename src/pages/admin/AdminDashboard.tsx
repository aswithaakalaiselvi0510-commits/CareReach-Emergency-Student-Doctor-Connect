import React from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Activity,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ state, onNavigate }) => {
  const totalStudents = 1240; // campus student population
  const verifiedDoctors = state.doctors.filter((d) => d.verificationStatus === 'VERIFIED').length;
  const pendingDoctors = state.doctors.filter((d) => d.verificationStatus === 'PENDING').length;
  const activeConsultations = state.consultations.filter((c) => c.status === 'ACTIVE').length;
  const totalConsultations = state.consultations.length;
  const pendingRequests = state.requests.filter((r) => r.status === 'PENDING_MATCH').length;
  const totalAppointments = state.appointments.length;
  const emergencyEscalations = state.requests.filter((r) => r.isEmergencyFlagged).length;

  const handleVerify = (docId: string) => {
    CareReachStore.verifyDoctor(docId, 'VERIFIED');
  };

  const handleReject = (docId: string) => {
    CareReachStore.verifyDoctor(docId, 'REJECTED');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              Campus Health Administration & Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              CareReach Administrative Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live telemetry, physician credentials verification, safety escalations, and audit compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/admin/doctors')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              Verify Doctors ({pendingDoctors})
            </button>
            <button
              onClick={() => onNavigate('/admin/audit-logs')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Audit Logs
            </button>
          </div>
        </div>

        {/* 6 Key Performance Indicators (KPIs) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Doctors</span>
            <p className="text-2xl font-black text-teal-600 mt-1">{verifiedDoctors}</p>
            <span className="text-[10px] text-slate-500">+{pendingDoctors} pending</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Triage</span>
            <p className="text-2xl font-black text-sky-600 mt-1">{activeConsultations}</p>
            <span className="text-[10px] text-slate-500">Live sessions</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Requests</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingRequests}</p>
            <span className="text-[10px] text-slate-500">Hostel queue</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Follow-up Visits</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">{totalAppointments}</p>
            <span className="text-[10px] text-slate-500">Clinic appointments</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Emergency SOS</span>
            <p className="text-2xl font-black text-red-600 mt-1">{emergencyEscalations}</p>
            <span className="text-[10px] text-slate-500">Red-flag escalations</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Response</span>
            <p className="text-2xl font-black text-slate-800 mt-1">2.4m</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Under 3m SLA</span>
          </div>
        </div>

        {/* 2-Column: Doctor Verification Queue & Safety Escalations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor Verification Queue */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                  <h3 className="font-extrabold text-base text-slate-900">
                    Physician Medical License Approvals
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('/admin/doctors')}
                  className="text-xs text-purple-600 font-bold hover:underline"
                >
                  View all ({state.doctors.length})
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {state.doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{doc.name}</span>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            doc.verificationStatus === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : doc.verificationStatus === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {doc.verificationStatus}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{doc.qualification}</p>
                      <p className="text-slate-400 text-[10px]">License: {doc.licenseNumber}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {doc.verificationStatus === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleVerify(doc.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(doc.id)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {doc.verificationStatus === 'VERIFIED' ? '✓ Active Provider' : 'Rejected'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Escalations Monitor */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  <h3 className="font-extrabold text-base text-slate-900">
                    Emergency Red-Flag Escalations
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Critical Safety Layer
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                {state.requests.filter((r) => r.isEmergencyFlagged).length === 0 ? (
                  <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-1" />
                    <span>No critical hospital escalations reported today.</span>
                  </div>
                ) : (
                  state.requests
                    .filter((r) => r.isEmergencyFlagged)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-950 space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{r.studentName} ({r.studentHostel})</span>
                          <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full">
                            SOS DIALED
                          </span>
                        </div>
                        <p className="text-[11px] text-red-800">
                          Flagged Symptoms: {r.symptoms.join(', ')} • Severity: {r.severity}
                        </p>
                        <p className="text-[10px] text-red-600">
                          Dispatched: {new Date(r.createdAt).toLocaleTimeString()} • Campus ambulance alerted
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Automatic notification to campus safety office</span>
              <button
                onClick={() => onNavigate('/admin/requests')}
                className="text-purple-600 font-bold hover:underline"
              >
                Inspect live feeds →
              </button>
            </div>
          </div>
        </div>

        {/* Audit Logs Quick Strip */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-600" />
              Latest System Audit Events (Immutable Log)
            </h3>
            <button
              onClick={() => onNavigate('/admin/audit-logs')}
              className="text-xs text-purple-600 font-bold hover:underline"
            >
              Full Audit Trail ({state.auditLogs.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {state.auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">{log.details}</p>
                </div>
                <div className="text-right text-[10px] text-slate-400 shrink-0">
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="block font-medium text-slate-600">{log.userName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
