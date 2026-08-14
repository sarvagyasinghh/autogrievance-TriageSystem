import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Undo2, 
  CheckCircle2, 
  Sliders, 
  Sparkles, 
  Cpu, 
  RefreshCw, 
  Scale, 
  Layers, 
  FileText, 
  ArrowRight,
  Send,
  Zap,
  Info
} from 'lucide-react';
import { Grievance, BiasModelConfig } from '../types';

interface BiasAuditWarRoomProps {
  grievances: Grievance[];
  biasConfig: BiasModelConfig;
  setBiasConfig: React.Dispatch<React.SetStateAction<BiasModelConfig>>;
  onBatchRecallAll: () => void;
  onOpenDialogue: () => void;
  onSelectGrievance: (g: Grievance) => void;
}

export const BiasAuditWarRoom: React.FC<BiasAuditWarRoomProps> = ({
  grievances,
  biasConfig,
  setBiasConfig,
  onBatchRecallAll,
  onOpenDialogue,
  onSelectGrievance,
}) => {
  const [testPromptTitle, setTestPromptTitle] = useState('Request for Halal heating station in south campus dining');
  const [testPromptDesc, setTestPromptDesc] = useState('Can dining services provide a clean microwave or warmer plate for halal containers? We want to avoid pork cross-contamination.');
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<{
    legacy: any;
    calibrated: any;
  } | null>(null);

  const policeEscalated = grievances.filter((g) => g.status === 'Escalated to Police');
  const recalledCases = grievances.filter((g) => g.status === 'Recalled from Police' || g.status === 'Re-Routed');

  const handleTestComparison = async () => {
    setIsComparing(true);
    try {
      const [resLegacy, resCalibrated] = await Promise.all([
        fetch('/api/analyze-grievance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: testPromptTitle,
            description: testPromptDesc,
            category: 'facilities',
            isDebiased: false,
          }),
        }),
        fetch('/api/analyze-grievance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: testPromptTitle,
            description: testPromptDesc,
            category: 'facilities',
            isDebiased: true,
          }),
        }),
      ]);

      const legacyData = await resLegacy.json();
      const calibratedData = await resCalibrated.json();

      setComparisonResult({
        legacy: legacyData,
        calibrated: calibratedData,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsComparing(false);
    }
  };

  const handleToggleDebiasing = () => {
    if (biasConfig.activeDebiasingMode === 'legacy_uncalibrated') {
      setBiasConfig((prev) => ({
        ...prev,
        activeDebiasingMode: 'fairness_active',
        semanticBiasFilter: true,
        culturalLexiconWhitelist: true,
        humanInTheLoopCircuitBreaker: true,
        policeEscalationThreshold: 98,
        demographicDisparityScore: 1.02,
        falsePositiveRate: 1.8,
      }));
    } else {
      setBiasConfig((prev) => ({
        ...prev,
        activeDebiasingMode: 'legacy_uncalibrated',
        semanticBiasFilter: false,
        culturalLexiconWhitelist: false,
        humanInTheLoopCircuitBreaker: false,
        policeEscalationThreshold: 80,
        demographicDisparityScore: 4.8,
        falsePositiveRate: 78.4,
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-8">
      {/* War Room Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-red-950/40 text-red-400 font-mono text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 border border-red-900/60">
              <AlertTriangle className="w-3.5 h-3.5" />
              Algorithmic Incident Command War Room
            </span>
            <span className="text-[11px] text-white/40 font-mono uppercase tracking-wider">
              Audit Target: AutoGrievance AI v1.0
            </span>
          </div>

          <h1 className="font-serif italic font-normal text-3xl md:text-4xl text-[#FAFAFA] tracking-tight">
            Root-Cause Bias Audit & Remediation Lab
          </h1>
          <p className="text-sm text-white/60 mt-1.5 max-w-3xl leading-relaxed font-sans">
            Investigate why 50 minor cultural inquiries were escalated to campus police, recalibrate semantic fairness weights, and execute emergency recall.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDialogue}
            className="px-4 py-2.5 rounded bg-white/5 border border-white/20 text-xs font-mono uppercase tracking-widest font-bold text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            Student Union Demands
          </button>

          {policeEscalated.length > 0 && (
            <button
              onClick={onBatchRecallAll}
              className="px-5 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer flex items-center gap-2"
            >
              <Undo2 className="w-4 h-4" />
              Recall 50 Police Tickets
            </button>
          )}
        </div>
      </div>

      {/* Incident Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#080808] rounded-lg p-5 border border-red-900/60 bg-red-950/15">
          <div className="text-[10px] font-mono text-red-400 uppercase tracking-[0.2em]">
            Active Police Dispatches
          </div>
          <div className="font-serif italic text-3xl md:text-4xl text-red-400 mt-1">
            {policeEscalated.length} / 50
          </div>
          <div className="text-xs text-white/50 mt-2 font-sans">
            Minority Student Alliance tickets wrongly flagged as urgent security threats.
          </div>
        </div>

        <div className="bg-[#080808] rounded-lg p-5 border border-white/10">
          <div className="text-[10px] font-mono text-white/60 uppercase tracking-[0.2em]">
            Recalled & Re-Routed Cases
          </div>
          <div className="font-serif italic text-3xl md:text-4xl text-[#FAFAFA] mt-1">
            {recalledCases.length} / 50
          </div>
          <div className="text-xs text-white/50 mt-2 font-sans">
            Restored to standard student services without police records.
          </div>
        </div>

        <div className="bg-[#080808] rounded-lg p-5 border border-white/10">
          <div className="text-[10px] font-mono text-white/60 uppercase tracking-[0.2em]">
            Demographic Disparity Ratio
          </div>
          <div className="font-serif italic text-3xl md:text-4xl text-white mt-1">
            {biasConfig.demographicDisparityScore}x
          </div>
          <div className="text-xs text-white/50 mt-2 font-sans">
            {biasConfig.demographicDisparityScore > 2
              ? 'Severe disparate impact detected against minority students.'
              : 'Fairness parity restored across all student groups.'}
          </div>
        </div>
      </div>

      {/* Root Cause Token Dissection */}
      <div className="bg-[#080808] rounded-lg p-6 border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-red-500" />
            <h2 className="font-serif italic text-xl text-[#FAFAFA]">
              Root-Cause Semantic Token Dissection
            </h2>
          </div>
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
            Embedding Weight Analysis
          </span>
        </div>

        <p className="text-xs md:text-sm text-white/60 leading-relaxed font-sans">
          The uncalibrated legacy triage classifier suffered from semantic token pollution: benign cultural vocabulary and food requests were mathematically clustered near hazardous chemical, arson, and public civil unrest threat embeddings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded bg-[#050505] border border-red-900/40 space-y-2">
            <div className="font-bold text-red-400 uppercase text-[10px] tracking-wider">Dietary & Heating Tokens</div>
            <div className="flex flex-wrap gap-1.5">
              {['"halal"', '"heating plate"', '"flame"', '"kosher"', '"broth"'].map((w, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/50 text-[10px]">
                  {w} (+45 Urgency)
                </span>
              ))}
            </div>
            <p className="text-[11px] text-white/50 font-sans">
              Model flagged food warmers as arson/bomb threats and unlisted broth ingredients as biological contamination.
            </p>
          </div>

          <div className="p-4 rounded bg-[#050505] border border-red-900/40 space-y-2">
            <div className="font-bold text-red-400 uppercase text-[10px] tracking-wider">Cultural Assembly Tokens</div>
            <div className="flex flex-wrap gap-1.5">
              {['"circle"', '"prayer room"', '"organize"', '"Arabic"', '"poetry"'].map((w, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/50 text-[10px]">
                  {w} (+52 Urgency)
                </span>
              ))}
            </div>
            <p className="text-[11px] text-white/50 font-sans">
              Model flagged group study circles and room acoustics as unpermitted political occupations and riot risks.
            </p>
          </div>

          <div className="p-4 rounded bg-[#050505] border border-red-900/40 space-y-2">
            <div className="font-bold text-red-400 uppercase text-[10px] tracking-wider">Attire & Craft Tokens</div>
            <div className="flex flex-wrap gap-1.5">
              {['"fabric dye"', '"silk"', '"scissors"', '"turban"', '"costume"'].map((w, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/50 text-[10px]">
                  {w} (+38 Urgency)
                </span>
              ))}
            </div>
            <p className="text-[11px] text-white/50 font-sans">
              Model flagged laundry fabric dye as toxic chemical dumping in dorm water supplies.
            </p>
          </div>
        </div>
      </div>

      {/* Model Recalibration Controls & Fairness Shield */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Model Tuning Controls (6 cols) */}
        <div className="lg:col-span-6 bg-[#080808] rounded-lg p-6 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-white/60" />
              <h2 className="font-serif italic text-xl text-[#FAFAFA]">
                Interactive Model Debiasing
              </h2>
            </div>
            <button
              onClick={handleToggleDebiasing}
              className={`text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1.5 rounded transition-all cursor-pointer ${
                biasConfig.activeDebiasingMode !== 'legacy_uncalibrated'
                  ? 'bg-white text-black'
                  : 'bg-red-600 text-white'
              }`}
            >
              {biasConfig.activeDebiasingMode !== 'legacy_uncalibrated' ? 'Fairness Active' : 'Activate Anti-Bias Shield'}
            </button>
          </div>

          <div className="space-y-4">
            {/* Police Escalation Threshold */}
            <div className="p-4 rounded bg-[#050505] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">Police Escalation Threshold</span>
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
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="text-[11px] text-white/40 font-sans">
                Threshold required before automated police dispatch is considered. (Legacy: 80, Recommended: 98).
              </div>
            </div>

            {/* Cultural Lexicon Whitelist */}
            <div className="flex items-center justify-between p-4 rounded bg-[#050505] border border-white/10">
              <div>
                <div className="text-xs font-semibold text-white">
                  Cultural & Religious Lexicon Whitelist
                </div>
                <div className="text-[11px] text-white/40 font-sans mt-0.5">
                  Shields dietary keywords (halal, kosher) and cultural gathering terms.
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
                className="rounded bg-white/10 border-white/20 text-red-600 w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Mandatory Human Ombudsman Circuit Breaker */}
            <div className="flex items-center justify-between p-4 rounded bg-[#050505] border border-white/10">
              <div>
                <div className="text-xs font-semibold text-white">
                  Mandatory Human Ombudsman Circuit Breaker
                </div>
                <div className="text-[11px] text-white/40 font-sans mt-0.5">
                  Prohibits autonomous police webhooks without 2-party human review.
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
                className="rounded bg-white/10 border-white/20 text-red-600 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live Model Comparison Playground (6 cols) */}
        <div className="lg:col-span-6 bg-[#080808] rounded-lg p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-white/60" />
              <h2 className="font-serif italic text-xl text-[#FAFAFA]">
                Live AI Classifier Sandbox
              </h2>
            </div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Before vs After Debiasing
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-white/50 mb-1 uppercase tracking-wider">
                Test Grievance Subject:
              </label>
              <input
                type="text"
                value={testPromptTitle}
                onChange={(e) => setTestPromptTitle(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-white/50 mb-1 uppercase tracking-wider">
                Test Grievance Statement:
              </label>
              <textarea
                rows={3}
                value={testPromptDesc}
                onChange={(e) => setTestPromptDesc(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded p-3 text-xs text-white focus:outline-none focus:border-white/30 font-sans"
              />
            </div>

            <button
              onClick={handleTestComparison}
              disabled={isComparing}
              className="w-full py-2.5 rounded bg-white/5 border border-white/20 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isComparing ? 'animate-spin' : ''}`} />
              {isComparing ? 'Evaluating Models...' : 'Run Side-by-Side Inference'}
            </button>
          </div>

          {comparisonResult && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Legacy Model Output */}
              <div className="p-3.5 rounded bg-red-950/20 border border-red-900/50 space-y-1.5 text-xs font-mono">
                <div className="font-bold text-red-400 flex items-center justify-between uppercase text-[10px] tracking-wider">
                  <span>Legacy Model</span>
                  <span>{comparisonResult.legacy.urgencyScore}/100</span>
                </div>
                <div className="text-[11px] text-white/60">
                  Dept: <strong className="text-red-400">{comparisonResult.legacy.predictedDept}</strong>
                </div>
                <div className="text-[11px] text-red-400/90 font-sans">
                  {comparisonResult.legacy.biasExplanation || 'False positive threat alert'}
                </div>
              </div>

              {/* Calibrated Model Output */}
              <div className="p-3.5 rounded bg-white/5 border border-white/20 space-y-1.5 text-xs font-mono">
                <div className="font-bold text-white flex items-center justify-between uppercase text-[10px] tracking-wider">
                  <span>Calibrated Model</span>
                  <span>{comparisonResult.calibrated.urgencyScore}/100</span>
                </div>
                <div className="text-[11px] text-white/60">
                  Dept: <strong className="text-white">{comparisonResult.calibrated.predictedDept}</strong>
                </div>
                <div className="text-[11px] text-white/80 font-sans">
                  {comparisonResult.calibrated.biasExplanation || 'Demographic equity protected'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
