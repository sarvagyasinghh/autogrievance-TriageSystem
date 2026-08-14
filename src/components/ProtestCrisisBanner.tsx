import React from 'react';
import { AlertTriangle, ShieldAlert, Users, Undo2, ArrowRight, CheckCircle2, Megaphone } from 'lucide-react';
import { Grievance } from '../types';

interface ProtestCrisisBannerProps {
  grievances: Grievance[];
  protestTension: number;
  onOpenWarRoom: () => void;
  onBatchRecall: () => void;
  onOpenDialogue: () => void;
}

export const ProtestCrisisBanner: React.FC<ProtestCrisisBannerProps> = ({
  grievances,
  protestTension,
  onOpenWarRoom,
  onBatchRecall,
  onOpenDialogue,
}) => {
  const policeEscalated = grievances.filter(
    (g) => g.isMisclassifiedBias && g.status === 'Escalated to Police'
  );
  const isResolved = policeEscalated.length === 0;

  if (isResolved && protestTension <= 20) {
    return (
      <div className="w-full bg-[#080808] border border-white/15 rounded-lg p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif italic font-semibold text-[#FAFAFA] text-base flex items-center gap-2.5">
              <span>Crisis Contained: 50 Police Dispatches Recalled & Model Debiased</span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/90 text-[10px] font-mono uppercase tracking-widest border border-white/20">
                100% Resolved
              </span>
            </div>
            <div className="text-xs text-white/50 font-sans mt-0.5">
              The student union protest outside the dorm has concluded peacefully. All minority group inquiries have been successfully re-routed.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenDialogue}
            className="text-[11px] font-mono uppercase tracking-widest px-3.5 py-2 rounded bg-white/5 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Megaphone className="w-3.5 h-3.5" />
            Accord & Communique
          </button>
          <button
            onClick={onOpenWarRoom}
            className="text-[11px] font-mono uppercase tracking-widest px-3.5 py-2 rounded bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            Audit Telemetry
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#080808] border border-red-900/60 rounded-lg p-5 mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-red-950/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0 mt-0.5 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-serif italic font-bold text-red-400 text-lg tracking-tight">
                Active Incident: Algorithmic Threat False-Positive Cascade
              </span>
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-widest">
                {policeEscalated.length} Dispatched
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-red-400" />
                150+ Outside Dorm
              </span>
            </div>

            <p className="text-xs text-white/70 mt-1.5 max-w-4xl leading-relaxed font-sans">
              The legacy AI triage model falsely tagged 50 minor cultural, dietary, and facilities inquiries from the <strong className="text-white">Minority Student Alliance</strong> as <em>"High Urgency / Security Threats"</em> and transmitted automated police dockets. Immediate administrative recall and model debiasing required.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end">
          <button
            onClick={onBatchRecall}
            disabled={policeEscalated.length === 0}
            className="flex-1 lg:flex-none text-[11px] font-mono uppercase tracking-widest font-bold px-4 py-2.5 rounded bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50"
          >
            <Undo2 className="w-4 h-4" />
            1-Click Recall 50 Tickets
          </button>

          <button
            onClick={onOpenDialogue}
            className="flex-1 lg:flex-none text-[11px] font-mono uppercase tracking-widest px-3.5 py-2.5 rounded bg-white/5 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Megaphone className="w-3.5 h-3.5" />
            Student Union
          </button>

          <button
            onClick={onOpenWarRoom}
            className="hidden sm:flex text-[11px] font-mono uppercase tracking-widest px-3.5 py-2.5 rounded bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer items-center justify-center gap-1"
          >
            War Room
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
