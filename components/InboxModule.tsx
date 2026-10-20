'use client';

import React, { useState } from 'react';
import { Deadline, DeadlineSource, TaskStatus } from '@/types';
import { SourceBadge } from './SourceBadge';
import { RiskBadge } from './RiskBadge';
import { getCourseTheme } from '@/lib/courseColors';
import {
  Plus,
  Sparkles,
  Search,
  Filter,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface InboxModuleProps {
  deadlines: Deadline[];
  onSelectTask: (task: Deadline) => void;
  onOpenAddModal: () => void;
  onOpenSmartIngest: () => void;
  onScheduleForToday: (task: Deadline) => void;
  onToggleStatus: (task: Deadline) => void;
}

const SOURCES: (DeadlineSource | 'All')[] = [
  'All',
  'Google Classroom',
  'WhatsApp',
  'Email',
  'Portal',
  'PDF',
];

export function InboxModule({
  deadlines,
  onSelectTask,
  onOpenAddModal,
  onOpenSmartIngest,
  onScheduleForToday,
  onToggleStatus,
}: InboxModuleProps) {
  const [selectedSource, setSelectedSource] = useState<DeadlineSource | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed'>('Active');
  const [searchQuery, setSearchQuery] = useState('');

  // Relative due time countdown
  const getRelativeDueTime = (dueDateStr: string) => {
    const now = new Date().getTime();
    const due = new Date(dueDateStr).getTime();
    const diffHours = (due - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return { text: 'Past Due', urgent: true };
    }
    if (diffHours <= 24) {
      return { text: `Due in ${Math.round(diffHours)} hrs`, urgent: true };
    }
    if (diffHours <= 48) {
      return { text: `Due in ${Math.round(diffHours)} hrs`, urgent: false };
    }
    const days = Math.round(diffHours / 24);
    return { text: `Due in ${days} days`, urgent: false };
  };

  const filteredDeadlines = deadlines.filter((d) => {
    if (selectedSource !== 'All' && d.source !== selectedSource) return false;
    if (statusFilter === 'Active' && d.status === 'Completed') return false;
    if (statusFilter === 'Completed' && d.status !== 'Completed') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        d.title.toLowerCase().includes(q) ||
        d.course_name.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
      {/* Module Header - Google Classroom Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Smart Academic Inbox</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Unified Feed
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auto-captured deliverables from Google Classroom, WhatsApp group chats, campus portals, and PDFs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenSmartIngest}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition shadow-2xs"
            title="Simulate pasting WhatsApp group message, email or syllabus text"
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>AI Smart Ingest</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs shadow-blue-500/25"
          >
            <Plus className="h-4 w-4" />
            <span>Add Deadline</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
        {/* Source Pills with Google Classroom colors */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {SOURCES.map((source) => (
            <button
              key={source}
              onClick={() => setSelectedSource(source)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition text-xs ${
                selectedSource === source
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {source}
            </button>
          ))}
        </div>

        {/* Search & Status Controls */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('Active')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'Active' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('Completed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'Completed' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Done
            </button>
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'All' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Feed List with vibrant Google Classroom left border and header chips */}
      <div className="space-y-3 pt-2">
        {filteredDeadlines.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-semibold">No deadlines found for this filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try switching to &quot;All&quot; or clearing your search.</p>
          </div>
        ) : (
          filteredDeadlines.map((task) => {
            const dueInfo = getRelativeDueTime(task.due_date);
            const isCompleted = task.status === 'Completed';
            const courseTheme = getCourseTheme(task.course_name);

            return (
              <div
                key={task.id}
                className={`group p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:shadow-md transition-all duration-200 border-l-4 ${
                  courseTheme.borderAccent
                } ${isCompleted ? 'opacity-60 bg-slate-50/60' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Checkbox + Course Theme Chip + Title */}
                  <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleStatus(task)}
                      className="mt-1 flex-shrink-0 text-slate-400 hover:text-emerald-600 transition"
                      title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Circle className="h-5 w-5 hover:text-blue-600" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${courseTheme.badgeBg} ${courseTheme.badgeText} ${courseTheme.badgeBorder}`}
                        >
                          {task.course_name}
                        </span>
                        <SourceBadge source={task.source} />
                        <RiskBadge risk={task.risk_score} />
                      </div>

                      <h3
                        onClick={() => onSelectTask(task)}
                        className={`text-sm font-bold text-slate-900 cursor-pointer hover:text-blue-600 transition ${
                          isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-1 mt-1 font-normal">
                        {task.description || 'No additional instructions provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Due Date + Estimated Effort + Actions */}
                  <div className="flex items-center justify-between sm:justify-end space-x-4 pl-9 sm:pl-0 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <div
                        className={`text-xs font-bold flex items-center justify-end gap-1 ${
                          dueInfo.urgent ? 'text-red-600' : 'text-slate-700'
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{dueInfo.text}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center justify-end gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>Est: {task.estimated_hours}h</span>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center space-x-1.5">
                      {!isCompleted && (
                        <button
                          onClick={() => onScheduleForToday(task)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition shadow-2xs"
                          title="Schedule a time block in Today's Action Planner"
                        >
                          Plan Today
                        </button>
                      )}
                      <button
                        onClick={() => onSelectTask(task)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                        title="View Full Task Details & Subtasks"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
