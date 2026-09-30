import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Activity,
  Heart
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  doctorSpecialty: string;
  studentName: string;
}

export const VideoCallModal: React.FC<Props> = ({
  isOpen,
  onClose,
  doctorName,
  doctorSpecialty,
  studentName
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      return;
    }
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-4">
      <div className="bg-slate-900 rounded-3xl w-full max-w-4xl h-[640px] max-h-[95vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden relative">
        {/* Top Info Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-slate-950/80 to-transparent flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                Tele-Triage Video Session: {doctorName}
                <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Encrypted WebRTC
                </span>
              </h4>
              <p className="text-xs text-slate-400">{doctorSpecialty} • Student: {studentName}</p>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-400">
            {formatDuration(callDuration)}
          </div>
        </div>

        {/* Video Simulation Feeds */}
        <div className="flex-1 relative flex items-center justify-center bg-slate-950">
          {/* Doctor simulated video feed */}
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80"
              alt="Doctor stream"
              className="w-full h-full object-cover filter brightness-95"
            />
            {/* Live Audio Waves overlay */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700/60">
              <span className="text-xs font-semibold text-white">{doctorName}</span>
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce delay-100 h-4" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce delay-200 h-3" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce delay-300 h-1" />
              </div>
            </div>
          </div>

          {/* Student self-camera PiP window */}
          <div className="absolute top-20 right-4 sm:right-6 w-32 sm:w-44 h-44 sm:h-56 bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl z-20">
            {isVideoOff ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center text-xs">
                <VideoOff className="h-6 w-6 mb-1 text-slate-500" />
                <span>Camera Paused</span>
              </div>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
                alt="Student camera"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-2 left-2 bg-slate-950/80 text-[10px] text-white px-2 py-0.5 rounded font-medium">
              You {isMuted && '(Muted)'}
            </div>
          </div>
        </div>

        {/* Call Controls Floating Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4 z-20">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full transition-all ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3.5 rounded-full transition-all ${
              isVideoOff
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title={isVideoOff ? 'Enable camera' : 'Disable camera'}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all text-sm"
          >
            <PhoneOff className="h-5 w-5" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
