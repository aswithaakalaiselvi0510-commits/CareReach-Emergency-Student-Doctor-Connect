import React, { useState } from 'react';
import { CareReachStore } from '../../services/store';
import {
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
  Award,
  ArrowRight
} from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const DoctorRegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('General Medicine & Urgent Care');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [clinicAffiliation, setClinicAffiliation] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [consultationHours, setConsultationHours] = useState('8:00 AM - 8:00 PM & On-Call');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !licenseNumber || !email) return;

    CareReachStore.registerDoctor({
      name: `Dr. ${name.replace(/^Dr\.\s*/i, '')}`,
      email,
      phone,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
      qualification,
      specialization,
      licenseNumber,
      clinicAffiliation: clinicAffiliation || 'Campus Health Network',
      clinicAddress: clinicAddress || 'University Gate 1 Medical Avenue',
      experienceYears: Number(experienceYears),
      consultationHours,
      languages: ['English', 'Hindi'],
      status: 'AVAILABLE',
      estimatedResponseTimeMinutes: 4,
      consultationTypes: ['CHAT', 'VIDEO'],
      coordinates: { lat: 12.9780, lng: 77.6010 }
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Medical Practitioner Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Register as a CareReach Verified Doctor
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Provide on-demand tele-triage to nearby hostel students during late-night hours and manage morning follow-up clinic slots.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-emerald-200 shadow-xl space-y-4 animate-in fade-in">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Application Submitted for Credentialing</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Your medical registration details ({licenseNumber}) have been placed in the Campus Medical Director's verification queue. Once verified, you will be authorized to accept student triage requests.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  CareReachStore.switchUser('ADMIN');
                  onNavigate('/admin/doctors');
                }}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold shadow hover:bg-purple-700"
              >
                Go to Admin Verification Queue →
              </button>
              <button
                onClick={() => onNavigate('/')}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Return Home
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name (with Dr. prefix) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Sundaram"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medical Council License No. *</label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. MCI-KA-2017-88231"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medical Degree & Qualifications *</label>
                <input
                  type="text"
                  required
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. MBBS, MD (Internal Medicine)"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Specialization *</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="General Medicine & Urgent Care">General Medicine & Urgent Care</option>
                  <option value="Internal Medicine & Gastroenterology">Internal Medicine & Gastroenterology</option>
                  <option value="Emergency Medicine & Trauma Care">Emergency Medicine & Trauma Care</option>
                  <option value="Adolescent & Student Health">Adolescent & Student Health</option>
                  <option value="Orthopaedics & Sports Injury">Orthopaedics & Sports Injury</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor.name@hospital.med"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Contact *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Clinic / Hospital Affiliation</label>
                <input
                  type="text"
                  value={clinicAffiliation}
                  onChange={(e) => setClinicAffiliation(e.target.value)}
                  placeholder="e.g. Campus Health Centre / Apollo Urgent Care"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Years of Clinical Experience</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <strong>Notice:</strong> All submissions are cross-referenced with National Medical Commission records. Demo accounts in this environment are simulated for evaluation purposes.
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="px-4 py-2 font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Submit for Verification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
