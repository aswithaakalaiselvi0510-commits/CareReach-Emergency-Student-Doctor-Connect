import React, { useState } from 'react';
import { CareReachStore, AppState } from '../../services/store';
import {
  HeartPulse,
  GraduationCap,
  Stethoscope,
  ShieldCheck,
  Lock,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../../types';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<Props> = ({ state, onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');

  const handleQuickLogin = (role: UserRole) => {
    CareReachStore.switchUser(role);
    if (role === 'STUDENT') onNavigate('/student/dashboard');
    else if (role === 'DOCTOR') onNavigate('/doctor/dashboard');
    else onNavigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-500/20">
            <HeartPulse className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">CareReach Portal Login</h2>
          <p className="text-xs text-slate-500">
            Select a verified persona or log in to your campus account
          </p>
        </div>

        {/* Quick Demo Selector */}
        <div className="space-y-3">
          <button
            onClick={() => handleQuickLogin('STUDENT')}
            className="w-full p-4 rounded-2xl border-2 border-sky-100 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-600 text-white group-hover:scale-105 transition-transform">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">Student Account</span>
                <span className="text-xs text-slate-500">Arjun Sharma (Hostel 4B, Room 204)</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleQuickLogin('DOCTOR')}
            className="w-full p-4 rounded-2xl border-2 border-teal-100 hover:border-teal-500 bg-teal-50/50 hover:bg-teal-50 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-600 text-white group-hover:scale-105 transition-transform">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">Doctor Account</span>
                <span className="text-xs text-slate-500">Dr. Priya Venkatesh, MD (On-Duty)</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleQuickLogin('ADMIN')}
            className="w-full p-4 rounded-2xl border-2 border-purple-100 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-600 text-white group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">Campus Medical Director</span>
                <span className="text-xs text-slate-500">Administration & Audit Console</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="pt-2 text-center text-xs text-slate-400">
          <span>Are you a medical doctor? </span>
          <button
            onClick={() => onNavigate('/doctor-register')}
            className="text-teal-700 font-bold hover:underline"
          >
            Submit credentials
          </button>
        </div>
      </div>
    </div>
  );
};
