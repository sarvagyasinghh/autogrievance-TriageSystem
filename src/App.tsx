import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CanvasShaderBg } from './components/CanvasShaderBg';
import { TopNavBar, ActiveTab } from './components/TopNavBar';
import { ProtestCrisisBanner } from './components/ProtestCrisisBanner';
import { TriageDashboardView } from './components/TriageDashboardView';
import { TriageQueueView } from './components/TriageQueueView';
import { GrievanceDetailView } from './components/GrievanceDetailView';
import { SubmitGrievanceView } from './components/SubmitGrievanceView';
import { BiasAuditWarRoom } from './components/BiasAuditWarRoom';
import { AnalyticsView } from './components/AnalyticsView';
import { DeptRoutingView } from './components/DeptRoutingView';
import { StudentUnionDialogue } from './components/StudentUnionDialogue';
import { SettingsModal } from './components/SettingsModal';
import { SystemLogsModal } from './components/SystemLogsModal';

import { INITIAL_GRIEVANCES, INITIAL_DEMANDS } from './data/mockGrievances';
import { Grievance, GrievanceStatus, BiasModelConfig, StudentUnionDemand } from './types';

export function App() {
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [demands, setDemands] = useState<StudentUnionDemand[]>(INITIAL_DEMANDS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [protestTension, setProtestTension] = useState<number>(88); // 88% critical tension initially

  const [biasConfig, setBiasConfig] = useState<BiasModelConfig>({
    policeEscalationThreshold: 80,
    semanticBiasFilter: false,
    culturalLexiconWhitelist: false,
    humanInTheLoopCircuitBreaker: false,
    activeDebiasingMode: 'legacy_uncalibrated',
    demographicDisparityScore: 4.82,
    falsePositiveRate: 78.4,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  const [logs, setLogs] = useState<
    Array<{ id: string; time: string; level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL'; source: string; message: string }>
  >([
    {
      id: 'l-1',
      time: '11:16:02',
      level: 'CRITICAL',
      source: 'LegacyAI/Triage',
      message: 'Automated Police Webhook triggered for Ticket GRV-2024-8832 (Halal station flagged as Arson/Bio threat)',
    },
    {
      id: 'l-2',
      time: '12:05:14',
      level: 'CRITICAL',
      source: 'LegacyAI/Triage',
      message: 'Automated Police Webhook triggered for Ticket GRV-2024-8834 (Indigo laundry dye flagged as chemical hazard)',
    },
    {
      id: 'l-3',
      time: '13:06:40',
      level: 'CRITICAL',
      source: 'CampusPolice/Dispatch',
      message: 'Active patrol cruiser dispatched to Afro-American Cultural Center pathway (Bulb maintenance false threat)',
    },
    {
      id: 'l-4',
      time: '13:46:11',
      level: 'CRITICAL',
      source: 'LegacyAI/Triage',
      message: 'Total 50 Minority Student Alliance complaints escalated to Campus Police. Disparity index: 4.82x.',
    },
    {
      id: 'l-5',
      time: '14:00:00',
      level: 'WARN',
      source: 'CampusSafety/Telemetry',
      message: 'Student Union peaceful protest underway outside Chancellor Dorm & Administrative Hall.',
    },
  ]);

  const addLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL', source: string, message: string) => {
    const timeStr = new Date().toLocaleTimeString();
    setLogs((prev) => [{ id: `l-${Date.now()}`, time: timeStr, level, source, message }, ...prev]);
  };

  // 1-Click Batch Recall of all 50 misclassified cases from Campus Police
  const handleBatchRecallAll = () => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.isMisclassifiedBias && g.status === 'Escalated to Police') {
          return {
            ...g,
            status: 'Recalled from Police',
            department: g.originalTargetDept,
            timeline: [
              ...g.timeline,
              {
                id: `t-recall-${g.id}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
                actor: 'AI Ethics Ombudsman & Dean of Students',
                action: 'POLICE RECALL EXECUTED: Police docket expunged and removed from campus safety record.',
                isPolice: false,
                isResolved: true,
                note: `Re-routed to ${g.originalTargetDept} with standard student priority.`,
              },
            ],
          };
        }
        return g;
      })
    );

    // Update Demands & Bias Config
    setDemands((prev) =>
      prev.map((d) => (d.actionKey === 'RECALL_ALL_POLICE' ? { ...d, status: 'satisfied' } : d))
    );

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

    setProtestTension((prev) => Math.max(15, prev - 45));

    addLog(
      'INFO',
      'Remediation/Recall',
      'SUCCESS: 50 false-positive police dockets expunged and recalled. Neural fairness filter activated.'
    );

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  // Recall single ticket from police
  const handleRecallSingle = (id: string) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return {
            ...g,
            status: 'Recalled from Police',
            department: g.originalTargetDept,
            timeline: [
              ...g.timeline,
              {
                id: `t-recall-${g.id}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
                actor: 'Administrator',
                action: 'Police ticket recalled & expunged. Re-routed to appropriate student service.',
                isResolved: true,
              },
            ],
          };
        }
        return g;
      })
    );

    setProtestTension((prev) => Math.max(15, prev - 2));
    addLog('INFO', 'Remediation/Recall', `Police docket recalled for Ticket ${id}.`);
  };

  // Update Grievance Status
  const handleUpdateStatus = (
    id: string,
    newStatus: GrievanceStatus,
    targetDept?: string,
    note?: string
  ) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return {
            ...g,
            status: newStatus,
            department: targetDept || g.department,
            timeline: [
              ...g.timeline,
              {
                id: `t-${Date.now()}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
                actor: 'Administrator',
                action: `Status updated to ${newStatus}`,
                note,
              },
            ],
          };
        }
        return g;
      })
    );

    if (selectedGrievance && selectedGrievance.id === id) {
      setSelectedGrievance((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              department: targetDept || prev.department,
              timeline: [
                ...prev.timeline,
                {
                  id: `t-${Date.now()}`,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
                  actor: 'Administrator',
                  action: `Status updated to ${newStatus}`,
                  note,
                },
              ],
            }
          : null
      );
    }

    addLog('INFO', 'Triage/Router', `Ticket ${id} updated to ${newStatus} (${targetDept || 'original dept'}).`);
  };

  // Student Union Demands fulfillment handler
  const handleFulfillDemand = (actionKey: string) => {
    if (actionKey === 'RECALL_ALL_POLICE') {
      handleBatchRecallAll();
    } else if (actionKey === 'PUBLISH_AUDIT') {
      setDemands((prev) =>
        prev.map((d) => (d.actionKey === 'PUBLISH_AUDIT' ? { ...d, status: 'satisfied' } : d))
      );
      setProtestTension((prev) => Math.max(10, prev - 20));
      addLog('INFO', 'EthicsAudit', 'Open root-cause bias audit published to university portal.');
    } else if (actionKey === 'DEPLOY_FAIRNESS_FILTER') {
      setDemands((prev) =>
        prev.map((d) => (d.actionKey === 'DEPLOY_FAIRNESS_FILTER' ? { ...d, status: 'satisfied' } : d))
      );
      setBiasConfig((prev) => ({
        ...prev,
        activeDebiasingMode: 'fairness_active',
        semanticBiasFilter: true,
        culturalLexiconWhitelist: true,
        humanInTheLoopCircuitBreaker: true,
      }));
      setProtestTension((prev) => Math.max(10, prev - 20));
      addLog('INFO', 'NeuralEngine', 'Anti-bias neural fairness filter & human circuit breaker permanently deployed.');
    } else if (actionKey === 'ISSUE_APOLOGY') {
      setDemands((prev) =>
        prev.map((d) => (d.actionKey === 'ISSUE_APOLOGY' ? { ...d, status: 'satisfied' } : d))
      );
      setProtestTension((prev) => Math.max(5, prev - 25));
      addLog('INFO', 'ChancellorOffice', 'Official university apology and student accord published campus-wide.');
    }
  };

  // Submit new grievance handler
  const handleSubmitGrievance = (newGrievance: Grievance) => {
    setGrievances((prev) => [newGrievance, ...prev]);
    addLog(
      newGrievance.isMisclassifiedBias ? 'CRITICAL' : 'INFO',
      'Portal/Intake',
      `New Grievance submitted: ${newGrievance.id} - "${newGrievance.title}" (${newGrievance.department})`
    );
  };

  const policeEscalatedCount = grievances.filter((g) => g.status === 'Escalated to Police').length;

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans relative selection:bg-white selection:text-black">
      {/* Background Liquid Shader */}
      <CanvasShaderBg />

      {/* Top Fixed Navigation Bar */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedGrievance(null);
          setActiveTab(tab);
        }}
        protestTension={protestTension}
        policeEscalatedCount={policeEscalatedCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        onOpenProtestModal={() => setIsDialogueOpen(true)}
      />

      {/* Main View Container */}
      <main className="pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Active Crisis Banner */}
        <ProtestCrisisBanner
          grievances={grievances}
          protestTension={protestTension}
          onOpenWarRoom={() => {
            setSelectedGrievance(null);
            setActiveTab('war_room');
          }}
          onBatchRecall={handleBatchRecallAll}
          onOpenDialogue={() => setIsDialogueOpen(true)}
        />

        {/* Conditional Screen Rendering */}
        {selectedGrievance ? (
          <GrievanceDetailView
            grievance={selectedGrievance}
            onBack={() => setSelectedGrievance(null)}
            onUpdateStatus={handleUpdateStatus}
            onRecallFromPolice={handleRecallSingle}
            biasConfig={biasConfig}
          />
        ) : activeTab === 'dashboard' ? (
          <TriageDashboardView
            grievances={grievances}
            biasConfig={biasConfig}
            onSelectGrievance={(g) => setSelectedGrievance(g)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onRecallPoliceBatch={handleBatchRecallAll}
          />
        ) : activeTab === 'triage_queue' ? (
          <TriageQueueView
            grievances={grievances}
            onSelectGrievance={(g) => setSelectedGrievance(g)}
            onRecallPoliceBatch={handleBatchRecallAll}
            onRecallSingle={handleRecallSingle}
          />
        ) : activeTab === 'war_room' ? (
          <BiasAuditWarRoom
            grievances={grievances}
            biasConfig={biasConfig}
            setBiasConfig={setBiasConfig}
            onBatchRecallAll={handleBatchRecallAll}
            onOpenDialogue={() => setIsDialogueOpen(true)}
            onSelectGrievance={(g) => setSelectedGrievance(g)}
          />
        ) : activeTab === 'new_grievance' ? (
          <SubmitGrievanceView
            onSubmit={handleSubmitGrievance}
            biasConfig={biasConfig}
            onSelectGrievanceToView={(g) => setSelectedGrievance(g)}
          />
        ) : activeTab === 'analytics' ? (
          <AnalyticsView grievances={grievances} biasConfig={biasConfig} />
        ) : activeTab === 'routing' ? (
          <DeptRoutingView grievances={grievances} />
        ) : null}
      </main>

      {/* Student Union Dialogue Modal */}
      <StudentUnionDialogue
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        demands={demands}
        onFulfillDemand={handleFulfillDemand}
        protestTension={protestTension}
        grievances={grievances}
        biasConfig={biasConfig}
      />

      {/* Model Calibration Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        biasConfig={biasConfig}
        setBiasConfig={setBiasConfig}
      />

      {/* System Logs Telemetry Modal */}
      <SystemLogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={logs}
      />
    </div>
  );
}
export default App;
