'use client';

import React from 'react';
import { Deadline, ConflictCluster } from '@/types';
import { SourceBadge } from './SourceBadge';
import { getCourseTheme } from '@/lib/courseColors';
import {
  AlertTriangle,
  Flame,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface ConflictDetectorModuleProps {
  conflicts: ConflictCluster[];
  highRiskDeadlines: Deadline[];
  onOpenRescueMode: () => void;
  onSelectTask: (task: Deadline) => void;
}

export function ConflictDetectorModule({
  conflicts,
  highRiskDeadlines,
  onOpenRescueMode,
  onSelectTask,
}: ConflictDetectorModuleProps) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Risk & Conflict Detector</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700">
                Collision Engine
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic detection of clustered deadlines and cognitive load bottlenecks.
          </p>
        </div>

        {conflicts.length > 0 && (
          <button
            onClick={onOpenRescueMode}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-xs shadow-red-500/25 transition"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Launch Rescue Triage</span>
          </button>
        )}
      </div>

      {/* Conflict Alert Cards (Clustered Deadlines within 48h) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span>48-Hour Collision Clusters ({conflicts.length})</span>
        </h3>

        {conflicts.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-xs text-emerald-800 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>No heavy clusters detected. Your upcoming deadlines have healthy study spacing!</span>
          </div>
        ) : (
          conflicts.map((conflict) => (
            <div
              key={conflict.id}
              className={`p-4 rounded-xl border transition ${
                conflict.severity === 'Critical'
                  ? 'bg-red-50/70 border-red-200 shadow-2xs'
                  : 'bg-amber-50/70 border-amber-200 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-2xs ${
                      conflict.severity === 'Critical'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {conflict.severity} Warning
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{conflict.title}</h4>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-red-600" />
                    <strong>{conflict.total_required_hours}h</strong> required effort
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-amber-800 font-bold">
                    ~{conflict.hours_until_first_due}h until 1st due
                  </span>
                </div>
              </div>

              {/* Clashing Deadlines Chips with Classroom color tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                {conflict.deadlines.map((d) => {
                  const courseTheme = getCourseTheme(d.course_name);
                  return (
                    <div
                      key={d.id}
                      onClick={() => onSelectTask(d)}
                      className="p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 cursor-pointer flex items-center justify-between transition shadow-2xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{d.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${courseTheme.badgeBg} ${courseTheme.badgeText} ${courseTheme.badgeBorder}`}
                          >
                            {d.course_name}
                          </span>
                          <SourceBadge source={d.source} size="sm" />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 flex-shrink-0">
                        {d.estimated_hours}h
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Actionable Advice & Rescue CTA */}
              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <p className="text-slate-700 text-xs font-medium flex-1">{conflict.recommendation}</p>
                <button
                  onClick={onOpenRescueMode}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-red-600 hover:text-red-700 transition underline"
                >
                  <span>Resolve with Rescue Mode</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* High Risk Assignments Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-red-600" />
          <span>High Risk Proximity Analysis ({highRiskDeadlines.length})</span>
        </h3>

        {highRiskDeadlines.length === 0 ? (
          <p className="text-xs text-slate-500">No high-risk assignments pending.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highRiskDeadlines.map((item) => {
              const due = new Date(item.due_date);
              const now = new Date();
              const hoursLeft = Math.max(0, Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60)));
              const courseTheme = getCourseTheme(item.course_name);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectTask(item)}
                  className="p-3.5 rounded-xl bg-white border border-red-200 hover:border-red-300 cursor-pointer transition space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${courseTheme.badgeBg} ${courseTheme.badgeText} ${courseTheme.badgeBorder}`}
                    >
                      {item.course_name}
                    </span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full border border-red-300">
                      {hoursLeft}H REMAINING
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>

                  {/* Warning Tags with vibrant Google colors */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                      Critical Proximity
                    </span>
                    {item.estimated_hours >= 4 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        Heavy Effort ({item.estimated_hours}h)
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      Rubric Priority
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
