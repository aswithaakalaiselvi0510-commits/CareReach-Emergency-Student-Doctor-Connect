import React from 'react';
import { CareGuidance } from '../../types';
import {
  FileCheck2,
  AlertTriangle,
  HeartPulse,
  Calendar,
  ShieldCheck,
  Download,
  Share2
} from 'lucide-react';

interface Props {
  guidance: CareGuidance;
  onBookFollowUp?: () => void;
  isFollowUpBooked?: boolean;
}

export const CareGuidanceCard: React.FC<Props> = ({
  guidance,
  onBookFollowUp,
  isFollowUpBooked = false
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-sky-100 overflow-hidden relative">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
            <FileCheck2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base text-slate-900">
                Official Clinical Care Guidance
              </h4>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" /> Doctor Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Issued by {guidance.doctorName} (License: {guidance.doctorLicense})
            </p>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-400">
          Issued on: {new Date(guidance.createdAt).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Main Sections */}
      <div className="mt-5 space-y-4 text-sm">
        {/* Immediate Guidance */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
          <h5 className="font-bold text-sky-900 flex items-center gap-2 text-xs uppercase tracking-wide">
            <HeartPulse className="h-4 w-4 text-sky-600" />
            Immediate Action Required Tonight
          </h5>
          <p className="mt-1.5 text-slate-700 leading-relaxed font-medium">
            {guidance.immediateGuidance}
          </p>
        </div>

        {/* Self-Care & First-Aid */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <h5 className="font-bold text-emerald-900 flex items-center gap-2 text-xs uppercase tracking-wide">
            <HeartPulse className="h-4 w-4 text-emerald-600" />
            Hostel Self-Care & Hydration Protocol
          </h5>
          <p className="mt-1.5 text-slate-700 leading-relaxed">
            {guidance.selfCareInstructions}
          </p>
        </div>

        {/* Warning Signs */}
        {guidance.warningSigns && guidance.warningSigns.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <h5 className="font-bold text-rose-900 flex items-center gap-2 text-xs uppercase tracking-wide">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              Red-Flag Warning Signs (Seek Hospital Emergency Immediately If Noticed)
            </h5>
            <ul className="mt-2 space-y-1">
              {guidance.warningSigns.map((sign, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-rose-800 font-medium">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Follow-up Section */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 px-2 py-0.5 rounded bg-amber-100">
              Next-Day Clinical Follow-up
            </span>
            <h5 className="font-bold text-slate-900 text-sm mt-1">
              {guidance.followUpRecommended
                ? 'Follow-up In-Person Clinic Visit Strongly Recommended'
                : 'Routine Follow-up (Not urgently needed unless symptoms persist)'}
            </h5>
            {guidance.followUpReason && (
              <p className="text-xs text-slate-600 mt-0.5">{guidance.followUpReason}</p>
            )}
          </div>

          {guidance.followUpRecommended && onBookFollowUp && (
            <button
              onClick={onBookFollowUp}
              disabled={isFollowUpBooked}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0 ${
                isFollowUpBooked
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white active:scale-95'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>{isFollowUpBooked ? 'Appointment Confirmed' : 'Book Next-Day Slot'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <span>CareReach Verified Clinical Record</span>
        <span>Permanently saved to your Health Records Vault</span>
      </div>
    </div>
  );
};
