import React, { useState } from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Plus,
  ShieldCheck,
  CheckCircle,
  FileCheck2,
  Sparkles,
  Thermometer,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  History,
  Activity,
  Mic,
  Stethoscope,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MedicalRecord } from '../../types';

interface Props {
  state: AppState;
  onNavigate?: (path: string) => void;
}

export const HealthRecordsPage: React.FC<Props> = ({ state, onNavigate }) => {
  const student = state.student;
  const records = state.records.filter((r) => r.studentId === student.id);

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TIMELINE'>('CARDS');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Record Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MedicalRecord['category']>('PRESCRIPTION');
  const [sharedWithDoctor, setSharedWithDoctor] = useState(true);

  const [previewingRecord, setPreviewingRecord] = useState<MedicalRecord | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this health document from your vault?')) {
      CareReachStore.deleteMedicalRecord(id);
    }
  };

  const handleToggleShare = (id: string) => {
    CareReachStore.toggleRecordSharing(id);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    CareReachStore.addMedicalRecord({
      studentId: student.id,
      title: title.trim(),
      category,
      fileUrl: '#',
      fileName: `${title.replace(/\s+/g, '_')}.pdf`,
      fileSize: '350 KB',
      sharedWithDoctor
    });

    setTitle('');
    setShowUploadModal(false);
  };

  const filteredRecords = records.filter(
    (r) => filterCategory === 'ALL' || r.category === filterCategory
  );

  const symptomCheckRecords = records.filter((r) => r.category === 'SYMPTOM_ASSESSMENT');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
              Encrypted Medical Vault & History
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Student Health Records & History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Securely archive prescriptions, lab reports, and automated AI symptom check history to track your health over time.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center text-xs font-bold">
              <button
                onClick={() => setViewMode('CARDS')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  viewMode === 'CARDS'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Vault View
              </button>
              <button
                onClick={() => setViewMode('TIMELINE')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  viewMode === 'TIMELINE'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span>Health Timeline ({symptomCheckRecords.length})</span>
              </button>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Doc</span>
            </button>
          </div>
        </div>

        {/* Health History Progress Summary Card */}
        {symptomCheckRecords.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 rounded-3xl p-5 border border-indigo-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow">
                <Activity className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Symptom History Tracker
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {symptomCheckRecords.length} Saved Log{symptomCheckRecords.length > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                  Your Health Assistant symptom evaluations are automatically recorded below. Consulting doctors can review your past episodes to identify recurrence or chronic symptoms.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFilterCategory('SYMPTOM_ASSESSMENT');
                  setViewMode('TIMELINE');
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Track Timeline</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 no-scrollbar">
          {[
            { id: 'ALL', label: 'All Documents' },
            { id: 'SYMPTOM_ASSESSMENT', label: `🩺 AI Symptom History (${symptomCheckRecords.length})` },
            { id: 'PRESCRIPTION', label: 'Prescriptions' },
            { id: 'LAB_REPORT', label: 'Lab Reports' },
            { id: 'CONSULTATION_NOTE', label: 'Doctor Notes' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                filterCategory === cat.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: CHRONOLOGICAL HEALTH HISTORY & SYMPTOM TIMELINE */}
        {/* ======================================================== */}
        {viewMode === 'TIMELINE' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <History className="h-5 w-5 text-indigo-600" />
                  Health History & Symptom Progression Timeline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological progression of health assessments conducted via CareReach Health Assistant.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Newest First
              </span>
            </div>

            {symptomCheckRecords.length === 0 ? (
              <div className="text-center py-12">
                <Thermometer className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-sm">No symptom assessments logged yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  When you run a symptom evaluation in the CareReach Health Assistant, it is automatically archived here for long-term health tracking.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 space-y-8">
                {symptomCheckRecords.map((rec) => {
                  const sa = rec.symptomAssessment;
                  const isUrgent = sa?.urgencyLevel === 'SAME_DAY_URGENT' || sa?.urgencyLevel === 'EMERGENCY_NOW';

                  return (
                    <div key={rec.id} className="relative group">
                      {/* Timeline Node Point */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-1.5 h-6 w-6 rounded-full border-4 border-white shadow-md flex items-center justify-center ${
                          isUrgent ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </div>

                      {/* Timeline Card */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 transition-all shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-slate-900">
                                {new Date(rec.uploadedAt).toLocaleDateString([], {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                                <Clock className="h-3 w-3" />
                                {new Date(rec.uploadedAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {sa?.severity && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                  {sa.severity === 'mild'
                                    ? '🙂 Mild'
                                    : sa.severity === 'moderate'
                                    ? '😐 Moderate'
                                    : '😣 Severe'}
                                </span>
                              )}
                              {sa?.urgencyLevel && (
                                <span
                                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                    sa.urgencyLevel === 'EMERGENCY_NOW'
                                      ? 'bg-red-100 text-red-700 border border-red-300'
                                      : sa.urgencyLevel === 'SAME_DAY_URGENT'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  }`}
                                >
                                  {sa.urgencyLevel.replace(/_/g, ' ')}
                                </span>
                              )}
                            </div>
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1">
                              {rec.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => handleToggleShare(rec.id)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 self-start sm:self-auto transition-colors ${
                              rec.sharedWithDoctor
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {rec.sharedWithDoctor ? (
                              <>
                                <Unlock className="h-3 w-3" /> Shared with Doctors
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3" /> Private (Hidden)
                              </>
                            )}
                          </button>
                        </div>

                        {/* Symptoms Logged Chips */}
                        {sa?.symptoms && sa.symptoms.length > 0 && (
                          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-500 mr-1">
                              Logged Symptoms:
                            </span>
                            {sa.symptoms.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                            {sa.duration && (
                              <span className="px-2.5 py-0.5 rounded-lg bg-slate-200/80 text-slate-700 text-xs font-medium">
                                ⏱️ {sa.duration}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Spoken Voice Notes Quote if Dictated */}
                        {sa?.voiceDictatedNotes && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2 italic">
                            <Mic className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                            <span>Voice Notes: "{sa.voiceDictatedNotes}"</span>
                          </div>
                        )}

                        {/* Summary & Guidance */}
                        <p className="mt-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                          {sa?.summary || rec.doctorNotes}
                        </p>

                        {/* Safe Steps Preview */}
                        {sa?.immediateCare && sa.immediateCare.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                              Recommended Safe Steps:
                            </span>
                            <ul className="space-y-1">
                              {sa.immediateCare.slice(0, 2).map((step, idx) => (
                                <li
                                  key={idx}
                                  className="text-xs text-slate-700 flex items-center gap-1.5 font-medium"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Card Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                          <button
                            onClick={() => setPreviewingRecord(rec)}
                            className="text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-1"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View Full Health Guidance Report</span>
                          </button>

                          <div className="flex items-center gap-3">
                            {onNavigate && (
                              <button
                                onClick={() => onNavigate('/student/appointments')}
                                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                              >
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Book Follow-Up</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(rec.id)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                              title="Delete record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: STANDARD DOCUMENT VAULT GRID */
          /* ======================================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecords.length === 0 ? (
              <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">No documents in this category</p>
                <p className="text-xs text-slate-400 mt-1">
                  Upload prescriptions, lab tests, or use the Symptom Checker to record health entries.
                </p>
              </div>
            ) : (
              filteredRecords.map((rec) => {
                const isSymptomAssessment = rec.category === 'SYMPTOM_ASSESSMENT';
                const sa = rec.symptomAssessment;

                return (
                  <div
                    key={rec.id}
                    className={`bg-white rounded-3xl p-5 shadow-sm border transition-all flex flex-col justify-between space-y-4 ${
                      isSymptomAssessment
                        ? 'border-indigo-200 hover:border-indigo-400 bg-gradient-to-b from-white to-indigo-50/20'
                        : 'border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            isSymptomAssessment
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isSymptomAssessment && <Sparkles className="h-3 w-3 text-indigo-600" />}
                          {rec.category.replace('_', ' ')}
                        </span>

                        <button
                          onClick={() => handleToggleShare(rec.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-colors ${
                            rec.sharedWithDoctor
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                          title="Toggle visibility to consulting doctors"
                        >
                          {rec.sharedWithDoctor ? (
                            <>
                              <Unlock className="h-3 w-3" /> Shared with Doctors
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3" /> Private (Hidden)
                            </>
                          )}
                        </button>
                      </div>

                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mt-2.5">
                        {rec.title}
                      </h4>

                      {/* Display Symptom Assessment Summary Pill */}
                      {isSymptomAssessment && sa && (
                        <div className="mt-2 space-y-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {sa.symptoms.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                          {sa.urgencyLevel && (
                            <span
                              className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                sa.urgencyLevel === 'EMERGENCY_NOW'
                                  ? 'bg-red-100 text-red-700'
                                  : sa.urgencyLevel === 'SAME_DAY_URGENT'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {sa.urgencyLevel.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-slate-500 mt-1">
                        {rec.fileName} • {rec.fileSize}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Recorded:{' '}
                        {new Date(rec.uploadedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>

                      {rec.doctorNotes && !isSymptomAssessment && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100 italic">
                          Notes: {rec.doctorNotes}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setPreviewingRecord(rec)}
                        className={`font-bold flex items-center gap-1 ${
                          isSymptomAssessment
                            ? 'text-indigo-600 hover:text-indigo-800'
                            : 'text-sky-600 hover:text-sky-700'
                        }`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{isSymptomAssessment ? 'View Assessment' : 'Preview Document'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Delete document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* DOCUMENT & SYMPTOM ASSESSMENT PREVIEW MODAL */}
        {/* ======================================================== */}
        {previewingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col p-6 shadow-2xl border border-slate-200 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  {previewingRecord.category === 'SYMPTOM_ASSESSMENT' ? (
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <FileText className="h-5 w-5 text-sky-600" />
                  )}
                  <span>{previewingRecord.title}</span>
                </h3>
                <button
                  onClick={() => setPreviewingRecord(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm p-1"
                >
                  ✕
                </button>
              </div>

              <div className="my-4 overflow-y-auto space-y-3.5 text-xs pr-1">
                {/* Specific Layout for Symptom Assessment Output */}
                {previewingRecord.category === 'SYMPTOM_ASSESSMENT' &&
                previewingRecord.symptomAssessment ? (
                  <div className="space-y-3">
                    {/* Header Card */}
                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-indigo-700">
                          AI Preliminary Clinical Evaluation
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            previewingRecord.symptomAssessment.urgencyLevel === 'EMERGENCY_NOW'
                              ? 'bg-red-100 text-red-700'
                              : previewingRecord.symptomAssessment.urgencyLevel === 'SAME_DAY_URGENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {previewingRecord.symptomAssessment.urgencyLevel.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-indigo-950">
                        {previewingRecord.symptomAssessment.summary}
                      </p>
                    </div>

                    {/* Evaluated Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-black block">
                          Recorded Symptoms
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {previewingRecord.symptomAssessment.symptoms.map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-slate-800"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-black block">
                          Duration & Severity
                        </span>
                        <p className="mt-1 font-bold text-slate-800">
                          {previewingRecord.symptomAssessment.duration} •{' '}
                          {previewingRecord.symptomAssessment.severity.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Dictated Notes if available */}
                    {previewingRecord.symptomAssessment.voiceDictatedNotes && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 italic text-slate-700 flex items-start gap-2">
                        <Mic className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Student Voice Remark:</strong> "
                          {previewingRecord.symptomAssessment.voiceDictatedNotes}"
                        </span>
                      </div>
                    )}

                    {/* Immediate Steps */}
                    {previewingRecord.symptomAssessment.immediateCare && (
                      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[11px] font-bold text-emerald-900 uppercase block mb-1">
                          Immediate Safe Self-Care Steps:
                        </span>
                        <ul className="space-y-1">
                          {previewingRecord.symptomAssessment.immediateCare.map((step, i) => (
                            <li key={i} className="flex items-center gap-1.5 text-emerald-950 font-medium">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommended Doctor */}
                    <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-sky-700" />
                        <span className="text-xs font-bold text-sky-950">
                          Specialist: {previewingRecord.symptomAssessment.recommendedDoctor}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                        Campus Network
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Standard Document Details Layout */
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <p>
                      <strong>File Name:</strong> {previewingRecord.fileName}
                    </p>
                    <p>
                      <strong>File Size:</strong> {previewingRecord.fileSize}
                    </p>
                    <p>
                      <strong>Category:</strong> {previewingRecord.category}
                    </p>
                    <p>
                      <strong>Recorded At:</strong>{' '}
                      {new Date(previewingRecord.uploadedAt).toLocaleString()}
                    </p>
                    {previewingRecord.doctorNotes && (
                      <p className="p-2.5 bg-sky-50 rounded-xl border border-sky-100 text-sky-900 mt-2">
                        <strong>Clinical Note:</strong> {previewingRecord.doctorNotes}
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-2 text-slate-500 italic text-[11px]">
                  🔒 Stored with cryptographic validation in student health records vault.
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {onNavigate && previewingRecord.category === 'SYMPTOM_ASSESSMENT' ? (
                  <button
                    onClick={() => {
                      setPreviewingRecord(null);
                      onNavigate('/student/appointments');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Book Appointment for this Symptom</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => setPreviewingRecord(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
              <h3 className="font-extrabold text-lg text-slate-900 mb-4">
                Add Health Document to Vault
              </h3>

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Typhoid Vaccine Card or CBC Blood Test"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Document Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="PRESCRIPTION">Prescription</option>
                    <option value="LAB_REPORT">Lab Report</option>
                    <option value="CONSULTATION_NOTE">Doctor Note</option>
                    <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                    <option value="OTHER">Other Health Document</option>
                  </select>
                </div>

                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sky-950 block">Share with Consulting Doctor</span>
                    <span className="text-[11px] text-sky-700">Allow verified physicians to review during emergencies</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sharedWithDoctor}
                    onChange={(e) => setSharedWithDoctor(e.target.checked)}
                    className="h-4 w-4 text-sky-600 rounded"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow"
                  >
                    Save to Vault
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
