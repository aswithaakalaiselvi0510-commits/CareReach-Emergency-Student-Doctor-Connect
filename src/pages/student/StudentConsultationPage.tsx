import React, { useState, useEffect, useRef } from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  HeartPulse,
  Send,
  Video,
  Phone,
  ShieldCheck,
  Paperclip,
  CheckCheck,
  Info,
  Star,
  ChevronLeft,
  Calendar,
  AlertTriangle,
  Bot
} from 'lucide-react';
import { CareGuidanceCard } from '../../components/consultation/CareGuidanceCard';
import { VideoCallModal } from '../../components/consultation/VideoCallModal';

interface Props {
  consultationId: string;
  state: AppState;
  onNavigate: (path: string) => void;
  onOpenAssistant: () => void;
}

export const StudentConsultationPage: React.FC<Props> = ({
  consultationId,
  state,
  onNavigate,
  onOpenAssistant
}) => {
  const consultation = state.consultations.find((c) => c.id === consultationId) || state.consultations[0];
  const messages = state.messages[consultation?.id || ''] || [];
  const doctor = state.doctors.find((d) => d.id === consultation?.doctorId) || state.doctors[0];
  const student = state.student;

  const [inputText, setInputText] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showStudentInfo, setShowStudentInfo] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Booking Modal for Follow-Up
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!consultation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl text-center max-w-md border border-slate-200 shadow-xl">
          <p className="text-slate-600 text-sm">Consultation not found.</p>
          <button
            onClick={() => onNavigate('/student/dashboard')}
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    CareReachStore.sendMessage(
      consultation.id,
      student.id,
      'STUDENT',
      student.name,
      inputText.trim()
    );
    setInputText('');

    // Responsive simulation: if doctor hasn't replied yet, doctor provides thoughtful clinical reply after 3s
    if (consultation.status === 'ACTIVE') {
      setTimeout(() => {
        CareReachStore.sendMessage(
          consultation.id,
          doctor.id,
          'DOCTOR',
          doctor.name,
          `Understood Arjun. I am noting down your input. I have prepared your self-care guidance instructions below. Please check if you can sip warm water or ORS slowly in your room.`
        );
      }, 3000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    CareReachStore.submitReview(consultation.id, reviewRating, reviewComment);
    setReviewSubmitted(true);
  };

  const handleBookSlot = (slot: any) => {
    CareReachStore.bookAppointment({
      studentId: student.id,
      studentName: student.name,
      studentPhone: student.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialization,
      facilityName: slot.facilityName,
      facilityAddress: slot.facilityAddress,
      type: slot.type,
      date: slot.date,
      time: slot.time,
      reason: `Post-consultation physical follow-up (${doctor.name})`,
      consultationId: consultation.id
    });
    setIsBookingModalOpen(false);
  };

  const availableSlots = state.appointmentSlots.filter(
    (s) => s.doctorId === doctor.id && !s.isBooked
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Consultation App Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/student/dashboard')}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="relative">
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="h-11 w-11 rounded-2xl object-cover ring-2 ring-teal-500/40"
              />
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                  {doctor.name}
                </h3>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 bg-teal-50 text-teal-700 border border-teal-200 rounded">
                  <ShieldCheck className="h-3 w-3" /> VERIFIED MD
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {doctor.specialization} • Distance: ~1.2 km from Hostel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Start Video Triage</span>
            </button>

            <button
              onClick={() => setShowStudentInfo(!showStudentInfo)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold"
              title="View student medical summary"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-6xl mx-auto w-full flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Stream (Left 2 Columns) */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-[680px]">
          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
            {messages.map((m) => {
              if (m.isSystem) {
                return (
                  <div key={m.id} className="flex justify-center my-3">
                    <span className="bg-sky-50 border border-sky-200 text-sky-800 text-xs px-3.5 py-1.5 rounded-full font-medium shadow-xs text-center max-w-md">
                      {m.text}
                    </span>
                  </div>
                );
              }

              const isMe = m.senderRole === 'STUDENT';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                    <span className="font-semibold text-slate-600">{m.senderName}</span>
                    <span>•</span>
                    <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isMe
                        ? 'bg-sky-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Doctor Question Prompts from AI */}
          <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px]">
            <button
              onClick={onOpenAssistant}
              className="text-sky-700 font-bold shrink-0 flex items-center gap-1 hover:underline"
            >
              <Bot className="h-3.5 w-3.5" /> AI Prompts:
            </button>
            <button
              onClick={() => setInputText('What first-aid measures can I take in my hostel room tonight?')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-sky-700 whitespace-nowrap"
            >
              "What first-aid can I do tonight?"
            </button>
            <button
              onClick={() => setInputText('Do you recommend I come to the campus clinic tomorrow morning?')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-sky-700 whitespace-nowrap"
            >
              "Should I visit the clinic tomorrow?"
            </button>
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message or answer doctor questions..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-2xl shadow active:scale-95 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Guidance, Follow-Up Booking, Review & Info */}
        <div className="space-y-6">
          {/* Care Guidance Card (if issued by doctor) */}
          {consultation.guidance ? (
            <CareGuidanceCard
              guidance={consultation.guidance}
              onBookFollowUp={() => setIsBookingModalOpen(true)}
              isFollowUpBooked={Boolean(consultation.followUpAppointmentId)}
            />
          ) : (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
                <HeartPulse className="h-6 w-6 animate-pulse" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Awaiting Doctor's Guidance
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dr. Priya is evaluating your intake responses. Once issued, your verified care plan and next-day clinic booking will appear here.
              </p>
            </div>
          )}

          {/* Student Profile Drawer / Summary */}
          {showStudentInfo && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-xs space-y-3 animate-in fade-in duration-200">
              <h4 className="font-bold text-slate-900 text-sm">Your Shared Medical Snapshot</h4>
              <div>
                <span className="text-slate-400 block font-semibold">Location:</span>
                <span className="text-slate-800">{student.hostelName}, {student.hostelRoom}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Known Allergies:</span>
                <span className="text-rose-600 font-bold">{student.medicalInfo.allergies.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Emergency Contact:</span>
                <span className="text-slate-800">{student.emergencyContact.name} ({student.emergencyContact.phone})</span>
              </div>
            </div>
          )}

          {/* Review & Rating Card (if consultation completed) */}
          {consultation.status === 'COMPLETED' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-sm">
              <h4 className="font-bold text-slate-900 text-sm">Rate Your Consultation</h4>
              {consultation.review || reviewSubmitted ? (
                <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Thank you! Your feedback helps other students on campus.</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="mt-3 space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="How clear and timely was the doctor's guidance?"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        doctorName={doctor.name}
        doctorSpecialty={doctor.specialization}
        studentName={student.name}
      />

      {/* Next-Day Follow-Up Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-sky-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Book Next-Day Clinic Follow-Up
                </h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3">
              {doctor.name} recommends a physical in-person evaluation tomorrow. Choose an available slot:
            </p>

            <div className="mt-4 space-y-2.5 max-h-60 overflow-y-auto">
              {availableSlots.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No slots currently open for tomorrow. Please visit the Campus Dispensary walk-in desk at 08:30 AM.
                </p>
              ) : (
                availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => handleBookSlot(slot)}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/60 cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{slot.facilityName}</span>
                      <p className="text-slate-500 text-[11px]">{slot.facilityAddress}</p>
                      <span className="text-[10px] text-sky-700 font-semibold mt-1 inline-block">
                        📅 {slot.date} at {slot.time} ({slot.distanceKm} km from Hostel)
                      </span>
                    </div>
                    <button className="px-3 py-1.5 bg-sky-600 text-white rounded-xl font-bold text-[11px]">
                      Select Slot
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
