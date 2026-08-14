import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  ShieldAlert, 
  Undo2, 
  Send, 
  CheckCircle2, 
  Clock, 
  Building, 
  ArrowRight,
  Sparkles,
  Download
} from 'lucide-react';
import { Grievance, CategoryType } from '../types';

interface TriageQueueViewProps {
  grievances: Grievance[];
  onSelectGrievance: (g: Grievance) => void;
  onRecallPoliceBatch: () => void;
  onRecallSingle: (id: string) => void;
}

export const TriageQueueView: React.FC<TriageQueueViewProps> = ({
  grievances,
  onSelectGrievance,
  onRecallPoliceBatch,
  onRecallSingle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'police' | 'high' | 'pending' | 'recalled' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const policeEscalated = grievances.filter((g) => g.status === 'Escalated to Police');

  const filtered = grievances.filter((g) => {
    // Tab filter
    if (selectedFilter === 'police' && g.status !== 'Escalated to Police') return false;
    if (selectedFilter === 'high' && g.urgencyScore < 85) return false;
    if (selectedFilter === 'pending' && g.status !== 'Pending Review') return false;
    if (selectedFilter === 'recalled' && g.status !== 'Recalled from Police') return false;
    if (selectedFilter === 'resolved' && g.status !== 'Resolved') return false;

    // Category filter
    if (categoryFilter !== 'all' && g.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = g.title.toLowerCase().includes(q);
      const matchDesc = g.description.toLowerCase().includes(q);
      const matchId = g.id.toLowerCase().includes(q);
      const matchGroup = g.studentGroup?.toLowerCase().includes(q);
      const matchDept = g.department.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchId && !matchGroup && !matchDept) return false;
    }

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((g) => g.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Title,Category,Department,Urgency,Priority,Status,Affiliation,IsBiasMisclassified']
        .concat(
          filtered.map(
            (g) =>
              `"${g.id}","${g.title.replace(/"/g, '""')}","${g.category}","${g.department}",${g.urgencyScore},"${g.priority}","${g.status}","${g.studentGroup}",${g.isMisclassifiedBias}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `autogrievance_triage_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif italic font-normal text-3xl text-[#FAFAFA] tracking-tight">
            Grievance Triage Queue
          </h1>
          <p className="text-sm text-white/60 mt-1 font-sans">
            Review incoming tickets, audit AI classifications, and execute department routing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {policeEscalated.length > 0 && (
            <button
              onClick={onRecallPoliceBatch}
              className="px-4 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] cursor-pointer flex items-center gap-1.5"
            >
              <Undo2 className="w-4 h-4" />
              Recall 50 Police Tickets
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded bg-white/5 border border-white/20 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-[#080808] rounded-lg p-5 border border-white/10 space-y-4">
        {/* Top Tab Bar */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-white/5">
          {[
            { id: 'all', label: `All Items (${grievances.length})` },
            {
              id: 'police',
              label: `Police Dispatched (${policeEscalated.length})`,
              badgeColor: 'bg-red-600 text-white',
            },
            { id: 'high', label: 'High Urgency (≥85)' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'recalled', label: 'Recalled & Safe' },
            { id: 'resolved', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`font-mono text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, keyword, title, submitter, or minority group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded px-4 pl-9 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#050505] border border-white/10 rounded px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-white/80 focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="facilities">Facilities</option>
              <option value="financial">Financial</option>
              <option value="social">Social/Cultural</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grievances List Table */}
      <div className="bg-[#080808] rounded-lg overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-white/10 bg-[#0A0A0A] font-mono text-white/50 uppercase text-[10px] tracking-[0.2em]">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="rounded bg-white/10 border-white/20 text-red-600 focus:ring-0"
                  />
                </th>
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Grievance Title & Summary</th>
                <th className="p-4">Category</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-white/40 font-mono">
                    No grievances match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => {
                  const isPolice = g.status === 'Escalated to Police';
                  const isSelected = selectedIds.includes(g.id);
                  return (
                    <tr
                      key={g.id}
                      className={`hover:bg-white/5 transition-colors ${
                        isPolice
                          ? 'bg-red-950/15'
                          : isSelected
                          ? 'bg-white/5'
                          : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(g.id)}
                          className="rounded bg-white/10 border-white/20 text-red-600"
                        />
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className="font-mono text-[10px] font-bold text-white/90 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                          {g.id}
                        </span>
                      </td>

                      <td className="p-4 max-w-md">
                        <div
                          onClick={() => onSelectGrievance(g)}
                          className="font-serif text-sm text-[#FAFAFA] hover:text-white cursor-pointer"
                        >
                          {g.title}
                        </div>
                        <div className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                          {g.description}
                        </div>
                        {g.studentGroup && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-white/60">
                            <span>{g.studentGroup}</span>
                            {g.isMisclassifiedBias && (
                              <span className="text-red-400 bg-red-950/40 border border-red-900/60 px-1.5 py-0.2 rounded font-bold uppercase text-[9px] tracking-wider">
                                False Threat
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="p-4 capitalize text-white/60 font-mono text-[11px]">
                        {g.category}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              g.urgencyScore >= 85 ? 'text-red-400' : 'text-white/80'
                            }`}
                          >
                            {g.urgencyScore}
                          </span>
                          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                g.urgencyScore >= 85 ? 'bg-red-600' : 'bg-white/70'
                              }`}
                              style={{ width: `${g.urgencyScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                            isPolice
                              ? 'bg-red-950/40 text-red-400 border border-red-900/60'
                              : 'bg-white/5 text-white/60 border border-white/10'
                          }`}
                        >
                          {g.department}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            g.status === 'Resolved'
                              ? 'bg-white/10 text-white'
                              : g.status === 'Escalated to Police'
                              ? 'bg-red-950 text-red-400 border border-red-900'
                              : g.status === 'Recalled from Police'
                              ? 'bg-white/10 text-white/90 border border-white/20'
                              : 'bg-white/5 text-white/50'
                          }`}
                        >
                          {g.status}
                        </span>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {isPolice && (
                            <button
                              onClick={() => onRecallSingle(g.id)}
                              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                              title="Recall police dispatch docket"
                            >
                              Recall
                            </button>
                          )}
                          <button
                            onClick={() => onSelectGrievance(g)}
                            className="px-2.5 py-1 rounded bg-white/5 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1"
                          >
                            View
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
