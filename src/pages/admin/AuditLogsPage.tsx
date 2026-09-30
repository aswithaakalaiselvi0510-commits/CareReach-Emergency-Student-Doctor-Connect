import React, { useState } from 'react';
import { AppState } from '../../services/store';
import {
  FileText,
  Search,
  Filter,
  Shield,
  Clock,
  AlertTriangle,
  User,
  Database
} from 'lucide-react';

interface Props {
  state: AppState;
}

export const AuditLogsPage: React.FC<Props> = ({ state }) => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'CRITICAL'>('ALL');

  const logs = state.auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase());
    const matchesSev = severityFilter === 'ALL' || log.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              HIPAA & Campus Regulatory Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              System Audit Trail & Access Logs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Cryptographically timestamped audit trail of sensitive patient record access, physician license decisions, and triage dispatches.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            {['ALL', 'INFO', 'WARN', 'CRITICAL'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev as any)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  severityFilter === sev
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit actions, user names, or descriptions..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No audit events matched your search query.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          log.severity === 'CRITICAL'
                            ? 'bg-red-100 text-red-700'
                            : log.severity === 'WARN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {log.severity}
                      </span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                        {log.action}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">{log.details}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>User: {log.userName} ({log.userRole})</span>
                      <span>•</span>
                      <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-[11px] text-slate-400 shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
