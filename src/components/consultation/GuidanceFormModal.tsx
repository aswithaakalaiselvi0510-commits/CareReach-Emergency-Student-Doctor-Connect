import React, { useState } from 'react';
import {
  FileCheck2,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    immediateGuidance: string;
    selfCareInstructions: string;
    warningSigns: string[];
    followUpRecommended: boolean;
    followUpReason?: string;
    doctorPrivateNotes?: string;
    studentSummary: string;
  }) => void;
  studentName: string;
  symptoms: string[];
}

export const GuidanceFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  studentName,
  symptoms
}) => {
  const [immediateGuidance, setImmediateGuidance] = useState(
    'Keep hydrated with small sips of ORS or warm water. Rest with head elevated. Avoid heavy or oily mess food.'
  );
  const [selfCareInstructions, setSelfCareInstructions] = useState(
    'Monitor temperature every 3-4 hours if thermometer is available. Apply damp cloth to forehead if feeling feverish. Get at least 8 hours of sleep.'
  );
  const [warningSigns, setWarningSigns] = useState<string[]>([
    'Temperature exceeding 102.5°F not responding to antipyretics',
    'Severe vomiting preventing any fluid retention for > 8 hours',
    'Stiff neck, disorientation, or breathing difficulty'
  ]);
  const [newWarningSign, setNewWarningSign] = useState('');
  const [followUpRecommended, setFollowUpRecommended] = useState(true);
  const [followUpReason, setFollowUpReason] = useState(
    'Next-day physical evaluation at Campus Health Centre to review abdominal tenderness and dehydration status.'
  );
  const [doctorPrivateNotes, setDoctorPrivateNotes] = useState(
    'Student exhibits acute mild gastroenteritis. No signs of acute abdomen or appendicitis. Follow-up physical palpation recommended.'
  );
  const [studentSummary, setStudentSummary] = useState(
    'Doctor reviewed symptoms and advised hydration + rest protocol. Booked for morning follow-up at the Campus clinic.'
  );

  if (!isOpen) return null;

  const handleAddWarning = () => {
    if (!newWarningSign.trim()) return;
    setWarningSigns([...warningSigns, newWarningSign.trim()]);
    setNewWarningSign('');
  };

  const handleRemoveWarning = (index: number) => {
    setWarningSigns(warningSigns.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      immediateGuidance,
      selfCareInstructions,
      warningSigns,
      followUpRecommended,
      followUpReason,
      doctorPrivateNotes,
      studentSummary
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <FileCheck2 className="h-6 w-6 text-teal-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Issue Verified Clinical Care Guidance</h3>
              <p className="text-xs text-teal-200">
                Patient: <span className="font-bold text-white">{studentName}</span> • Symptoms: {symptoms.join(', ') || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-slate-700">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              1. Immediate Self-Care & First-Aid Tonight *
            </label>
            <textarea
              required
              rows={2}
              value={immediateGuidance}
              onChange={(e) => setImmediateGuidance(e.target.value)}
              placeholder="e.g. Bed rest, elevation of limb, hydration..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              2. Hostel Protocol & Recovery Instructions *
            </label>
            <textarea
              required
              rows={2}
              value={selfCareInstructions}
              onChange={(e) => setSelfCareInstructions(e.target.value)}
              placeholder="Detailed self-care steps for student in dormitory..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs sm:text-sm"
            />
          </div>

          {/* Warning signs checklist */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-700 mb-1.5">
              3. Red-Flag Warning Signs to Watch For
            </label>
            <div className="space-y-2 mb-2">
              {warningSigns.map((sign, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                  <span className="font-medium">• {sign}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWarning(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newWarningSign}
                onChange={(e) => setNewWarningSign(e.target.value)}
                placeholder="Add custom warning sign..."
                className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddWarning}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Follow-up Required Toggle */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-amber-900">
                  Next-Day Follow-up In-Person Visit
                </h5>
                <p className="text-xs text-amber-700 mt-0.5">
                  Does this student require a clinic or hospital visit tomorrow?
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFollowUpRecommended(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    followUpRecommended ? 'bg-amber-600 text-white shadow' : 'bg-white text-slate-600 border'
                  }`}
                >
                  YES (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => setFollowUpRecommended(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !followUpRecommended ? 'bg-slate-700 text-white shadow' : 'bg-white text-slate-600 border'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            {followUpRecommended && (
              <div>
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Reason & Clinic Recommendation:
                </label>
                <input
                  type="text"
                  value={followUpReason}
                  onChange={(e) => setFollowUpReason(e.target.value)}
                  placeholder="e.g. Morning palpation check at Campus Health Centre"
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs text-slate-800"
                />
              </div>
            )}
          </div>

          {/* Doctor Private Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Doctor's Internal Clinical Notes (Confidential)
            </label>
            <textarea
              rows={2}
              value={doctorPrivateNotes}
              onChange={(e) => setDoctorPrivateNotes(e.target.value)}
              placeholder="Clinical differential, vitals, examination remarks..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
            />
          </div>

          {/* Student Visible Summary */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              Student-Visible Summary (Sent to Patient & Vault) *
            </label>
            <textarea
              required
              rows={2}
              value={studentSummary}
              onChange={(e) => setStudentSummary(e.target.value)}
              placeholder="Summary of tonight's consultation for student's record..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Sign & Issue Guidance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
