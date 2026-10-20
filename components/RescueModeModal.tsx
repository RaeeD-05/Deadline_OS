'use client';

import React, { useState, useEffect } from 'react';
import { RescuePlan } from '@/types';
import {
  ShieldAlert,
  Flame,
  Check,
  Clock,
  X,
  ArrowRight,
} from 'lucide-react';

interface RescueModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRescuePlan: () => Promise<void>;
}

export function RescueModeModal({
  isOpen,
  onClose,
  onApplyRescuePlan,
}: RescueModeModalProps) {
  const [plan, setPlan] = useState<RescuePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setAppliedSuccess(false);
      fetch('/api/rescue-mode')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPlan(data.plan);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = async () => {
    setApplying(true);
    await onApplyRescuePlan();
    setApplying(false);
    setAppliedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white border border-red-200 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-2xl bg-red-100 text-red-600 border border-red-200 shadow-2xs">
            <ShieldAlert className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Deadline Rescue Mode
              </h2>
              <span className="text-xs font-bold bg-red-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Emergency Triage
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated cognitive triage: re-prioritize active deliverables by urgency ratio.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="h-8 w-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-semibold">Computing urgency heuristics...</p>
          </div>
        ) : !plan ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Failed to compute rescue triage. Please retry.
          </div>
        ) : (
          <div className="space-y-5">
            {/* Triage Summary Banner */}
            <div className="p-4 rounded-xl bg-red-50/80 border border-red-200 text-xs">
              <p className="text-slate-800 font-semibold">{plan.summary}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs font-medium text-slate-600">
                <span>Total Focus Capacity: ~{plan.focus_capacity_hours} hrs</span>
                <span>•</span>
                <span className="text-amber-800 font-bold">Minimum Viable Submission Protocol</span>
              </div>
            </div>

            {/* Triaged Deliverables List */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-red-600" />
                <span>Heuristic Priority Tiers</span>
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {plan.triaged_tasks.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs ${
                      item.urgency_tier === 'Immediate (Do Now)'
                        ? 'bg-red-50/80 border-red-200'
                        : item.urgency_tier === 'Secondary (Do Next)'
                        ? 'bg-amber-50/80 border-amber-200'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.urgency_tier === 'Immediate (Do Now)'
                              ? 'bg-red-600 text-white'
                              : item.urgency_tier === 'Secondary (Do Next)'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.urgency_tier}
                        </span>
                        <span className="font-bold text-slate-900">
                          {item.deadline.course_name}
                        </span>
                      </div>
                      <p className="font-bold text-slate-800">{item.deadline.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{item.action_note}</p>
                    </div>

                    <div className="text-right sm:flex-shrink-0 text-xs font-bold text-slate-700">
                      <span>Allocate: {item.recommended_focus_hours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Emergency Study Blocks */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Generated Rescue Schedule (Tonight)</span>
              </h3>

              <div className="space-y-2">
                {plan.emergency_schedule.map((slot, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs shadow-2xs"
                  >
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex-shrink-0">
                      {slot.time_start} - {slot.time_end}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate">
                        {slot.course_name}: {slot.task_title}
                      </p>
                      <p className="text-xs text-blue-700 mt-0.5 font-medium">
                        {slot.focus_objective}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Dismiss
              </button>

              <button
                onClick={handleApply}
                disabled={applying || appliedSuccess}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/25 transition flex items-center justify-center space-x-2"
              >
                {applying ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : appliedSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Applied to Today's Agenda!</span>
                  </>
                ) : (
                  <>
                    <span>Apply Rescue Schedule to Today's Plan</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
