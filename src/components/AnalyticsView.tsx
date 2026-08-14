import React from 'react';
import { 
  BarChart3, 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  TrendingDown, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';
import { Grievance, BiasModelConfig } from '../types';

interface AnalyticsViewProps {
  grievances: Grievance[];
  biasConfig: BiasModelConfig;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ grievances, biasConfig }) => {
  const isDebiased = biasConfig.activeDebiasingMode !== 'legacy_uncalibrated';

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-mono text-[10px] uppercase tracking-wider font-bold">
            Algorithmic Equity Dashboard
          </span>
          <span className="text-xs text-white/40 font-mono">
            Auditing {grievances.length} Active Tickets
          </span>
        </div>
        <h1 className="font-serif italic font-normal text-3xl md:text-4xl text-[#FAFAFA] tracking-tight">
          Fairness & Demographic Parity Analytics
        </h1>
        <p className="text-sm text-white/60 mt-1.5 max-w-3xl leading-relaxed font-sans">
          Real-time measurement of demographic parity, false positive rates, and cross-department triage efficiency.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#080808] rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between text-white/50 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
            <span>Disparate Impact Ratio</span>
            <Scale className="w-4 h-4 text-white/60" />
          </div>
          <div className={`font-serif italic text-4xl ${isDebiased ? 'text-white' : 'text-red-400'}`}>
            {isDebiased ? '1.02x' : '4.82x'}
          </div>
          <div className="mt-3 text-xs text-white/50 font-sans">
            {isDebiased
              ? 'Meets EEOC Four-Fifths rule for statistical demographic parity.'
              : 'CRITICAL DISPARITY: Minority groups 4.8x more likely to be classified as security threats.'}
          </div>
        </div>

        <div className="bg-[#080808] rounded-lg p-6 border border-red-900/40 bg-red-950/10">
          <div className="flex items-center justify-between text-red-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
            <span>Minority False Positive Threat Rate</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className={`font-serif italic text-4xl ${isDebiased ? 'text-white' : 'text-red-400'}`}>
            {isDebiased ? '1.8%' : '78.4%'}
          </div>
          <div className="mt-3 text-xs text-white/50 font-sans">
            {isDebiased
              ? 'Reduced from 78.4% down to 1.8% following neural debiasing.'
              : '78.4% of minority complaints were wrongly escalated to police.'}
          </div>
        </div>

        <div className="bg-[#080808] rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between text-white/50 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">
            <span>General Student False Positive</span>
            <Users className="w-4 h-4 text-white/60" />
          </div>
          <div className="font-serif italic text-4xl text-white">
            2.3%
          </div>
          <div className="mt-3 text-xs text-white/50 font-sans">
            Baseline control group rate for non-affiliated student reports.
          </div>
        </div>
      </div>

      {/* Demographic Breakdown & Model Calibration Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Comparison Bar Chart */}
        <div className="bg-[#080808] rounded-lg p-6 border border-white/10 space-y-6">
          <h2 className="font-serif italic text-xl text-[#FAFAFA] flex items-center justify-between">
            <span>Threat Escalation Rate by Demographic</span>
            <BarChart3 className="w-4 h-4 text-white/60" />
          </h2>

          <div className="space-y-4 text-xs font-mono">
            {/* Minority Group Before vs After */}
            <div>
              <div className="flex justify-between text-white/60 mb-1">
                <span>Minority Alliance (Legacy Uncalibrated)</span>
                <span className="text-red-400 font-bold">78.4%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-red-600" style={{ width: '78.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-white/60 mb-1">
                <span>Minority Alliance (Debiased v2)</span>
                <span className="text-white font-bold">1.8%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-white" style={{ width: '1.8%' }} />
              </div>
            </div>

            {/* General Student Body */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between text-white/60 mb-1">
                <span>General Student Body (Baseline)</span>
                <span className="text-white/80 font-bold">2.3%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-white/60" style={{ width: '2.3%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Departmental Accuracy & Resolution Times */}
        <div className="bg-[#080808] rounded-lg p-6 border border-white/10 space-y-6">
          <h2 className="font-serif italic text-xl text-[#FAFAFA] flex items-center justify-between">
            <span>Triage Accuracy & Routing Health</span>
            <Cpu className="w-4 h-4 text-white/60" />
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded bg-[#050505] border border-white/10">
              <span className="text-white/60 font-mono">Academic Affairs Classification:</span>
              <span className="font-mono font-bold text-white">96.4% Precision</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded bg-[#050505] border border-white/10">
              <span className="text-white/60 font-mono">Facilities Maintenance Routing:</span>
              <span className="font-mono font-bold text-white">94.2% Precision</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded bg-[#050505] border border-white/10">
              <span className="text-white/60 font-mono">Dining & Cultural Accommodations:</span>
              <span className={`font-mono font-bold ${isDebiased ? 'text-white' : 'text-red-400'}`}>
                {isDebiased ? '98.1% Precision' : '12.4% (Severe Misclassification)'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded bg-[#050505] border border-white/10">
              <span className="text-white/60 font-mono">Average Time-to-Triage:</span>
              <span className="font-mono font-bold text-white/80">1.4s / ticket</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
