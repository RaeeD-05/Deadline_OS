'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import {
  ShieldAlert,
  Clock,
  LogOut,
  Sun,
  Moon,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Layers,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  rescueModeActive: boolean;
  onToggleRescueMode: () => void;
}

export function Navbar({ rescueModeActive, onToggleRescueMode }: NavbarProps) {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & System Status - Google Classroom Styling */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            {/* Google Classroom Vibrant Multi-color Icon */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-blue-500 to-amber-500 p-0.5 flex items-center justify-center shadow-md">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-slate-800">
                  Deadline<span className="text-emerald-600">OS</span>
                </span>
                <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Classroom Hub
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Active Student Workspace</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Clock / Telemetry */}
        <div className="hidden md:flex items-center space-x-3 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
          <Clock className="h-3.5 w-3.5 text-blue-600" />
          <span>{currentDate}</span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-700 font-bold">{currentTime}</span>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center space-x-3">
          {/* Rescue Mode Button */}
          <button
            onClick={onToggleRescueMode}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs ${
              rescueModeActive
                ? 'bg-red-600 text-white shadow-md shadow-red-500/30 animate-pulse'
                : 'bg-red-50 hover:bg-red-100 border border-red-200 text-red-700'
            }`}
          >
            <ShieldAlert className={`h-4 w-4 ${rescueModeActive ? 'text-white' : 'text-red-600'}`} />
            <span>Rescue Mode</span>
            {rescueModeActive && (
              <span className="text-[10px] bg-white text-red-700 px-1.5 py-0.2 rounded-full font-extrabold">
                ENGAGED
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-blue-600" />}
          </button>

          {/* User Profile */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2.5 p-1 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                    {user.college_name || 'Student'}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setProfileOpen(false)}
                >
                  <div className="p-2.5 border-b border-slate-100 mb-2">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <span className="truncate">{user.college_name}</span>
                    </div>
                    {user.semester && (
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">
                        {user.semester}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => logout()}
                    className="w-full mt-1 flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
