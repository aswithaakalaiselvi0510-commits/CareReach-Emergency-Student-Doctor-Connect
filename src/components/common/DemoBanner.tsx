import React from 'react';
import { UserRole } from '../../types';
import { CareReachStore, AppState } from '../../services/store';
import { Stethoscope, GraduationCap, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

interface Props {
  state: AppState;
  onNavigate: (path: string) => void;
}

export const DemoBanner: React.FC<Props> = ({ state, onNavigate }) => {
  const currentRole = state.currentRole;

  const handleSwitch = (role: UserRole) => {
    CareReachStore.switchUser(role);
    if (role === 'STUDENT') {
      onNavigate('/student/dashboard');
    } else if (role === 'DOCTOR') {
      onNavigate('/doctor/dashboard');
    } else {
      onNavigate('/admin/dashboard');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset CareReach demo state to initial seed data?')) {
      CareReachStore.resetDemoState();
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            <Zap className="h-3 w-3" /> DEMO MODE
          </span>
          <span className="hidden md:inline text-slate-400">
            Switch persona to test multi-role interaction (Student Request → Doctor Accept → Admin Monitor):
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleSwitch('STUDENT')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
              currentRole === 'STUDENT'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Student (Arjun)</span>
          </button>

          <button
            onClick={() => handleSwitch('DOCTOR')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
              currentRole === 'DOCTOR'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" />
            <span>Doctor (Dr. Priya)</span>
          </button>

          <button
            onClick={() => handleSwitch('ADMIN')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
              currentRole === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset to fresh seed demo data"
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors ml-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
