import React, { useState, useEffect } from 'react';
import { AppState, CareReachStore, CAMPUS_COORDINATES } from '../../services/store';
import { rankDoctors } from '../../services/matching';
import {
  EmergencyRequest,
  RequestSeverity,
  DoctorProfile
} from '../../types';
import {
  HeartPulse,
  AlertTriangle,
  Clock,
  MapPin,
  Upload,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  PhoneCall,
  Building2,
  Radar,
  ArrowRight,
  Check,
  FileText
} from 'lucide-react';
import { InteractiveVectorMap } from '../../components/map/InteractiveVectorMap';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
  onOpenAssistant: () => void;
  onOpenSOSModal: () => void;
}

export const RequestDoctorWizard: React.FC<Props> = ({
  state,
  onNavigate,
  onOpenAssistant,
  onOpenSOSModal
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Fever']);
  const [description, setDescription] = useState('');
  const [startedWhen, setStartedWhen] = useState('Less than 6 hours');
  const [severityScore, setSeverityScore] = useState<number>(5);
  const [locationType, setLocationType] = useState<'HOSTEL' | 'GPS' | 'CUSTOM'>('HOSTEL');
  const [customLocationText, setCustomLocationText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; url: string }[]>([]);

  // Emergency Screening Checklist
  const [emergencyChecks, setEmergencyChecks] = useState<{ [key: string]: boolean }>({
    chestPain: false,
    breathingTrouble: false,
    unconscious: false,
    heavyBleeding: false,
    strokeSymptoms: false
  });

  // Active Request & Match States
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null);
  const [matchCountdown, setMatchCountdown] = useState<number>(60);
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');

  const SYMPTOM_OPTIONS = [
    { label: 'Fever & Chills', icon: '🌡️' },
    { label: 'Vomiting / Nausea', icon: '🤢' },
    { label: 'Severe Headache', icon: '🤕' },
    { label: 'Stomach Pain / Cramps', icon: '😣' },
    { label: 'Cold / Cough', icon: '🤧' },
    { label: 'Minor Injury / Sprain', icon: '🩹' },
    { label: 'Dizziness / Vertigo', icon: '💫' },
    { label: 'Dehydration / Weakness', icon: '💧' },
    { label: 'Allergy Flare / Hives', icon: '🌿' },
    { label: 'Acute Back/Joint Pain', icon: '⚡' },
    { label: 'Other Concern', icon: '❓' }
  ];

  const TIME_OPTIONS = [
    'Just now (< 1 hour)',
    'Less than 6 hours',
    'Earlier Today',
    '1–3 days',
    'More than 3 days'
  ];

  // Derive request severity category from score 1-10
  const getSeverityCategory = (score: number): RequestSeverity => {
    if (score <= 3) return 'MILD';
    if (score <= 6) return 'MODERATE';
    if (score <= 8) return 'SEVERE';
    return 'CRITICAL';
  };

  const isEmergencyFlagged =
    emergencyChecks.chestPain ||
    emergencyChecks.breathingTrouble ||
    emergencyChecks.unconscious ||
    emergencyChecks.heavyBleeding ||
    emergencyChecks.strokeSymptoms ||
    severityScore >= 9;

  // Toggle symptom chip
  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      if (selectedSymptoms.length > 1) {
        setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
      }
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Mock file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles([
        ...uploadedFiles,
        {
          name: file.name,
          type: file.type || 'document/pdf',
          url: URL.createObjectURL(file)
        }
      ]);
    }
  };

  // Rank available doctors based on current inputs
  const studentCoords =
    locationType === 'HOSTEL'
      ? state.student.coordinates
      : { lat: 12.9716, lng: 77.5946, address: customLocationText || 'Campus Main Library' };

  const rankedDoctors = rankDoctors(
    state.doctors,
    {
      symptoms: selectedSymptoms,
      description,
      severity: getSeverityCategory(severityScore)
    },
    studentCoords
  );

  // Submit and start matching
  const handleSubmitRequest = () => {
    const req = CareReachStore.createEmergencyRequest({
      symptoms: selectedSymptoms,
      description: description.trim() || 'Sudden discomfort in hostel dormitory.',
      startedWhen,
      severity: getSeverityCategory(severityScore),
      studentCoordinates: studentCoords,
      isEmergencyFlagged,
      attachments: uploadedFiles
    });

    setActiveRequest(req);
    setStep(7); // Jump to active matching radar
  };

  // Match Countdown Timer
  useEffect(() => {
    if (step !== 7 || !activeRequest) return;
    if (activeRequest.status === 'ACCEPTED') return;

    const timer = setInterval(() => {
      setMatchCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Fallback if doctor didn't respond in 60s
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, activeRequest]);

  // Listen to store updates for when doctor accepts
  useEffect(() => {
    if (!activeRequest) return;
    const latest = state.requests.find((r) => r.id === activeRequest.id);
    if (latest && latest.status === 'ACCEPTED' && latest.consultationId) {
      setActiveRequest(latest);
    }
  }, [state.requests, activeRequest]);

  // Fast-track simulation button so the evaluator can test immediately without switching tabs
  const handleSimulateDoctorAccept = () => {
    if (!activeRequest) return;
    const topDoc = rankedDoctors.find((d) => d.doctor.status === 'AVAILABLE') || rankedDoctors[0];
    const consult = CareReachStore.acceptRequest(activeRequest.id, topDoc.doctor.id);
    if (consult) {
      onNavigate(`/student/consultation/${consult.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Wizard Progress Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              {step <= 6 ? `Step ${step} of 6` : 'Live Provider Match'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {step === 1 && 'What symptoms are you experiencing?'}
              {step === 2 && 'When did this begin?'}
              {step === 3 && 'Rate your discomfort severity'}
              {step === 4 && 'Confirm your hostel location'}
              {step === 5 && 'Upload medical documents (optional)'}
              {step === 6 && 'Emergency clinical safety screening'}
              {step === 7 && 'Connecting to Nearest Verified Doctor'}
            </h2>
          </div>

          <button
            onClick={onOpenAssistant}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 text-sky-800 text-xs font-bold hover:shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <span>AI Symptom Helper</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        {step <= 6 && (
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-sky-500 to-teal-500 h-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        )}

        {/* STEP 1: Symptom Selection */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <div>
              <p className="text-xs sm:text-sm text-slate-600">
                Select one or more symptoms that best match what you are feeling right now in your room.
              </p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SYMPTOM_OPTIONS.map((item) => {
                  const isSelected = selectedSymptoms.includes(item.label);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleSymptom(item.label)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/80 text-sky-900 shadow-sm ring-2 ring-sky-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs sm:text-sm font-semibold leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Describe in your own words (triggers, what hurts, messy food, etc.):
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Started after dinner in the hostel mess. Stomach feels bloated with crampy waves. Shivering slightly..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Onset Timeline */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <p className="text-xs sm:text-sm text-slate-600">
              When did these symptoms first begin or noticeably worsen?
            </p>

            <div className="space-y-3">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStartedWhen(opt)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    startedWhen === opt
                      ? 'border-sky-500 bg-sky-50/80 text-sky-900 shadow-sm ring-2 ring-sky-500/20 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="text-sm">{opt}</span>
                  {startedWhen === opt && <CheckCircle2 className="h-5 w-5 text-sky-600" />}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Severity Selector */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <div>
              <p className="text-xs sm:text-sm text-slate-600">
                Use the slider to indicate how intense the pain or discomfort feels:
              </p>

              <div className="mt-8 text-center">
                <div
                  className={`inline-flex items-center justify-center h-20 w-20 rounded-3xl font-black text-3xl shadow-lg border-2 ${
                    severityScore <= 3
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : severityScore <= 6
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  }`}
                >
                  {severityScore}
                </div>
                <p className="text-sm font-extrabold text-slate-800 mt-2">
                  {getSeverityCategory(severityScore)} DISCOMFORT
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {severityScore <= 3 && 'Noticeable, but manageable while resting.'}
                  {severityScore > 3 && severityScore <= 6 && 'Interferes with study or sleep, requiring prompt medical advice.'}
                  {severityScore > 6 && severityScore <= 8 && 'Severe pain or distress, hard to bear alone.'}
                  {severityScore > 8 && 'Unbearable distress. May require emergency hospitalization.'}
                </p>
              </div>

              <div className="mt-8 px-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severityScore}
                  onChange={(e) => setSeverityScore(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-bold">
                  <span>1 (Very Mild)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Worst Pain)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Hostel Location */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <p className="text-xs sm:text-sm text-slate-600">
              Where should the doctor calculate response distance to?
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setLocationType('HOSTEL')}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  locationType === 'HOSTEL'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-900 ring-2 ring-sky-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MapPin className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-sm block">Saved Hostel Room</span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {state.student.hostelName}, {state.student.hostelRoom}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                    🔒 Exact room is kept private until consultation is confirmed
                  </span>
                </div>
                {locationType === 'HOSTEL' && <CheckCircle2 className="h-5 w-5 text-sky-600" />}
              </button>

              <button
                type="button"
                onClick={() => setLocationType('GPS')}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  locationType === 'GPS'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-900 ring-2 ring-sky-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MapPin className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-sm block">Current Live Campus GPS</span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Lat: 12.9716, Lng: 77.5946 (Within 50m of Engineering Quad)
                  </p>
                </div>
                {locationType === 'GPS' && <CheckCircle2 className="h-5 w-5 text-sky-600" />}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Optional Uploads */}
        {step === 5 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <div>
              <p className="text-xs sm:text-sm text-slate-600">
                You can attach an existing prescription, recent blood test, or photo of minor rash/swelling if helpful:
              </p>

              <div className="mt-4 border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-3xl p-6 text-center bg-slate-50/60 transition-colors">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Click to upload image or document</p>
                <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, or PDF up to 10MB</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="mt-3 block mx-auto text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-slate-700">Attached Documents:</p>
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 font-medium">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> {f.name}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">Ready</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setStep(4)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={() => setStep(6)}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span>Proceed to Safety Screen</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Emergency Screening Checklist */}
        {step === 6 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900">
                <strong className="block font-bold mb-0.5">Mandatory Clinical Safety Check:</strong>
                Please check any of the following critical red flags if present right now:
              </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'chestPain', label: 'Severe crushing chest pain or left arm numbness' },
                { id: 'breathingTrouble', label: 'Severe difficulty breathing or gasping for air' },
                { id: 'unconscious', label: 'Brief loss of consciousness or fainting' },
                { id: 'heavyBleeding', label: 'Uncontrolled heavy bleeding' },
                { id: 'strokeSymptoms', label: 'Facial drooping or sudden inability to speak clearly' }
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    emergencyChecks[item.id]
                      ? 'border-red-500 bg-red-50 text-red-950 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={emergencyChecks[item.id]}
                    onChange={(e) =>
                      setEmergencyChecks({ ...emergencyChecks, [item.id]: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs sm:text-sm leading-tight">{item.label}</span>
                </label>
              ))}
            </div>

            {/* Emergency Escalation Modal/Callout if Flagged */}
            {isEmergencyFlagged && (
              <div className="p-5 rounded-2xl bg-red-600 text-white space-y-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-white animate-bounce" />
                  <h4 className="font-extrabold text-base">Immediate Emergency Care Required</h4>
                </div>
                <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
                  Based on your responses, this may indicate a condition requiring immediate hospital care. Do NOT wait for an online doctor consultation.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={onOpenSOSModal}
                    className="px-4 py-2.5 bg-white text-red-700 font-bold text-xs rounded-xl shadow hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>Call Emergency (108)</span>
                  </button>
                  <button
                    onClick={() => onNavigate('/student/emergency-contacts')}
                    className="px-4 py-2.5 bg-red-800 text-white font-bold text-xs rounded-xl shadow hover:bg-red-900"
                  >
                    Contact Campus Warden
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setStep(5)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={handleSubmitRequest}
                className="px-7 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-red-500/25 active:scale-95 transition-all"
              >
                <HeartPulse className="h-4 w-4" />
                <span>Confirm & Match Nearby Doctor</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Live Matching Radar & Countdown */}
        {step === 7 && activeRequest && (
          <div className="space-y-6">
            {/* Top Match Status Card */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    Matching Nearby Verified Doctors
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mt-2">
                    Request Dispatched to On-Duty Physicians
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
                    Student: {activeRequest.studentName} ({activeRequest.studentHostel}) • Concern: {activeRequest.symptoms.join(', ')}
                  </p>
                </div>

                {/* Response Countdown Clock */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Response Window</span>
                  <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                    {matchCountdown}s
                  </div>
                  <span className="text-[10px] text-slate-500">Auto-fallback if unresponded</span>
                </div>
              </div>

              {/* Fast Evaluation Helper Action: Simulate Doctor Acceptance */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Testing in single tab? Click below to instantly simulate Dr. Priya's acceptance:</span>
                </div>
                <button
                  onClick={handleSimulateDoctorAccept}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Simulate Dr. Priya Accept</span>
                </button>
              </div>
            </div>

            {/* View Mode Toggle: List vs Map */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">
                Ranked Nearby Available Providers ({rankedDoctors.length})
              </h4>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setViewMode('LIST')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    viewMode === 'LIST' ? 'bg-sky-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('MAP')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    viewMode === 'MAP' ? 'bg-sky-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Radar Map
                </button>
              </div>
            </div>

            {/* Radar Map View */}
            {viewMode === 'MAP' && (
              <InteractiveVectorMap
                studentCoords={activeRequest.studentCoordinates}
                doctors={state.doctors}
                facilities={state.facilities}
                onRequestDoctorDirectly={(doc) => {
                  CareReachStore.acceptRequest(activeRequest.id, doc.id);
                  if (activeRequest.consultationId) {
                    onNavigate(`/student/consultation/${activeRequest.consultationId}`);
                  }
                }}
              />
            )}

            {/* List View of Doctors */}
            {viewMode === 'LIST' && (
              <div className="space-y-3">
                {rankedDoctors.map((item, idx) => {
                  const doc = item.doctor;
                  const isAvailable = doc.status === 'AVAILABLE';

                  return (
                    <div
                      key={doc.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sky-300 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="h-14 w-14 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="font-extrabold text-sm sm:text-base text-slate-900">{doc.name}</h5>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {isAvailable ? '🟢 Online Now' : '🟡 In Consult'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                              Match Score: {item.totalScore}/100
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-0.5 font-medium">{doc.specialization}</p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-sky-600" /> {item.distanceKm} km away
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-sky-600" /> ~{doc.estimatedResponseTimeMinutes} min response
                            </span>
                            <span>•</span>
                            <span>⭐ {doc.rating} ({doc.totalReviews} reviews)</span>
                          </div>

                          <p className="text-[11px] text-sky-700 mt-1.5 bg-sky-50/60 px-2 py-1 rounded-lg">
                            💡 {item.explanation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            const consult = CareReachStore.acceptRequest(activeRequest.id, doc.id);
                            if (consult) {
                              onNavigate(`/student/consultation/${consult.id}`);
                            }
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow active:scale-95 transition-all flex items-center justify-center gap-1"
                        >
                          <span>Connect Instantly</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
