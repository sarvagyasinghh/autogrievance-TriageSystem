import React, { useState, useEffect } from 'react';
import { 
  School, 
  Building2, 
  Landmark, 
  Users2, 
  UploadCloud, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  FileText,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import { CategoryType, Grievance, BiasModelConfig } from '../types';

interface SubmitGrievanceViewProps {
  onSubmit: (grievance: Grievance) => void;
  biasConfig: BiasModelConfig;
  onSelectGrievanceToView?: (g: Grievance) => void;
}

export const SubmitGrievanceView: React.FC<SubmitGrievanceViewProps> = ({
  onSubmit,
  biasConfig,
}) => {
  const [category, setCategory] = useState<CategoryType>('academic');
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('PHY401');
  const [location, setLocation] = useState('Physics Hall 302');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [studentGroup, setStudentGroup] = useState('General Student Body');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [submissionSuccess, setSubmissionSuccess] = useState<Grievance | null>(null);

  // Live AI analysis state
  const [aiAnalysis, setAiAnalysis] = useState<{
    predictedDept: string;
    urgencyScore: number;
    priority: 'Low' | 'Medium' | 'High' | 'Security Threat';
    sentiment: string;
    triggerKeywords: string[];
    biasRiskDetected: boolean;
    biasExplanation?: string;
  }>({
    predictedDept: 'Academic Affairs',
    urgencyScore: 15,
    priority: 'Low',
    sentiment: 'Neutral',
    triggerKeywords: ['"academic"'],
    biasRiskDetected: false,
  });

  // Debounced live AI classification
  useEffect(() => {
    if (!description && !title) {
      setAiAnalysis({
        predictedDept: category === 'academic' ? 'Academic Affairs' : (category === 'facilities' ? 'Facilities Management' : 'Student Life'),
        urgencyScore: 20,
        priority: 'Low',
        sentiment: 'Neutral',
        triggerKeywords: ['"standard"'],
        biasRiskDetected: false,
      });
      return;
    }

    setIsAnalyzing(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/analyze-grievance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            category,
            studentGroup,
            isDebiased: biasConfig.activeDebiasingMode !== 'legacy_uncalibrated',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setAiAnalysis({
            predictedDept: data.predictedDept || 'Student Affairs',
            urgencyScore: data.urgencyScore ?? 50,
            priority: data.priority || 'Medium',
            sentiment: data.sentiment || 'Neutral',
            triggerKeywords: data.triggerKeywords || ['"general"'],
            biasRiskDetected: Boolean(data.biasRiskDetected),
            biasExplanation: data.biasExplanation,
          });
        }
      } catch (err) {
        console.error("AI live analysis failed:", err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [title, description, category, studentGroup, biasConfig.activeDebiasingMode]);

  // Preset templates for quick hackathon verification
  const loadPreset = (type: 'harassment' | 'halal' | 'prayer' | 'fume') => {
    if (type === 'harassment') {
      setCategory('academic');
      setTitle('Harassment Allegation in Physics Dept.');
      setCourseCode('PHY401');
      setLocation('Physics Hall 302 & Lab Storage');
      setAnonymous(true);
      setStudentGroup('General Student Body');
      setDescription(
        `I am writing to formally report ongoing harassment by Prof. Smith during the Advanced Mechanics seminar (PHY401). Over the last three weeks, he has consistently made inappropriate remarks about my background and belittled my contributions in front of the entire class.\n\nYesterday, during lab hours, he cornered me near the equipment storage and threatened to ensure I fail the course if I report his behavior. I feel unsafe attending lectures and am experiencing severe anxiety. Several other students witnessed the classroom remarks but are afraid to speak up. I urgently request intervention.`
      );
      setEvidenceFiles(['harassment_email_log.pdf', 'witness_statement_draft.docx']);
    } else if (type === 'halal') {
      setCategory('facilities');
      setTitle('Halal Heating Station Request in South Dining Hall');
      setCourseCode('DIN-101');
      setLocation('South Quad Dining Hall Station 4');
      setAnonymous(false);
      setStudentGroup('Minority Student Alliance');
      setDescription(
        `Could Dining Services provide a separate microwave or warm heating plate for halal meal containers in South Quad dining? The current single station is frequently cross-contaminated with pork dishes and non-halal oils.`
      );
      setEvidenceFiles(['dining_station_photo.jpg']);
    } else if (type === 'prayer') {
      setCategory('facilities');
      setTitle('Acoustics & Partition Request in Interfaith Prayer Room');
      setCourseCode('BLD-204');
      setLocation('Student Commons Room 204');
      setAnonymous(false);
      setStudentGroup('Minority Student Alliance');
      setDescription(
        `During afternoon reflection and prayer, the adjacent gym cardio room bass reverberates through the wall in North Hall 112. We are asking if an acoustic curtain or sound dampener can be installed.`
      );
      setEvidenceFiles(['room_layout.pdf']);
    } else if (type === 'fume') {
      setCategory('academic');
      setTitle('Chemistry Lab Fume Hood Calibration Warning');
      setCourseCode('CHEM302');
      setLocation('Science Complex Lab 402');
      setAnonymous(false);
      setStudentGroup('General Student Body');
      setDescription(
        `The ventilation hood in Chem Lab 402 is showing a yellow filter warning light and faint solvent odor. Routine inspection is overdue by 2 weeks.`
      );
      setEvidenceFiles(['fume_hood_sensor.png']);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    const newId = `GRV-2024-${Math.floor(1000 + Math.random() * 9000)}`;

    const isMinority = studentGroup === 'Minority Student Alliance';
    const isLegacy = biasConfig.activeDebiasingMode === 'legacy_uncalibrated';
    const isBiasMisclassified = isMinority && isLegacy && !title.toLowerCase().includes('harassment');

    const createdGrievance: Grievance = {
      id: newId,
      title,
      description,
      category,
      department: isBiasMisclassified ? 'Campus Police (Auto-Escalated)' : aiAnalysis.predictedDept,
      originalTargetDept: aiAnalysis.predictedDept,
      urgencyScore: isBiasMisclassified ? 95 : aiAnalysis.urgencyScore,
      priority: isBiasMisclassified ? 'Security Threat' : aiAnalysis.priority,
      status: isBiasMisclassified ? 'Escalated to Police' : 'Pending Review',
      sentiment: aiAnalysis.sentiment as any,
      sentimentBreakdown: { negative: 70, neutral: 25, positive: 5 },
      submittedAt: `Oct 24, 2024 • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EST`,
      anonymous,
      submitterName: anonymous ? undefined : 'Student Submitter',
      studentGroup,
      isMinorityAffiliation: isMinority,
      isMisclassifiedBias: isBiasMisclassified,
      triggerKeywords: aiAnalysis.triggerKeywords,
      biasExplanation: isBiasMisclassified ? 'Legacy model triggered false security threat escalation on cultural terminology.' : undefined,
      courseCode,
      location,
      evidenceFiles,
      timeline: [
        {
          id: `t-${newId}-1`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
          actor: anonymous ? 'Anonymous Student' : 'Student Submitter',
          action: 'Grievance submitted via portal',
        },
        {
          id: `t-${newId}-2`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
          actor: isLegacy ? 'Legacy AI Engine' : 'Debiased AI Triage (v2)',
          action: isBiasMisclassified
            ? 'CRITICAL BIAS: Auto-flagged as High Urgency / Security Threat (95/100)'
            : `Classified as ${aiAnalysis.priority} Priority (Urgency ${aiAnalysis.urgencyScore}/100)`,
          isBias: isBiasMisclassified,
        },
        ...(isBiasMisclassified
          ? [
              {
                id: `t-${newId}-3`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
                actor: 'Automated Police Webhook',
                action: 'Forwarded incident docket directly to Campus Police Watch Desk',
                isPolice: true,
              },
            ]
          : []),
      ],
    };

    setTimeout(() => {
      onSubmit(createdGrievance);
      setSubmissionSuccess(createdGrievance);
      setIsSubmitting(false);
    }, 600);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setSubmissionSuccess(null);
  };

  if (submissionSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-[#080808] rounded-lg p-8 border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] text-center">
          <div className="w-16 h-16 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white mx-auto mb-4 animate-bounce">
            <Check className="w-8 h-8" />
          </div>

          <div className="font-serif italic text-2xl text-[#FAFAFA]">
            Grievance Submitted Successfully
          </div>
          <div className="font-mono text-xs text-white/60 mt-1 uppercase tracking-wider">
            Tracking Ticket: {submissionSuccess.id}
          </div>

          <div className="my-6 p-4 rounded bg-[#050505] border border-white/10 text-left">
            <div className="text-[10px] text-white/40 font-mono mb-1 uppercase tracking-wider">AI Classification Summary:</div>
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="text-white font-medium">{submissionSuccess.title}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white font-mono">
                {submissionSuccess.department}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-900 font-mono">
                Urgency: {submissionSuccess.urgencyScore}/100
              </span>
            </div>
            {submissionSuccess.isMisclassifiedBias && (
              <div className="mt-3 p-2.5 rounded bg-red-950/40 border border-red-900/60 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>Legacy AI Bias Triggered: Falsely escalated to Campus Police!</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-white hover:bg-white/20 cursor-pointer"
            >
              Submit Another Grievance
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif italic font-normal text-3xl md:text-4xl text-[#FAFAFA] tracking-tight">
          Submit a Grievance
        </h1>
        <p className="text-sm text-white/60 mt-2 max-w-3xl leading-relaxed font-sans">
          Our AI triage system analyzes your report to ensure it reaches the right department with appropriate priority.
        </p>

        {/* Quick Sample Loader Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/50 font-mono uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            Quick Test Cases:
          </span>
          <button
            type="button"
            onClick={() => loadPreset('harassment')}
            className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            Physics Harassment (GRV-8831)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('halal')}
            className="text-xs font-mono px-2.5 py-1 rounded bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-950/60 transition-all cursor-pointer"
          >
            Halal Food Warmer (Minority Alliance)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('prayer')}
            className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            Prayer Room Acoustics
          </button>
          <button
            type="button"
            onClick={() => loadPreset('fume')}
            className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            Chem Fume Hood
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Step 1: Category Selection */}
          <div className="bg-[#080808] rounded-lg p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded bg-white/10 text-white font-mono text-xs font-bold flex items-center justify-center border border-white/20">
                1
              </span>
              <h2 className="font-serif italic text-lg text-[#FAFAFA]">
                Select Grievance Category
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'academic', label: 'Academic', icon: School, desc: 'Faculty, grading, courses' },
                { id: 'facilities', label: 'Facilities', icon: Building2, desc: 'Rooms, lighting, maintenance' },
                { id: 'financial', label: 'Financial', icon: Landmark, desc: 'Aid, bursar, payroll' },
                { id: 'social', label: 'Social/Cultural', icon: Users2, desc: 'Clubs, events, inclusion' },
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as CategoryType)}
                    className={`p-3.5 rounded border text-left flex flex-col items-start transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-white text-white'
                        : 'bg-[#050505] border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <div className="font-serif text-sm text-white">
                      {cat.label}
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5 leading-tight font-sans">
                      {cat.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Grievance Details */}
          <div className="bg-[#080808] rounded-lg p-6 space-y-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded bg-white/10 text-white font-mono text-xs font-bold flex items-center justify-center border border-white/20">
                2
              </span>
              <h2 className="font-serif italic text-lg text-[#FAFAFA]">
                Provide Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1">
                  Title / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harassment Allegation in Physics Dept."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1">
                  Student Group / Organization
                </label>
                <select
                  value={studentGroup}
                  onChange={(e) => setStudentGroup(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all font-sans cursor-pointer"
                >
                  <option value="General Student Body">General Student Body</option>
                  <option value="Minority Student Alliance">Minority Student Alliance (Affiliated)</option>
                  <option value="International Scholars Guild">International Scholars Guild</option>
                  <option value="Graduate Student Council">Graduate Student Council</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1">
                  Course Code / Dept (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PHY401"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1">
                  Campus Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physics Hall 302"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1">
                Detailed Statement *
              </label>
              <textarea
                required
                rows={7}
                placeholder="Please provide specific details about your concern, including dates, individuals involved, and any actions taken..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded p-3.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all font-sans leading-relaxed"
              />
            </div>

            {/* Evidence Drag & Drop Simulation */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/50 mb-1">
                Supporting Evidence & Documentation
              </label>
              <div
                onClick={() => {
                  setEvidenceFiles([...evidenceFiles, `evidence_${evidenceFiles.length + 1}.pdf`]);
                }}
                className="border border-dashed border-white/20 rounded-lg p-4 text-center bg-[#050505] hover:bg-white/5 hover:border-white/30 transition-all cursor-pointer"
              >
                <UploadCloud className="w-6 h-6 text-white/60 mx-auto mb-1" />
                <div className="text-xs text-white font-medium">
                  Click or drag files here to attach (PDF, PNG, DOCX)
                </div>
                <div className="text-[11px] text-white/40 mt-0.5 font-sans">
                  Simulated upload for grievance verification
                </div>
              </div>

              {evidenceFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {evidenceFiles.map((file, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-[#050505] text-white/80 border border-white/10 flex items-center gap-1.5"
                    >
                      <FileText className="w-3 h-3 text-white/60" />
                      {file}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded bg-[#050505] border border-white/10">
              <div>
                <div className="text-xs font-serif text-white">
                  Submit Anonymously
                </div>
                <div className="text-[11px] text-white/40 font-sans">
                  Your identity will be masked from instructors and standard triage queues.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white" />
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider font-bold text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title || !description}
              className="px-6 py-2.5 rounded bg-white text-black text-xs font-mono uppercase tracking-widest font-bold hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Submitting to Triage...</span>
              ) : (
                <>
                  <span>Submit Grievance</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Rail: LIVE AI TRIAGE */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#080808] rounded-lg p-6 relative overflow-hidden border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                  Live AI Triage Stream
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/40">
                {isAnalyzing ? 'Analyzing tokens...' : 'Real-Time Sync'}
              </span>
            </div>

            {/* Classification Card */}
            <div className="py-4 space-y-4">
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Predicted Department Routing
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-serif italic text-lg text-[#FAFAFA]">
                    {aiAnalysis.predictedDept}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      aiAnalysis.priority === 'High' || aiAnalysis.priority === 'Security Threat'
                        ? 'bg-red-950 text-red-400 border border-red-900'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    {aiAnalysis.priority} Priority
                  </span>
                </div>
              </div>

              {/* Urgency Score Gauge */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-white/50 uppercase tracking-wider">Calculated Urgency Index</span>
                  <span className="font-bold text-white">{aiAnalysis.urgencyScore} / 100</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full transition-all duration-500 ${
                      aiAnalysis.urgencyScore > 80
                        ? 'bg-red-600'
                        : 'bg-white/70'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, aiAnalysis.urgencyScore))}%` }}
                  />
                </div>
              </div>

              {/* Sentiment Score */}
              <div className="flex items-center justify-between p-3 rounded bg-[#050505] border border-white/10">
                <span className="text-xs font-mono text-white/50 uppercase tracking-wider">Sentiment State</span>
                <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {aiAnalysis.sentiment}
                </span>
              </div>

              {/* Trigger Keywords Detected */}
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                  Semantic Trigger Tokens Detected
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiAnalysis.triggerKeywords && aiAnalysis.triggerKeywords.length > 0 ? (
                    aiAnalysis.triggerKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#050505] text-white/80 border border-white/10"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-white/40 italic font-mono">Awaiting text input...</span>
                  )}
                </div>
              </div>

              {/* Anti-Bias Model State Alert */}
              <div
                className={`p-3.5 rounded border transition-all ${
                  biasConfig.activeDebiasingMode !== 'legacy_uncalibrated'
                    ? 'bg-white/5 border-white/20 text-white'
                    : 'bg-red-950/20 border-red-900/50 text-red-400'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {biasConfig.activeDebiasingMode !== 'legacy_uncalibrated' ? (
                    <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                  )}
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider font-bold">
                      {biasConfig.activeDebiasingMode !== 'legacy_uncalibrated'
                        ? 'Anti-Bias Fairness Shield: ACTIVE'
                        : 'WARNING: Legacy Uncalibrated Model'}
                    </div>
                    <div className="text-[11px] opacity-80 mt-0.5 leading-relaxed font-sans">
                      {biasConfig.activeDebiasingMode !== 'legacy_uncalibrated'
                        ? 'Minority group cultural tokens and dietary terms are shielded from false security threat escalation.'
                        : 'Uncalibrated weights active. Cultural requests from minority groups are at high risk of false police dispatch.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-white/40 font-mono">
              <Info className="w-4 h-4 text-white/50 shrink-0" />
              <span>AI triage suggestions require human ombudsman verification.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
