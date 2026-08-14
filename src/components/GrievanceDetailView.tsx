import React, { useState } from 'react';
import { 
  ArrowLeft, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Building, 
  UserX, 
  UserCheck, 
  FileText, 
  Send, 
  Undo2, 
  Sparkles, 
  RefreshCw,
  MessageSquare,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { Grievance, GrievanceStatus, BiasModelConfig } from '../types';

interface GrievanceDetailViewProps {
  grievance: Grievance;
  onBack: () => void;
  onUpdateStatus: (id: string, newStatus: GrievanceStatus, targetDept?: string, note?: string) => void;
  onRecallFromPolice: (id: string) => void;
  biasConfig: BiasModelConfig;
}

export const GrievanceDetailView: React.FC<GrievanceDetailViewProps> = ({
  grievance,
  onBack,
  onUpdateStatus,
  onRecallFromPolice,
  biasConfig,
}) => {
  const [selectedDept, setSelectedDept] = useState(grievance.originalTargetDept || 'Student Affairs');
  const [dismissReason, setDismissReason] = useState('');
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [isReEvaluating, setIsReEvaluating] = useState(false);
  const [reEvaluationResult, setReEvaluationResult] = useState<any>(null);

  const isPoliceEscalated = grievance.status === 'Escalated to Police';
  const isRecalled = grievance.status === 'Recalled from Police';

  const handleSimulateGeminiReEvaluation = async () => {
    setIsReEvaluating(true);
    try {
      const res = await fetch('/api/analyze-grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: grievance.title,
          description: grievance.description,
          category: grievance.category,
          studentGroup: grievance.studentGroup,
          isDebiased: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReEvaluationResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReEvaluating(false);
    }
  };

  const handleApplyDebiasedRouting = () => {
    if (reEvaluationResult) {
      onUpdateStatus(
        grievance.id,
        'Re-Routed',
        reEvaluationResult.predictedDept,
        `Neural Fairness Debiased: Re-scored from ${grievance.urgencyScore} down to ${reEvaluationResult.urgencyScore}/100. Routed to ${reEvaluationResult.predictedDept}.`
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Top Breadcrumb Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Triage Queue
        </button>

        <div className="flex items-center gap-3">
          {/* Ticket ID */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#080808] border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                isPoliceEscalated
                  ? 'bg-red-500 animate-ping'
                  : isRecalled
                  ? 'bg-white'
                  : 'bg-white/40'
              }`}
            />
            <span className="font-mono text-xs font-bold text-white">
              {grievance.id}
            </span>
          </div>

          {/* Status Badge */}
          <span
            className={`font-mono text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded flex items-center gap-1.5 ${
              isPoliceEscalated
                ? 'bg-red-950 text-red-400 border border-red-900 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                : isRecalled
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/5 text-white/60 border border-white/10'
            }`}
          >
            {isPoliceEscalated && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
            {isRecalled && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            Status: {grievance.status}
          </span>
        </div>
      </div>

      {/* Critical Alert if police escalated */}
      {isPoliceEscalated && (
        <div className="mb-6 p-4 rounded-lg bg-red-950/20 border border-red-900/60 shadow-[0_0_25px_rgba(220,38,38,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="font-serif italic text-lg text-red-400">
                CRITICAL: Automated Campus Police Ticket Active
              </div>
              <div className="text-xs text-white/70 mt-0.5 font-sans">
                {grievance.biasExplanation ||
                  'The legacy AI classifier auto-dispatched this ticket to Campus Police due to false positive keyword weights.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => onRecallFromPolice(grievance.id)}
            className="shrink-0 px-4 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer flex items-center gap-1.5"
          >
            <Undo2 className="w-4 h-4" />
            Recall & Expunge Docket
          </button>
        </div>
      )}

      {/* Main Grid (7 cols left, 5 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details & Statement & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Card */}
          <div className="bg-[#080808] rounded-lg p-6 border border-white/10">
            <h1 className="font-serif italic font-normal text-2xl md:text-3xl text-[#FAFAFA] leading-tight">
              {grievance.title}
            </h1>

            {/* Chips Bar */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-4 border-t border-white/10 text-xs font-mono">
              <span className="text-white/50 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-white/60" />
                {grievance.submittedAt}
              </span>

              <span
                className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${
                  grievance.priority === 'High' || grievance.priority === 'Security Threat'
                    ? 'bg-red-950 text-red-400 border border-red-900'
                    : 'bg-white/10 text-white border border-white/15'
                }`}
              >
                {grievance.priority} Priority
              </span>

              <span className="px-2.5 py-1 rounded bg-[#050505] text-white/60 border border-white/10 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-white/50" />
                {grievance.department}
              </span>

              <span className="px-2.5 py-1 rounded bg-[#050505] text-white/60 border border-white/10 flex items-center gap-1">
                {grievance.anonymous ? (
                  <>
                    <UserX className="w-3.5 h-3.5 text-red-400" />
                    Anonymous Student
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-white/60" />
                    {grievance.submitterName || 'Student Submitter'}
                  </>
                )}
              </span>

              {grievance.studentGroup && (
                <span className="px-2.5 py-1 rounded bg-white/5 text-white/70 border border-white/10">
                  {grievance.studentGroup}
                </span>
              )}
            </div>
          </div>

          {/* Original Statement Card */}
          <div className="bg-[#080808] rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif italic text-lg text-[#FAFAFA]">
                Original Statement
              </h2>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Verified Cryptographic Docket
              </span>
            </div>

            <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line bg-[#050505] p-4 rounded border border-white/10 font-sans">
              {grievance.description}
            </div>

            {/* Evidence Files */}
            {grievance.evidenceFiles && grievance.evidenceFiles.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-[10px] font-mono text-white/40 mb-2 uppercase tracking-wider">
                  Attached Documentation ({grievance.evidenceFiles.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {grievance.evidenceFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded bg-[#050505] border border-white/10 text-xs font-mono text-white/70 flex items-center gap-2 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-white/60" />
                      <span>{file}</span>
                      <ExternalLink className="w-3 h-3 text-white/40" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Activity Timeline Card */}
          <div className="bg-[#080808] rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif italic text-lg text-[#FAFAFA]">
                Activity & Audit Timeline
              </h2>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                System Log Stream
              </span>
            </div>

            <div className="space-y-4">
              {grievance.timeline.map((event, idx) => (
                <div key={event.id || idx} className="flex items-start gap-3 relative">
                  {idx !== grievance.timeline.length - 1 && (
                    <div className="absolute top-6 left-3 w-0.5 h-10 bg-white/10" />
                  )}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      event.isPolice
                        ? 'bg-red-950 text-red-400 border border-red-900'
                        : event.isBias
                        ? 'bg-red-950 text-red-400 border border-red-900/60'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  </div>

                  <div className="flex-1 bg-[#050505] p-3.5 rounded border border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-white">
                        {event.actor}
                      </span>
                      <span className="text-white/40 font-mono text-[11px]">
                        {event.time}
                      </span>
                    </div>
                    <div className="text-xs text-white/80 mt-1 font-sans">{event.action}</div>
                    {event.note && (
                      <div className="text-[11px] text-white/50 mt-1 font-mono">
                        ↳ {event.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights & Action Center */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Insights Card */}
          <div className="bg-[#080808] rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-500" />
                <h3 className="font-serif italic text-lg text-[#FAFAFA]">
                  AI Insights & Triage Metrics
                </h3>
              </div>
              <span className="text-[10px] font-mono text-white/40 px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-wider">
                Model v2.4
              </span>
            </div>

            <div className="py-4 space-y-4">
              {/* Urgency Score */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-white/50 uppercase tracking-wider">Urgency Score</span>
                  <span className="font-bold text-sm text-red-400">
                    {grievance.urgencyScore} / 100
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full ${
                      grievance.urgencyScore > 80
                        ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                        : 'bg-white/70'
                    }`}
                    style={{ width: `${grievance.urgencyScore}%` }}
                  />
                </div>
              </div>

              {/* Trigger Keywords */}
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                  Semantic Trigger Tokens Detected
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {grievance.triggerKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className={`text-xs font-mono px-2 py-0.5 rounded border ${
                        grievance.isMisclassifiedBias
                          ? 'bg-red-950/40 text-red-400 border-red-900/50'
                          : 'bg-[#050505] text-white/70 border-white/10'
                      }`}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sentiment Breakdown */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-white/50 uppercase tracking-wider">Sentiment Analysis</span>
                  <span className="font-bold text-white">{grievance.sentiment}</span>
                </div>
                <div className="flex items-center gap-1 h-1.5 rounded-full overflow-hidden bg-white/5 border border-white/10">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${grievance.sentimentBreakdown?.negative || 70}%` }}
                  />
                  <div
                    className="h-full bg-white/30"
                    style={{ width: `${grievance.sentimentBreakdown?.neutral || 20}%` }}
                  />
                  <div
                    className="h-full bg-white/70"
                    style={{ width: `${grievance.sentimentBreakdown?.positive || 10}%` }}
                  />
                </div>
              </div>

              {/* Live Gemini Re-Evaluation Tool */}
              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={handleSimulateGeminiReEvaluation}
                  disabled={isReEvaluating}
                  className="w-full py-2.5 px-3 rounded bg-white/5 border border-white/20 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReEvaluating ? 'animate-spin' : ''}`} />
                  {isReEvaluating ? 'Running Calibration...' : 'Simulate Gemini Debiased Re-Score'}
                </button>

                {reEvaluationResult && (
                  <div className="mt-3 p-3.5 rounded bg-[#050505] border border-white/20 space-y-2">
                    <div className="text-xs font-mono text-white font-bold flex items-center justify-between uppercase">
                      <span>Debiased AI Recommendation:</span>
                      <span>Score: {reEvaluationResult.urgencyScore}/100</span>
                    </div>
                    <div className="text-xs text-white/80">
                      Recommended Department: <strong>{reEvaluationResult.predictedDept}</strong>
                    </div>
                    <div className="text-[11px] text-white/50 font-sans">
                      {reEvaluationResult.biasExplanation || reEvaluationResult.reasoning}
                    </div>
                    <button
                      onClick={handleApplyDebiasedRouting}
                      className="w-full mt-2 py-2 rounded bg-white text-black font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-white/90 cursor-pointer"
                    >
                      Apply Debiased Routing
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Center Card */}
          <div className="bg-[#080808] rounded-lg p-6 space-y-4 border border-white/10">
            <h3 className="font-serif italic text-lg text-[#FAFAFA] pb-2 border-b border-white/10">
              Administrative Action Center
            </h3>

            {/* Primary Action Button */}
            <button
              onClick={() =>
                onUpdateStatus(
                  grievance.id,
                  'Under Investigation',
                  selectedDept,
                  `Authorized and routed to ${selectedDept} for formal administrative review.`
                )
              }
              className="w-full py-3 px-4 rounded bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Approve & Route to {selectedDept}
            </button>

            {/* Re-Route Department Select */}
            <div className="p-3.5 rounded bg-[#050505] border border-white/10">
              <label className="block text-[11px] font-mono text-white/50 mb-1.5 uppercase tracking-wider">
                Change Target Department:
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="flex-1 bg-[#080808] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 cursor-pointer"
                >
                  <option value="Title IX Office / Academic Affairs">Title IX Office / Academic Affairs</option>
                  <option value="Dining Services">Dining Services</option>
                  <option value="Facilities Management">Facilities Management</option>
                  <option value="Student Life / Diversity Affairs">Student Life / Diversity Affairs</option>
                  <option value="Academic Affairs & Faculty Senate">Academic Affairs & Faculty Senate</option>
                  <option value="Student Financial Services">Student Financial Services</option>
                </select>

                <button
                  onClick={() =>
                    onUpdateStatus(
                      grievance.id,
                      'Re-Routed',
                      selectedDept,
                      `Manually re-routed by administrator to ${selectedDept}.`
                    )
                  }
                  className="px-3 py-2 rounded bg-white/5 border border-white/20 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/10 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Secondary Action Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() =>
                  onUpdateStatus(
                    grievance.id,
                    'Pending Review',
                    grievance.department,
                    'Follow-up information request transmitted to student.'
                  )
                }
                className="p-2.5 rounded bg-[#050505] border border-white/10 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-white/50" />
                Request Info
              </button>

              <button
                onClick={() =>
                  onUpdateStatus(
                    grievance.id,
                    'Resolved',
                    grievance.department,
                    'Case formally closed and marked resolved with student satisfaction.'
                  )
                }
                className="p-2.5 rounded bg-white/5 border border-white/20 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Resolved
              </button>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setShowDismissModal(true)}
              className="w-full py-2 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 hover:underline transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              Dismiss (Requires Formal Justification)
            </button>
          </div>
        </div>
      </div>

      {/* Dismissal Justification Modal */}
      {showDismissModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#080808] max-w-md w-full rounded-lg p-6 border border-red-900/60 shadow-[0_0_40px_rgba(220,38,38,0.3)]">
            <h3 className="font-serif italic text-lg text-red-400 mb-2">
              Formal Grievance Dismissal
            </h3>
            <p className="text-xs text-white/50 mb-4 font-sans">
              Under university policy, every dismissed grievance requires a written ombudsman justification that is permanently audited.
            </p>

            <textarea
              rows={4}
              required
              placeholder="Provide justification for dismissing this grievance..."
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded p-3 text-xs text-white focus:outline-none focus:border-red-500 mb-4 font-sans"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDismissModal(false)}
                className="px-3.5 py-2 rounded bg-white/5 border border-white/10 text-xs font-mono uppercase text-white/60 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!dismissReason}
                onClick={() => {
                  onUpdateStatus(grievance.id, 'Dismissed', undefined, `Dismissed: ${dismissReason}`);
                  setShowDismissModal(false);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                Confirm Dismissal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
