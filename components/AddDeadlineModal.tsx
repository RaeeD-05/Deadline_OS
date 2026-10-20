'use client';

import React, { useState } from 'react';
import { DeadlineSource, RiskScore } from '@/types';
import { RiskBadge } from './RiskBadge';
import {
  X,
  Plus,
} from 'lucide-react';

interface AddDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => Promise<void>;
}

const SOURCES: DeadlineSource[] = [
  'Google Classroom',
  'WhatsApp',
  'Email',
  'Portal',
  'PDF',
];

export function AddDeadlineModal({ isOpen, onClose, onAdded }: AddDeadlineModalProps) {
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [source, setSource] = useState<DeadlineSource>('Google Classroom');
  
  const defaultDue = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const [dueDate, setDueDate] = useState(defaultDue);
  const [estimatedHours, setEstimatedHours] = useState(3.5);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const computeLiveRisk = (): RiskScore => {
    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const hoursLeft = Math.max(0, (due - now) / (1000 * 60 * 60));

    if (hoursLeft <= 36 || (hoursLeft <= 72 && estimatedHours >= 5)) {
      return 'High';
    }
    if (hoursLeft <= 96 || estimatedHours >= 4) {
      return 'Medium';
    }
    return 'Low';
  };

  const liveRisk = computeLiveRisk();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !courseName.trim() || !dueDate) {
      setError('Title, Course Name, and Due Date are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          course_name: courseName.trim(),
          source,
          due_date: new Date(dueDate).toISOString(),
          estimated_hours: Number(estimatedHours),
          description: description.trim(),
          risk_score: liveRisk,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await onAdded();
        onClose();
        setTitle('');
        setCourseName('');
        setDescription('');
      } else {
        setError(data.error || 'Failed to save deadline.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Add New Deadline</h2>
            <p className="text-xs text-slate-500">Capture an assignment manually into Classroom Hub.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Systems Lab 4: Two-Phase Commit"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Identifier
              </label>
              <input
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. CS451: Dist Systems"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Originating Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as DeadlineSource)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Due Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Hours: <span className="text-blue-600 font-bold">{estimatedHours} hrs</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseFloat(e.target.value))}
                className="w-full mt-2 accent-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description / Rubric Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste instructions, submission requirements, or group member details..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
            />
          </div>

          {/* Dynamic Risk Preview Banner in Google light colors */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-700 font-bold block text-xs">Calculated Risk Score:</span>
              <span className="text-[11px] text-slate-500">
                Determined by due date proximity and effort ratio
              </span>
            </div>
            <RiskBadge risk={liveRisk} />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/25 transition flex items-center space-x-1.5"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Save to Classroom Hub</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
