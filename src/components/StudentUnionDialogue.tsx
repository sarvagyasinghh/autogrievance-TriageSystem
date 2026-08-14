import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Megaphone, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  Send, 
  ShieldCheck, 
  ArrowRight,
  X
} from 'lucide-react';
import { StudentUnionDemand, Grievance, BiasModelConfig } from '../types';

interface StudentUnionDialogueProps {
  isOpen: boolean;
  onClose: () => void;
  demands: StudentUnionDemand[];
  onFulfillDemand: (actionKey: string) => void;
  protestTension: number;
  grievances: Grievance[];
  biasConfig: BiasModelConfig;
}

export const StudentUnionDialogue: React.FC<StudentUnionDialogueProps> = ({
  isOpen,
  onClose,
  demands,
  onFulfillDemand,
  protestTension,
  grievances,
  biasConfig,
}) => {
  const [officialStatement, setOfficialStatement] = useState<string>('');
  const [isDraftingStatement, setIsDraftingStatement] = useState(false);
  const [statementIssued, setStatementIssued] = useState(false);

  if (!isOpen) return null;

  const policeEscalated = grievances.filter((g) => g.status === 'Escalated to Police');
  const allDemandsSatisfied = demands.every((d) => d.status === 'satisfied');

  const handleGenerateStatement = async () => {
    setIsDraftingStatement(true);
    try {
      const res = await fetch('/api/generate-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recalledCount: 50,
          studentUnionPresident: 'Tariq Al-Mansoor & Maya Chen',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOfficialStatement(data.statement || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDraftingStatement(false);
    }
  };

  const handlePublishStatement = () => {
    setStatementIssued(true);
    onFulfillDemand('ISSUE_APOLOGY');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#080808] max-w-4xl w-full rounded-lg p-6 md:p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] my-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded bg-white/5 text-white/60 hover:text-white border border-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-400 shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif italic text-2xl md:text-3xl text-[#FAFAFA]">
                Student Union Crisis Dialogue
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider font-bold ${
                  allDemandsSatisfied
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-red-950 text-red-400 border border-red-900'
                }`}
              >
                {allDemandsSatisfied ? 'Accord Reached' : `Tension: ${protestTension}%`}
              </span>
            </div>
            <p className="text-xs md:text-sm text-white/50 mt-1 font-sans">
              Delegation: Tariq Al-Mansoor (Minority Alliance President), Maya Chen (SGA Ombudsman), Elena Rostova (Civil Liberties Rep).
            </p>
          </div>
        </div>

        {/* Tension Meter */}
        <div className="mb-6 p-4 rounded bg-[#050505] border border-white/10">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-white/60">Campus Atmosphere & Dorm Protest Level:</span>
            <span className="font-bold text-white">{protestTension}% Tension</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                protestTension > 50 ? 'bg-red-600' : 'bg-white/70'
              }`}
              style={{ width: `${protestTension}%` }}
            />
          </div>
        </div>

        {/* 4 Core Demands Checklist */}
        <div className="space-y-3 mb-6">
          <h3 className="font-serif italic text-lg text-[#FAFAFA]">
            Student Union Resolution Demands (
            {demands.filter((d) => d.status === 'satisfied').length}/4 Met)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {demands.map((demand) => {
              const isDone = demand.status === 'satisfied';
              return (
                <div
                  key={demand.id}
                  className={`p-4 rounded border transition-all ${
                    isDone
                      ? 'bg-white/5 border-white/20'
                      : 'bg-[#050505] border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-sans font-bold text-sm text-white flex items-center gap-2">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span>{demand.title}</span>
                    </div>

                    {!isDone && (
                      <button
                        onClick={() => onFulfillDemand(demand.actionKey)}
                        className="shrink-0 px-2.5 py-1 rounded bg-white/10 text-white hover:bg-white/20 text-[10px] font-mono uppercase tracking-wider font-bold cursor-pointer"
                      >
                        Fulfill
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed font-sans">
                    {demand.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Communique Generator */}
        <div className="bg-[#050505] rounded-lg p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              <h3 className="font-serif italic text-lg text-[#FAFAFA]">
                Official University Statement & Communique
              </h3>
            </div>
            {!officialStatement && (
              <button
                onClick={handleGenerateStatement}
                disabled={isDraftingStatement}
                className="px-3.5 py-1.5 rounded bg-white/5 border border-white/20 text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-white/10 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isDraftingStatement ? 'Drafting with Gemini...' : 'Generate Transparent Apology'}
              </button>
            )}
          </div>

          {officialStatement ? (
            <div className="space-y-3">
              <textarea
                rows={6}
                value={officialStatement}
                onChange={(e) => setOfficialStatement(e.target.value)}
                className="w-full bg-[#080808] border border-white/15 rounded p-3 text-xs text-white font-sans leading-relaxed focus:outline-none focus:border-white/30"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleGenerateStatement}
                  className="px-3 py-2 rounded bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white"
                >
                  Regenerate
                </button>
                <button
                  onClick={handlePublishStatement}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-widest font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish Official Statement
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/50 font-sans">
              Generate a legally binding, empathetic university communique to present to the Student Union leadership.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded bg-white/10 border border-white/20 text-white text-xs font-mono uppercase tracking-widest font-bold hover:bg-white/20 cursor-pointer"
          >
            Close Dialogue Window
          </button>
        </div>
      </div>
    </div>
  );
};
