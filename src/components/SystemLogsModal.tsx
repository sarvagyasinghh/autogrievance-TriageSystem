import React, { useState } from 'react';
import { Activity, X, Terminal, Trash2, Filter } from 'lucide-react';

interface SystemLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: Array<{ id: string; time: string; level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL'; source: string; message: string }>;
}

export const SystemLogsModal: React.FC<SystemLogsModalProps> = ({ isOpen, onClose, logs }) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#080808] max-w-4xl w-full rounded-lg p-6 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-white/70" />
            <h2 className="font-serif italic text-lg text-[#FAFAFA]">
              System Logs & Automated Triage Telemetry
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-white/5 text-white/60 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono">
            {['ALL', 'CRITICAL', 'WARN', 'INFO'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-1 rounded cursor-pointer uppercase tracking-wider ${
                  filterLevel === lvl
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-white/50 hover:text-white bg-white/5'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-white/40">
            Showing {filteredLogs.length} events
          </span>
        </div>

        {/* Log Viewer Content */}
        <div className="flex-1 overflow-y-auto bg-[#050505] rounded p-4 border border-white/10 font-mono text-xs space-y-2">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-white/40 shrink-0">{log.time}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 uppercase tracking-wider ${
                  log.level === 'CRITICAL'
                    ? 'bg-red-600 text-white'
                    : log.level === 'WARN'
                    ? 'bg-red-950 text-red-400 border border-red-900'
                    : 'bg-white/10 text-white'
                }`}
              >
                {log.level}
              </span>
              <span className="text-white/60 shrink-0">[{log.source}]</span>
              <span
                className={`${
                  log.level === 'CRITICAL'
                    ? 'text-red-400'
                    : log.level === 'WARN'
                    ? 'text-yellow-400'
                    : 'text-white/80'
                }`}
              >
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
