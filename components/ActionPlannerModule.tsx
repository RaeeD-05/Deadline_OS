'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DailyActionItem, Deadline } from '@/types';
import { SourceBadge } from './SourceBadge';
import { getCourseTheme } from '@/lib/courseColors';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  ShieldAlert,
  Trash2,
  BookOpen,
} from 'lucide-react';

interface ActionPlannerModuleProps {
  actionPlan: DailyActionItem[];
  deadlines: Deadline[];
  onToggleComplete: (id: string, currentState: boolean) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onOpenAddBlockModal: () => void;
  onOpenRescueMode: () => void;
  rescueModeActive: boolean;
}

export function ActionPlannerModule({
  actionPlan,
  deadlines,
  onToggleComplete,
  onDeleteItem,
  onOpenAddBlockModal,
  onOpenRescueMode,
  rescueModeActive,
}: ActionPlannerModuleProps) {
  const [completingId, setCompletingId] = useState<string | null>(null);

  const handleToggle = async (item: DailyActionItem) => {
    setCompletingId(item.id);
    const newState = !item.is_completed;

    if (newState) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#137333', '#1a73e8', '#ea8600', '#d93025'],
        });
      } catch (e) {
        // Safe fallback
      }
    }

    await onToggleComplete(item.id, item.is_completed);
    setCompletingId(null);
  };

  const completedCount = actionPlan.filter((i) => i.is_completed).length;

  return (
    <section
      className={`rounded-2xl border p-6 shadow-sm transition-all duration-300 ${
        rescueModeActive
          ? 'bg-red-50/40 border-red-300'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Personal Action Planner</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                What Should I Do Today?
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured focus blocks mapped directly to your imminent course deliverables.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center space-x-2">
          {/* Rescue Mode Button */}
          <button
            onClick={onOpenRescueMode}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              rescueModeActive
                ? 'bg-red-600 text-white shadow-red-500/30'
                : 'bg-red-50 hover:bg-red-100 border border-red-200 text-red-700'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Rescue Mode</span>
          </button>

          <button
            onClick={onOpenAddBlockModal}
            className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs shadow-emerald-600/25"
          >
            <Plus className="h-4 w-4" />
            <span>Add Focus Block</span>
          </button>
        </div>
      </div>

      {/* Rescue Mode Active Banner */}
      {rescueModeActive && (
        <div className="my-3 p-3 rounded-xl bg-red-100/70 border border-red-300 flex items-center justify-between text-xs text-red-800">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-red-600 flex-shrink-0 animate-pulse" />
            <span>
              <strong>Emergency Triage Protocol Engaged.</strong> Study blocks dynamically prioritized by urgency ratio.
            </span>
          </div>
          <button
            onClick={onOpenRescueMode}
            className="text-xs font-bold underline hover:text-red-950 transition"
          >
            View Triage Report
          </button>
        </div>
      )}

      {/* Time-Blocked Agenda View */}
      <div className="space-y-3 mt-4">
        {actionPlan.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <CalendarCheck className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-semibold">No study sessions scheduled for today.</p>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Add Focus Block&quot; or use &quot;Plan Today&quot; from the Inbox above to lock in your work blocks.
            </p>
          </div>
        ) : (
          actionPlan.map((item) => {
            const isCompleted = item.is_completed;
            const linkedDeadline = item.task || deadlines.find((d) => d.id === item.task_id);
            const courseTheme = getCourseTheme(linkedDeadline?.course_name || 'General Study');

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 ${
                  courseTheme.borderAccent
                } ${
                  isCompleted
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Time Indicator + Checkbox + Details */}
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {/* Time Badge */}
                  <div className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-center font-sans">
                    <span className="text-xs font-bold text-slate-800 block">
                      {item.scheduled_time_start}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {item.scheduled_time_end}
                    </span>
                  </div>

                  {/* Complete Toggle */}
                  <button
                    onClick={() => handleToggle(item)}
                    disabled={completingId === item.id}
                    className="mt-1 flex-shrink-0 text-slate-400 hover:text-emerald-600 transition"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  {/* Task Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${courseTheme.badgeBg} ${courseTheme.badgeText} ${courseTheme.badgeBorder}`}
                      >
                        {linkedDeadline?.course_name || 'Academic Study Session'}
                      </span>
                      {linkedDeadline && <SourceBadge source={linkedDeadline.source} size="sm" />}
                    </div>

                    <h4
                      className={`text-sm font-bold ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {linkedDeadline?.title || 'Focused Deep Work Session'}
                    </h4>

                    {item.notes && (
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
                        <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                        <span>{item.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Pill & Delete Button */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 pl-12 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {isCompleted ? 'COMPLETED' : 'SCHEDULED'}
                  </span>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition"
                    title="Remove from Today's Schedule"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Summary */}
      {actionPlan.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            {completedCount} of {actionPlan.length} focus sessions accomplished
          </span>
          <span className="text-emerald-700 font-bold">
            {completedCount === actionPlan.length && actionPlan.length > 0
              ? '🎉 All daily goals crushed!'
              : '⚡ Keep momentum steady'}
          </span>
        </div>
      )}
    </section>
  );
}
