'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';
import { DashboardStats } from '@/components/DashboardStats';
import { InboxModule } from '@/components/InboxModule';
import { ConflictDetectorModule } from '@/components/ConflictDetectorModule';
import { ActionPlannerModule } from '@/components/ActionPlannerModule';
import { RescueModeModal } from '@/components/RescueModeModal';
import { AddDeadlineModal } from '@/components/AddDeadlineModal';
import { SmartIngestModal } from '@/components/SmartIngestModal';
import { TaskDetailsDrawer } from '@/components/TaskDetailsDrawer';
import { AddFocusBlockModal } from '@/components/AddFocusBlockModal';
import { Deadline, DailyActionItem, ConflictCluster, TaskStatus } from '@/types';
import {
  Inbox,
  AlertTriangle,
  CalendarCheck,
  GraduationCap,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [actionPlan, setActionPlan] = useState<DailyActionItem[]>([]);
  const [conflicts, setConflicts] = useState<ConflictCluster[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modals & Drawer State
  const [rescueModalOpen, setRescueModalOpen] = useState(false);
  const [rescueModeActive, setRescueModeActive] = useState(false);
  const [addDeadlineOpen, setAddDeadlineOpen] = useState(false);
  const [smartIngestOpen, setSmartIngestOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Deadline | null>(null);
  const [addFocusBlockOpen, setAddFocusBlockOpen] = useState(false);
  const [focusBlockPreselectId, setFocusBlockPreselectId] = useState<string | undefined>();

  // Active Tab: 'all' | 'inbox' | 'conflicts' | 'planner'
  const [activeTab, setActiveTab] = useState<'all' | 'inbox' | 'conflicts' | 'planner'>('all');

  // Load all application state
  const loadData = useCallback(async () => {
    try {
      const [deadlinesRes, actionPlanRes, conflictsRes] = await Promise.all([
        fetch('/api/deadlines'),
        fetch('/api/action-plan'),
        fetch('/api/conflicts'),
      ]);

      if (deadlinesRes.ok) {
        const d = await deadlinesRes.json();
        setDeadlines(d.deadlines || []);
      }
      if (actionPlanRes.ok) {
        const a = await actionPlanRes.json();
        setActionPlan(a.actionPlan || []);
      }
      if (conflictsRes.ok) {
        const c = await conflictsRes.json();
        setConflicts(c.conflicts || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  // Handlers
  const handleToggleActionItem = async (id: string, currentState: boolean) => {
    try {
      setActionPlan((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_completed: !currentState } : item))
      );

      const res = await fetch(`/api/action-plan/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !currentState }),
      });

      if (!res.ok) {
        loadData();
      }
    } catch (e) {
      loadData();
    }
  };

  const handleDeleteActionItem = async (id: string) => {
    try {
      setActionPlan((prev) => prev.filter((item) => item.id !== id));
      await fetch(`/api/action-plan/${id}`, { method: 'DELETE' });
    } catch (e) {
      loadData();
    }
  };

  const handleToggleTaskStatus = async (task: Deadline) => {
    const nextStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      setDeadlines((prev) =>
        prev.map((d) => (d.id === task.id ? { ...d, status: nextStatus } : d))
      );
      await fetch(`/api/deadlines/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      loadData();
    } catch (e) {
      loadData();
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      setDeadlines((prev) =>
        prev.map((d) => (d.id === taskId ? { ...d, status } : d))
      );
      if (selectedTask?.id === taskId) {
        setSelectedTask((prev) => (prev ? { ...prev, status } : null));
      }
      await fetch(`/api/deadlines/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (e) {
      loadData();
    }
  };

  const handleDeleteDeadline = async (taskId: string) => {
    try {
      setDeadlines((prev) => prev.filter((d) => d.id !== taskId));
      await fetch(`/api/deadlines/${taskId}`, { method: 'DELETE' });
      loadData();
    } catch (e) {
      loadData();
    }
  };

  const handleScheduleForToday = (task: Deadline) => {
    setFocusBlockPreselectId(task.id);
    setAddFocusBlockOpen(true);
  };

  const handleApplyRescuePlan = async () => {
    try {
      const res = await fetch('/api/rescue-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setRescueModeActive(true);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading || (!user && loadingData)) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-600">Initializing DeadlineOS Classroom Workspace...</p>
      </div>
    );
  }

  const highRiskDeadlines = deadlines.filter((d) => d.risk_score === 'High' && d.status !== 'Completed');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        rescueModeActive={rescueModeActive}
        onToggleRescueMode={() => setRescueModalOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome & Philosophy Header - Google Classroom Style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                ACTIVE SEMESTER
              </span>
              <span className="text-xs font-medium text-slate-500">
                {user?.college_name || 'Academic Command Center'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              Welcome back, {user?.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              &ldquo;Existing platforms tell students what exists. DeadlineOS helps you decide what to do next.&rdquo;
            </p>
          </div>

          {/* View Mode Tab Filters with Google Material Pills */}
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs self-start md:self-auto text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Command Overview
            </button>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 ${
                activeTab === 'inbox'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Inbox className="h-3.5 w-3.5" />
              <span>Smart Inbox</span>
            </button>
            <button
              onClick={() => setActiveTab('conflicts')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 ${
                activeTab === 'conflicts'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Risk & Conflicts</span>
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 ${
                activeTab === 'planner'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Action Planner</span>
            </button>
          </div>
        </div>

        {/* Dashboard Top Overview Stats */}
        <DashboardStats
          deadlines={deadlines}
          actionPlan={actionPlan}
          conflicts={conflicts}
          onOpenRescueMode={() => setRescueModalOpen(true)}
        />

        {/* Workspace Modules */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {/* Top Grid: Conflict Detector + Action Planner Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ConflictDetectorModule
                  conflicts={conflicts}
                  highRiskDeadlines={highRiskDeadlines}
                  onOpenRescueMode={() => setRescueModalOpen(true)}
                  onSelectTask={(task) => setSelectedTask(task)}
                />
              </div>

              <div className="lg:col-span-5">
                <ActionPlannerModule
                  actionPlan={actionPlan}
                  deadlines={deadlines}
                  onToggleComplete={handleToggleActionItem}
                  onDeleteItem={handleDeleteActionItem}
                  onOpenAddBlockModal={() => {
                    setFocusBlockPreselectId(undefined);
                    setAddFocusBlockOpen(true);
                  }}
                  onOpenRescueMode={() => setRescueModalOpen(true)}
                  rescueModeActive={rescueModeActive}
                />
              </div>
            </div>

            {/* Smart Academic Inbox Feed */}
            <InboxModule
              deadlines={deadlines}
              onSelectTask={(task) => setSelectedTask(task)}
              onOpenAddModal={() => setAddDeadlineOpen(true)}
              onOpenSmartIngest={() => setSmartIngestOpen(true)}
              onScheduleForToday={handleScheduleForToday}
              onToggleStatus={handleToggleTaskStatus}
            />
          </div>
        )}

        {activeTab === 'inbox' && (
          <InboxModule
            deadlines={deadlines}
            onSelectTask={(task) => setSelectedTask(task)}
            onOpenAddModal={() => setAddDeadlineOpen(true)}
            onOpenSmartIngest={() => setSmartIngestOpen(true)}
            onScheduleForToday={handleScheduleForToday}
            onToggleStatus={handleToggleTaskStatus}
          />
        )}

        {activeTab === 'conflicts' && (
          <ConflictDetectorModule
            conflicts={conflicts}
            highRiskDeadlines={highRiskDeadlines}
            onOpenRescueMode={() => setRescueModalOpen(true)}
            onSelectTask={(task) => setSelectedTask(task)}
          />
        )}

        {activeTab === 'planner' && (
          <ActionPlannerModule
            actionPlan={actionPlan}
            deadlines={deadlines}
            onToggleComplete={handleToggleActionItem}
            onDeleteItem={handleDeleteActionItem}
            onOpenAddBlockModal={() => {
              setFocusBlockPreselectId(undefined);
              setAddFocusBlockOpen(true);
            }}
            onOpenRescueMode={() => setRescueModalOpen(true)}
            rescueModeActive={rescueModeActive}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">DeadlineOS</span>
            <span>•</span>
            <span>Google Classroom Aesthetic</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500 font-medium">
            <span className="text-emerald-600 font-bold">● Google Classroom</span>
            <span>•</span>
            <span className="text-green-600 font-bold">WhatsApp</span>
            <span>•</span>
            <span className="text-blue-600 font-bold">Gmail</span>
            <span>•</span>
            <span className="text-purple-600 font-bold">Canvas LMS</span>
            <span>•</span>
            <span className="text-rose-600 font-bold">PDF</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <RescueModeModal
        isOpen={rescueModalOpen}
        onClose={() => setRescueModalOpen(false)}
        onApplyRescuePlan={handleApplyRescuePlan}
      />

      <AddDeadlineModal
        isOpen={addDeadlineOpen}
        onClose={() => setAddDeadlineOpen(false)}
        onAdded={loadData}
      />

      <SmartIngestModal
        isOpen={smartIngestOpen}
        onClose={() => setSmartIngestOpen(false)}
        onIngested={loadData}
      />

      <TaskDetailsDrawer
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdateStatus={handleUpdateTaskStatus}
        onDeleteTask={handleDeleteDeadline}
        onScheduleForToday={handleScheduleForToday}
      />

      <AddFocusBlockModal
        isOpen={addFocusBlockOpen}
        onClose={() => setAddFocusBlockOpen(false)}
        deadlines={deadlines}
        preselectedTaskId={focusBlockPreselectId}
        onBlockAdded={loadData}
      />
    </div>
  );
}
