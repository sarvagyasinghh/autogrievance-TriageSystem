import React from 'react';
import { 
  Bell, 
  Settings, 
  AlertTriangle, 
  ShieldCheck, 
  PlusCircle, 
  Activity,
  Layers,
  BarChart3,
  Cpu
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'triage_queue' | 'war_room' | 'new_grievance' | 'analytics' | 'routing';

interface TopNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  protestTension: number;
  policeEscalatedCount: number;
  onOpenSettings: () => void;
  onOpenLogs: () => void;
  onOpenProtestModal: () => void;
  unreadCount?: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  protestTension,
  policeEscalatedCount,
  onOpenSettings,
  onOpenLogs,
  onOpenProtestModal,
  unreadCount = 3,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0A0A0A] border-b border-white/10 flex justify-between items-center px-4 md:px-10 h-20">
      <div className="flex items-center gap-6">
        {/* Brand Logo with Pulsing Red Status Dot */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-left flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)] shrink-0" />
          <div>
            <div className="font-serif italic text-xl md:text-2xl text-[#FAFAFA] tracking-tight group-hover:text-white transition-colors">
              Sentience Crisis Suite
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-mono -mt-0.5">
              AutoGrievance Triage v4.2
            </div>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 ml-4 border-l border-white/10 pl-5 h-10">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`text-[11px] uppercase tracking-[0.15em] font-mono px-3.5 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-white bg-white/10 border border-white/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('triage_queue')}
            className={`text-[11px] uppercase tracking-[0.15em] font-mono px-3.5 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'triage_queue'
                ? 'text-white bg-white/10 border border-white/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3 h-3" />
            Triage Queue
            {policeEscalatedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-red-950 text-red-400 text-[10px] rounded border border-red-900/60 font-bold">
                {policeEscalatedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('war_room')}
            className={`text-[11px] uppercase tracking-[0.15em] font-mono px-3.5 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'war_room'
                ? 'text-red-400 bg-red-950/30 border border-red-800/50'
                : 'text-red-400/80 hover:text-red-300 hover:bg-red-950/20'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-red-500" />
            Bias War Room
            <span className="px-1.5 py-0.2 bg-red-600 text-white font-bold text-[9px] rounded">
              50 ISSUES
            </span>
          </button>

          <button
            onClick={() => setActiveTab('new_grievance')}
            className={`text-[11px] uppercase tracking-[0.15em] font-mono px-3.5 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'new_grievance'
                ? 'text-white bg-white/10 border border-white/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Intake
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`text-[11px] uppercase tracking-[0.15em] font-mono px-3.5 py-1.5 rounded transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'analytics'
                ? 'text-white bg-white/10 border border-white/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            Analytics
          </button>
        </nav>
      </div>

      {/* Right Controls & Incident Metadata Header */}
      <div className="flex items-center gap-4">
        {/* Editorial Header Incident Meta */}
        <div className="hidden xl:flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-white/50 font-mono mr-2">
          <span>Incident: #SU-2024-050</span>
          <span className="text-red-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            Critical Intervention
          </span>
        </div>

        {/* Protest Tension Alert Badge */}
        <button
          onClick={onOpenProtestModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all cursor-pointer ${
            protestTension > 50
              ? 'bg-red-950/30 border-red-900/60 text-red-400 hover:bg-red-950/50'
              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
          }`}
          title="Click to view live protest status and student union dialogue"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider">
            {protestTension > 50 ? `Protest: ${protestTension}% Tension` : `Resolved (${protestTension}%)`}
          </span>
        </button>

        {/* Submit Ticket Action */}
        <button
          onClick={() => setActiveTab('new_grievance')}
          className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold uppercase tracking-widest px-3.5 py-2 rounded transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Submit Ticket
        </button>

        {/* Telemetry Logs */}
        <button
          onClick={onOpenLogs}
          className="p-2 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-all cursor-pointer"
          title="System Logs & Telemetry"
        >
          <Activity className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-all cursor-pointer"
          title="AI Model & Bias Calibration Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Admin Avatar */}
        <div className="h-8 w-8 rounded overflow-hidden border border-white/20">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHJi1SfQd78QbXIkvzKa30ppARHGzsBVHtQDEdFLowqAPEqQ8iqWUP9rl9KfkjRBiWbZu5Sr9ymRL7r6CxJRJCqNQDECAkB4mFr7T233WEufqNNQ8TYf-hY_XQ_gfHO2iUFnhwNYooNinwOgo2_ZDzdiXuSIR2Ycgq0cXt8fa3fxToiAFy0mjrhRiQ3VLPREcZJ0IhMACs9lOrh3A8TwO479LiQ_CV41zyGyqYNbcGIesg6SmRKur8"
            alt="Admin Petrov"
            className="w-full h-full object-cover grayscale contrast-125"
          />
        </div>
      </div>
    </header>
  );
};
