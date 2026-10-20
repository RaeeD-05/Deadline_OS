'use client';

import React, { useState } from 'react';
import { Deadline, TaskStatus } from '@/types';
import { SourceBadge } from './SourceBadge';
import { RiskBadge } from './RiskBadge';
import { getCourseTheme } from '@/lib/courseColors';
import {
  X,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  Plus,
  CalendarPlus,
} from 'lucide-react';

interface TaskDetailsDrawerProps {
  task: Deadline | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onScheduleForToday: (task: Deadline) => void;
}

export function TaskDetailsDrawer({
  task,
  isOpen,
  onClose,
  onUpdateStatus,
  onDeleteTask,
  onScheduleForToday,
}: TaskDetailsDrawerProps) {
  const [subtasks, setSubtasks] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Review assignment requirements & grading rubric', done: true },
    { id: '2', text: 'Implement core functionality & pass basic test cases', done: false },
    { id: '3', text: 'Draft documentation, benchmarks & final PDF upload', done: false },
  ]);
  const [newSubtask, setNewSubtask] = useState('');
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !task) return null;

  const toggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, done: !st.done } : st))
    );
  };

  const addSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: Date.now().toString(), text: newSubtask.trim(), done: false },
    ]);
    setNewSubtask('');
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      setDeleting(true);
      await onDeleteTask(task.id);
      setDeleting(false);
      onClose();
    }
  };

  const formattedDue = new Date(task.due_date).toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const courseTheme = getCourseTheme(task.course_name);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${courseTheme.badgeBg} ${courseTheme.badgeText} ${courseTheme.badgeBorder}`}
            >
              {task.course_name}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 my-3">
            <SourceBadge source={task.source} />
            <RiskBadge risk={task.risk_score} />
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                task.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              STATUS: {task.status.toUpperCase()}
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{task.title}</h2>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 gap-3 my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">DUE DATE & TIME</span>
              <span className="text-slate-900 font-bold">{formattedDue}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-bold uppercase">ESTIMATED EFFORT</span>
              <span className="text-blue-700 font-bold">{task.estimated_hours} Hours</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 mb-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Submission Details & Rubric
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {task.description || 'No detailed instructions provided.'}
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-2 mb-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Action Steps & Deliverables
            </h3>
            <div className="space-y-1.5">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(st.id)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer text-xs transition"
                >
                  {st.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  )}
                  <span className={st.done ? 'line-through text-slate-400 font-normal' : 'text-slate-800 font-semibold'}>
                    {st.text}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={addSubtask} className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                placeholder="Add subtask step..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 text-white text-xs hover:bg-blue-700 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Status Quick Select */}
          <div className="space-y-1.5 mb-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Update Status
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(['Pending', 'In Progress', 'Completed'] as TaskStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(task.id, st)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                    task.status === st
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <button
            onClick={() => {
              onScheduleForToday(task);
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/25 transition flex items-center justify-center space-x-2"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>Schedule into Today's Action Plan</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition flex items-center justify-center space-x-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span>{deleting ? 'Removing...' : 'Delete Deadline'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
