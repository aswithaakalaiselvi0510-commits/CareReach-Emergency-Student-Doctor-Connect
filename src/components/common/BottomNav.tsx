import React from 'react';
import { UserRole } from '../../types';
import {
  Home,
  PlusCircle,
  Stethoscope,
  Calendar,
  FileText,
  Inbox,
  ShieldCheck,
  User
} from 'lucide-react';

interface Props {
  currentRole: UserRole;
  currentPath: string;
  onNavigate: (path: string) => void;
  pendingRequestsCount?: number;
}

export const BottomNav: React.FC<Props> = ({
  currentRole,
  currentPath,
  onNavigate,
  pendingRequestsCount = 0
}) => {
  if (currentRole === 'STUDENT') {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onNavigate('/student/dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            currentPath === '/student/dashboard' || currentPath === '/'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('/student/request-doctor')}
          className="flex flex-col items-center py-1 px-3 -mt-4 bg-red-600 text-white rounded-full shadow-lg shadow-red-600/30 font-bold text-[10px] active:scale-95 transition-transform"
        >
          <PlusCircle className="h-6 w-6 mb-0.5" />
          <span>Request</span>
        </button>

        <button
          onClick={() => onNavigate('/student/doctors')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            currentPath.includes('/student/doctors')
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Stethoscope className="h-5 w-5 mb-0.5" />
          <span>Doctors</span>
        </button>

        <button
          onClick={() => onNavigate('/student/appointments')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            currentPath.includes('/student/appointments')
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="h-5 w-5 mb-0.5" />
          <span>Visits</span>
        </button>

        <button
          onClick={() => onNavigate('/student/profile')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            currentPath.includes('/student/profile')
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="h-5 w-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    );
  }

  if (currentRole === 'DOCTOR') {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onNavigate('/doctor/dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            currentPath.includes('/doctor/dashboard') ? 'text-teal-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span>Hub</span>
        </button>

        <button
          onClick={() => onNavigate('/doctor/requests')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium relative ${
            currentPath.includes('/doctor/requests') ? 'text-teal-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Inbox className="h-5 w-5 mb-0.5" />
          {pendingRequestsCount > 0 && (
            <span className="absolute top-0 right-1 h-3.5 w-3.5 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
              {pendingRequestsCount}
            </span>
          )}
          <span>Requests</span>
        </button>

        <button
          onClick={() => onNavigate('/doctor/appointments')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            currentPath.includes('/doctor/appointments') ? 'text-teal-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Calendar className="h-5 w-5 mb-0.5" />
          <span>Follow-ups</span>
        </button>

        <button
          onClick={() => onNavigate('/doctor/profile')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            currentPath.includes('/doctor/profile') ? 'text-teal-600 font-bold' : 'text-slate-500'
          }`}
        >
          <User className="h-5 w-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    );
  }

  // Admin Bottom Nav
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onNavigate('/admin/dashboard')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
          currentPath === '/admin/dashboard' ? 'text-purple-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Home className="h-5 w-5 mb-0.5" />
        <span>Metrics</span>
      </button>

      <button
        onClick={() => onNavigate('/admin/doctors')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
          currentPath.includes('/admin/doctors') ? 'text-purple-600 font-bold' : 'text-slate-500'
        }`}
      >
        <ShieldCheck className="h-5 w-5 mb-0.5" />
        <span>Doctors</span>
      </button>

      <button
        onClick={() => onNavigate('/admin/requests')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
          currentPath.includes('/admin/requests') ? 'text-purple-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Inbox className="h-5 w-5 mb-0.5" />
        <span>Requests</span>
      </button>

      <button
        onClick={() => onNavigate('/admin/audit-logs')}
        className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
          currentPath.includes('/admin/audit-logs') ? 'text-purple-600 font-bold' : 'text-slate-500'
        }`}
      >
        <FileText className="h-5 w-5 mb-0.5" />
        <span>Audit</span>
      </button>
    </div>
  );
};
