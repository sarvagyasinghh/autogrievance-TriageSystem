import React from 'react';
import { Building2, School, Landmark, Users2, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Grievance } from '../types';

interface DeptRoutingViewProps {
  grievances: Grievance[];
  onSelectDepartmentFilter?: (deptName: string) => void;
}

export const DeptRoutingView: React.FC<DeptRoutingViewProps> = ({ grievances }) => {
  const departments = [
    {
      name: 'Title IX & Student Safety',
      head: 'Dr. Evelyn Harper',
      icon: Shield,
      sla: '< 2 Hours',
      activeTickets: grievances.filter((g) => g.department.includes('Title IX')).length,
      description: 'Investigates interpersonal safety, harassment allegations, and immediate student welfare concerns.',
      status: 'Normal Operations',
    },
    {
      name: 'Academic Affairs & Faculty Senate',
      head: 'Prof. Marcus Vance',
      icon: School,
      sla: '< 24 Hours',
      activeTickets: grievances.filter((g) => g.department.includes('Academic')).length,
      description: 'Handles instructor disputes, grade appeals, research lab issues, and curriculum feedback.',
      status: 'Normal Operations',
    },
    {
      name: 'Facilities Management & Custodial',
      head: 'Robert Rodriguez',
      icon: Building2,
      sla: '< 12 Hours',
      activeTickets: grievances.filter((g) => g.department.includes('Facilities')).length,
      description: 'Manages physical classroom repairs, dorm heating/cooling, lighting, and sound acoustic installations.',
      status: 'High Load',
    },
    {
      name: 'Dining Services & Accommodations',
      head: 'Amina Mansour',
      icon: Landmark,
      sla: '< 8 Hours',
      activeTickets: grievances.filter((g) => g.department.includes('Dining')).length,
      description: 'Supervises kosher, halal, vegan dietary stations, allergen labeling, and dining hall equipment.',
      status: 'Debiased Queue Active',
    },
    {
      name: 'Student Life & Multicultural Affairs',
      head: 'Maya Lin-Torres',
      icon: Users2,
      sla: '< 18 Hours',
      activeTickets: grievances.filter((g) => g.department.includes('Student Life') || g.department.includes('Diversity')).length,
      description: 'Coordinates student club space permits, flyer approvals, cultural festivals, and dialogue forums.',
      status: 'Normal Operations',
    },
    {
      name: 'Campus Police (Emergency Dispatch)',
      head: 'Chief Dennis Gallagher',
      icon: Shield,
      sla: 'Immediate (< 5 min)',
      activeTickets: grievances.filter((g) => g.status === 'Escalated to Police').length,
      description: 'Strictly reserved for genuine violent physical threats and active building emergencies.',
      status: grievances.filter((g) => g.status === 'Escalated to Police').length > 0 ? '50 Dispatches Under Review' : 'Standby / Secure',
      isPolice: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="font-serif italic font-normal text-3xl md:text-4xl text-[#FAFAFA] tracking-tight">
          Department Routing & SLA Taxonomy
        </h1>
        <p className="text-sm text-white/60 mt-1.5 max-w-3xl leading-relaxed font-sans">
          Configured routing targets and automated assignment pipelines across university divisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept, idx) => {
          const Icon = dept.icon;
          return (
            <div
              key={idx}
              className={`bg-[#080808] rounded-lg p-6 border transition-all space-y-4 ${
                dept.isPolice && dept.activeTickets > 0
                  ? 'border-red-900/60 bg-red-950/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${
                  dept.isPolice && dept.activeTickets > 0
                    ? 'bg-red-950/40 border border-red-900/60 text-red-400'
                    : 'bg-white/5 border border-white/10 text-white'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                  SLA: {dept.sla}
                </span>
              </div>

              <div>
                <h3 className="font-serif italic text-lg text-[#FAFAFA]">
                  {dept.name}
                </h3>
                <div className="text-xs font-mono text-white/50 mt-0.5">
                  Lead: {dept.head}
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed font-sans">
                {dept.description}
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-white/50">Active Tickets:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${
                  dept.isPolice && dept.activeTickets > 0
                    ? 'bg-red-950 text-red-400 border border-red-900'
                    : 'bg-white/5 text-white/80 border border-white/10'
                }`}>
                  {dept.activeTickets} Case{dept.activeTickets === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
