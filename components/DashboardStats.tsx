'use client';

import React from 'react';
import { Deadline, DailyActionItem, ConflictCluster } from '@/types';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Flame,
  Zap,
  Target,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';

interface DashboardStatsProps {
  deadlines: Deadline[];
  actionPlan: DailyActionItem[];
  conflicts: ConflictCluster[];
  onOpenRescueMode: () => void;
}

export function DashboardStats({
  deadlines,
  actionPlan,
  conflicts,
  onOpenRescueMode,
}: DashboardStatsProps) {
  const activeDeadlines = deadlines.filter((d) => d.status !== 'Completed');
  const highRiskCount = activeDeadlines.filter((d) => d.risk_score === 'High').length;
  
  const completedFocusItems = actionPlan.filter((item) => item.is_completed).length;
  const totalFocusItems = actionPlan.length;
  const progressPercent = totalFocusItems > 0 ? Math.round((completedFocusItems / totalFocusItems) * 100) : 0;

  const totalRequiredHours = activeDeadlines.reduce((sum, d) => sum + d.estimated_hours, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Stat 1: Active Deadlines (Google Classroom Blue) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Deadlines
          </span>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs group-hover:scale-105 transition">
            <Target className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">{activeDeadlines.length}</span>
          <span className="text-xs text-slate-500 font-medium">pending submissions</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
          <Clock className="h-3.5 w-3.5 mr-1 text-blue-600" />
          <span>{totalRequiredHours.toFixed(1)} hrs total required effort</span>
        </div>
      </div>

      {/* Stat 2: High Risk Warnings (Google Red) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            High Risk Alerts
          </span>
          <div
            className={`p-2.5 rounded-xl border shadow-2xs group-hover:scale-105 transition ${
              highRiskCount > 0
                ? 'bg-red-50 text-red-600 border-red-100'
                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}
          >
            <Flame className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span
            className={`text-3xl font-extrabold ${
              highRiskCount > 0 ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {highRiskCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {highRiskCount > 0 ? 'critical proximity' : 'workload clear'}
          </span>
        </div>
        <div className="mt-3 flex items-center text-xs text-red-700 bg-red-50/80 px-2.5 py-1 rounded-lg border border-red-100 font-medium">
          <AlertTriangle className="h-3.5 w-3.5 mr-1 text-red-600" />
          <span>Due within 36 hours</span>
        </div>
      </div>

      {/* Stat 3: 48h Conflicts (Google Amber/Orange) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            48h Collisions
          </span>
          <div
            className={`p-2.5 rounded-xl border shadow-2xs group-hover:scale-105 transition ${
              conflicts.length > 0
                ? 'bg-amber-50 text-amber-600 border-amber-100'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span
            className={`text-3xl font-extrabold ${
              conflicts.length > 0 ? 'text-amber-600' : 'text-slate-700'
            }`}
          >
            {conflicts.length}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {conflicts.length > 0 ? 'overlap clusters' : 'smooth spacing'}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-100 font-medium">
          <span>Clashing windows</span>
          <button
            onClick={onOpenRescueMode}
            className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-0.5 underline"
          >
            <span>Rescue</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stat 4: Today's Action Plan Focus (Google Green) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Today's Progress
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs group-hover:scale-105 transition">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {completedFocusItems}
            <span className="text-lg text-slate-400 font-normal">/{totalFocusItems}</span>
          </span>
          <span className="text-xs text-emerald-700 font-bold">{progressPercent}% complete</span>
        </div>
        {/* Colorful progress bar */}
        <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
