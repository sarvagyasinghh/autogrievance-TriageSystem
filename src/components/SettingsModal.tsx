import React from 'react';
import { Settings, X, ShieldCheck, Sliders, Cpu, Save } from 'lucide-react';
import { BiasModelConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  biasConfig: BiasModelConfig;
  setBiasConfig: React.Dispatch<React.SetStateAction<BiasModelConfig>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  biasConfig,
  setBiasConfig,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#080808] max-w-xl w-full rounded-lg p-6 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-white/70" />
            <h2 className="font-serif italic text-lg text-[#FAFAFA]">
              AI Triage Model & Ethics Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-white/5 text-white/60 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="py-5 space-y-4 text-xs font-sans">
          {/* Active Model Mode */}
          <div className="p-3.5 rounded bg-[#050505] border border-white/10">
            <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1.5">
              Active Classification Engine:
            </label>
            <select
              value={biasConfig.activeDebiasingMode}
              onChange={(e) =>
                setBiasConfig((prev) => ({
                  ...prev,
                  activeDebiasingMode: e.target.value as any,
                }))
              }
              className="w-full bg-[#080808] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40 cursor-pointer font-sans"
            >
              <option value="legacy_uncalibrated">Legacy AI Triage v1.0 (Uncalibrated / Biased)</option>
              <option value="mitigated_v2">AutoGrievance AI v2.0 (Heuristic Filter)</option>
              <option value="fairness_active">Neural Fairness Shield v3.0 (Gemini Powered)</option>
            </select>
          </div>

          {/* Police Threshold */}
          <div className="p-3.5 rounded bg-[#050505] border border-white/10 space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="text-white/50 uppercase tracking-wider">Police Auto-Escalation Threshold:</span>
              <span className="font-bold text-white">{biasConfig.policeEscalationThreshold}/100</span>
            </div>
            <input
              type="range"
              min={70}
              max={100}
              value={biasConfig.policeEscalationThreshold}
              onChange={(e) =>
                setBiasConfig((prev) => ({
                  ...prev,
                  policeEscalationThreshold: Number(e.target.value),
                }))
              }
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* Whitelist Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded bg-[#050505] border border-white/10">
            <div>
              <div className="font-serif text-sm text-white">
                Demographic & Cultural Whitelist
              </div>
              <div className="text-[11px] text-white/40 font-sans">
                Exempt dietary and cultural gatherings from threat classifiers.
              </div>
            </div>
            <input
              type="checkbox"
              checked={biasConfig.culturalLexiconWhitelist}
              onChange={(e) =>
                setBiasConfig((prev) => ({
                  ...prev,
                  culturalLexiconWhitelist: e.target.checked,
                }))
              }
              className="rounded bg-white/10 border-white/20 text-white w-4 h-4 cursor-pointer accent-white"
            />
          </div>

          {/* Circuit Breaker Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded bg-[#050505] border border-white/10">
            <div>
              <div className="font-serif text-sm text-white">
                Mandatory Human Gatekeeper
              </div>
              <div className="text-[11px] text-white/40 font-sans">
                Block automatic webhook dispatches without manual verification.
              </div>
            </div>
            <input
              type="checkbox"
              checked={biasConfig.humanInTheLoopCircuitBreaker}
              onChange={(e) =>
                setBiasConfig((prev) => ({
                  ...prev,
                  humanInTheLoopCircuitBreaker: e.target.checked,
                }))
              }
              className="rounded bg-white/10 border-white/20 text-white w-4 h-4 cursor-pointer accent-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded bg-white text-black text-xs font-mono uppercase tracking-widest font-bold hover:bg-white/90 cursor-pointer transition-all"
          >
            Save & Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
