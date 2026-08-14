import React from 'react';
import { 
  Layers, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Grievance, BiasModelConfig } from '../types';

interface TriageDashboardViewProps {
  grievances: Grievance[];
  biasConfig: BiasModelConfig;
  onSelectGrievance: (g: Grievance) => void;
  onNavigateTab: (tab: any) => void;
  onRecallPoliceBatch: () => void;
}

export const TriageDashboardView: React.FC<TriageDashboardViewProps> = ({
  grievances,
  biasConfig,
  onSelectGrievance,
  onNavigateTab,
  onRecallPoliceBatch,
}) => {
  const total = grievances.length;
  const pending = grievances.filter((g) => g.status === 'Pending Review').length;
  const highUrgency = grievances.filter((g) => g.urgencyScore >= 85).length;
  const policeEscalated = grievances.filter((g) => g.status === 'Escalated to Police').length;
  const resolved = grievances.filter((g) => g.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Automated Intake Active
            </span>
            <span className="text-[11px] text-white/40 font-mono uppercase tracking-wider">
              Engine: {biasConfig.activeDebiasingMode === 'legacy_uncalibrated' ? 'Legacy (Biased)' : 'Neural Fairness v2'}
            </span>
          </div>

          <h1 className="font-serif italic font-normal text-3xl md:text-5xl text-[#FAFAFA] tracking-tight">
            AI Grievance Triage Portal
          </h1>
          <p className="text-sm text-white/60 mt-1.5 max-w-2xl leading-relaxed font-sans">
            Real-time algorithmic intake, urgency weighting, and campus police mitigation telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('war_room')}
            className="px-3.5 py-2.5 rounded bg-red-950/40 border border-red-900/60 text-red-400 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-red-950/70 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            Bias War Room
          </button>
          <button
            onClick={() => onNavigateTab('new_grievance')}
            className="px-4 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-widest font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center gap-1.5"
          >
            Submit Grievance
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bento Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Intake */}
        <div className="bg-[#080808] border border-white/10 rounded-lg p-6 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Total Intake
            </span>
            <Layers className="w-4 h-4 text-white/40" />
          </div>

          <div className="font-serif italic text-4xl md:text-5xl text-[#FAFAFA] tracking-tight">
            {total}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-white/50">
            <TrendingUp className="w-3.5 h-3.5 text-red-400" />
            <span>+12% since last hour</span>
          </div>
        </div>

        {/* Card 2: Pending Processing */}
        <div className="bg-[#080808] border border-white/10 rounded-lg p-6 relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Pending Review
            </span>
            <Clock className="w-4 h-4 text-white/40" />
          </div>

          <div className="font-serif italic text-4xl md:text-5xl text-[#FAFAFA] tracking-tight">
            {pending}
          </div>

          <div className="mt-3 text-[11px] font-mono text-white/50">
            Avg wait: <strong className="text-white/80">4m 12s</strong>
          </div>
        </div>

        {/* Card 3: High Urgency Items */}
        <div className="bg-[#080808] border border-red-900/60 rounded-lg p-6 relative overflow-hidden group hover:border-red-800 transition-all">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              High Urgency Index
            </span>
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
          </div>

          <div className="font-serif italic text-4xl md:text-5xl text-red-500 tracking-tight">
            {highUrgency}
          </div>

          <div className="mt-3 text-[11px] font-mono text-red-400/80">
            Immediate routing queue
          </div>
        </div>

        {/* Card 4: Police Escalated / Bias Cascade Alert */}
        <div
          className={`rounded-lg p-6 relative overflow-hidden transition-all border ${
            policeEscalated > 0
              ? 'border-red-600/60 bg-red-950/20'
              : 'border-white/10 bg-[#080808]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400">
              Police Escalated
            </span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>

          <div className="font-serif italic text-4xl md:text-5xl text-red-400 tracking-tight">
            {policeEscalated}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
              {policeEscalated > 0 ? '50 Minorities Tagged' : '50 Recalled & Safe'}
            </span>
            {policeEscalated > 0 && (
              <button
                onClick={onRecallPoliceBatch}
                className="text-[10px] font-mono uppercase tracking-widest font-bold text-red-400 underline hover:text-white cursor-pointer"
              >
                Recall 50
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Section: Quick Triage Stream & Dept Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Triage Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <h2 className="font-serif italic text-xl text-[#FAFAFA]">
                Incoming Grievance Stream
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('triage_queue')}
              className="text-[11px] font-mono uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              View Full Queue ({total})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grievance Stream Cards */}
          <div className="space-y-3">
            {grievances.slice(0, 6).map((g) => {
              const isPolice = g.status === 'Escalated to Police';
              return (
                <div
                  key={g.id}
                  onClick={() => onSelectGrievance(g)}
                  className={`bg-[#080808] rounded-lg p-5 border transition-all cursor-pointer hover:border-white/30 ${
                    isPolice
                      ? 'border-red-900/60 hover:border-red-600 bg-red-950/10'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                        {g.id}
                      </span>
                      <h3 className="font-serif text-base text-[#FAFAFA] hover:text-white transition-colors">
                        {g.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${
                          g.urgencyScore >= 85
                            ? 'bg-red-950/40 text-red-400 border border-red-900/60'
                            : 'bg-white/5 text-white/70 border border-white/10'
                        }`}
                      >
                        Urgency: {g.urgencyScore}
                      </span>
                      <span className="text-white/40 text-[10px]">{g.submittedAt.split('•')[1] || g.submittedAt}</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 mt-2.5 line-clamp-2 leading-relaxed font-sans">
                    {g.description}
                  </p>

                  <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {g.department}
                      </span>
                      {g.studentGroup && (
                        <span className="text-white/70 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                          {g.studentGroup}
                        </span>
                      )}
                      {g.isMisclassifiedBias && (
                        <span className="text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/60 font-bold uppercase text-[9px] tracking-wider">
                          ⚠️ False Threat
                        </span>
                      )}
                    </div>

                    <span className="text-white/70 flex items-center gap-1 group-hover:text-white uppercase tracking-wider text-[10px]">
                      Inspect Ticket
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Rail: Department Distribution & Model Health (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Department Breakdown */}
          <div className="bg-[#080808] border border-white/10 rounded-lg p-6">
            <h3 className="font-serif italic text-lg text-[#FAFAFA] mb-4 flex items-center justify-between">
              <span>Department Routing Ratio</span>
              <Building2 className="w-4 h-4 text-white/40" />
            </h3>

            <div className="space-y-3.5 text-xs font-mono">
              {[
                { name: 'Academic Affairs & Title IX', pct: 34, color: 'bg-white/80' },
                { name: 'Facilities & Campus Planning', pct: 28, color: 'bg-white/60' },
                { name: 'Dining Services', pct: 18, color: 'bg-white/40' },
                { name: 'Student Life / SGA', pct: 12, color: 'bg-white/20' },
                { name: 'Campus Police (Auto-Escalated)', pct: policeEscalated > 0 ? 8 : 0, color: 'bg-red-600' },
              ].map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-white/50 mb-1">
                    <span className="truncate pr-2">{d.name}</span>
                    <span className="text-white font-bold">{d.pct}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithmic Bias Health Card */}
          <div className="bg-[#080808] border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3.5">
              <Cpu className="w-4 h-4 text-red-500" />
              <h3 className="font-serif italic text-lg text-[#FAFAFA]">
                AI Model Ethics Status
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-white/50 font-mono text-[11px] uppercase tracking-wider">Active Filter:</span>
                <span className="font-mono font-bold text-white text-[11px]">
                  {biasConfig.activeDebiasingMode === 'legacy_uncalibrated' ? 'Legacy (Biased)' : 'Neural Fairness'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-white/50 font-mono text-[11px] uppercase tracking-wider">Disparity Ratio:</span>
                <span className={`font-mono font-bold text-[11px] ${biasConfig.activeDebiasingMode === 'legacy_uncalibrated' ? 'text-red-400' : 'text-white'}`}>
                  {biasConfig.activeDebiasingMode === 'legacy_uncalibrated' ? '4.8x (Critical Disparity)' : '1.02x (Balanced)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white/5 border border-white/10">
                <span className="text-white/50 font-mono text-[11px] uppercase tracking-wider">Ombudsman Circuit:</span>
                <span className="font-mono font-bold text-white/90 text-[11px]">
                  {biasConfig.humanInTheLoopCircuitBreaker ? 'Enforced' : 'Bypassed'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('war_room')}
              className="w-full mt-4 py-2.5 rounded bg-white/5 border border-white/20 text-white/90 text-[10px] font-mono uppercase tracking-widest font-bold hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Open Model Calibration Lab
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
