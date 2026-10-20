'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  GraduationCap,
  BookOpen,
} from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || 'Failed to sign in. Please verify your credentials.');
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setDemoLoading(true);
    await demoLogin();
    setDemoLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] text-slate-800">
      {/* Left Column: Academic Classroom Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-700 text-white overflow-hidden shadow-xl">
        {/* Decorative background circles */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-400/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Brand */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="h-11 w-11 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
            <GraduationCap className="h-7 w-7 text-emerald-600" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Deadline<span className="text-amber-300">OS</span>
          </span>
        </div>

        {/* Hero Narrative */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-emerald-100 mb-6 backdrop-blur-xs">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Google Classroom Connected Hub</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Existing platforms tell students what exists.{' '}
            <span className="text-amber-300 underline decoration-amber-400/60 decoration-wavy">
              DeadlineOS helps students decide what to do next.
            </span>
          </h1>

          <p className="text-emerald-50 text-base xl:text-lg mb-8 max-w-lg leading-relaxed font-normal">
            Consolidate Google Classroom, Gmail, WhatsApp class chats, College Portals, and Syllabus PDFs into a single, high-leverage daily action pipeline.
          </p>

          {/* Feature Showcase Grid - Google Classroom style cards */}
          <div className="space-y-3.5 max-w-md">
            <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-white text-emerald-700 shadow-xs">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Smart Academic Inbox</p>
                <p className="text-xs text-emerald-100">Unified auto-captured assignments with source tags and risk metrics.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-white text-red-600 shadow-xs">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Risk & Conflict Detector</p>
                <p className="text-xs text-emerald-100">Automated 48-hour collision detection and workload surge warnings.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-white text-blue-600 shadow-xs">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Personal Action Planner & Rescue Mode</p>
                <p className="text-xs text-emerald-100">Time-blocked daily study agendas with 1-click dynamic crisis triage.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-emerald-100/80 font-medium">
          <span>Trusted by students across STEM & Humanities</span>
          <span>Encrypted Session • Privacy First</span>
        </div>
      </div>

      {/* Right Column: Authentication Card in Clean White */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 p-2 flex items-center justify-center shadow-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              Deadline<span className="text-emerald-600">OS</span>
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Sign in to Classroom Hub</h2>
            <p className="text-slate-500 text-sm mt-1">Access your personalized academic command center.</p>
          </div>

          {/* Quick Demo Login Pill in Google Classroom Vibrant Blue */}
          <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-blue-950">1-Click Demo Student Access</p>
                <p className="text-xs text-blue-700 font-medium">alex.chen@mit.edu</p>
              </div>
            </div>
            <button
              onClick={handleDemoSignIn}
              disabled={demoLoading}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
            >
              <span>{demoLoading ? 'Logging in...' : 'Launch Demo'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200"></div>
            <span className="absolute px-3 bg-white text-xs text-slate-400 font-semibold uppercase tracking-wider">
              or credentials
            </span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                College / University Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-900 text-sm placeholder-slate-400 transition outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-900 text-sm placeholder-slate-400 transition outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 text-xs text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>Remember this workstation for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Classroom Hub</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Link to Signup */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              New to DeadlineOS?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 transition">
                Create Student Account & Onboard
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-2">Reset Password</h3>
            {forgotSubmitted ? (
              <div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  If an account exists for this email, we have dispatched a secure magic reset link to your university inbox.
                </p>
                <button
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSubmitted(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-500 mb-4">
                  Enter your university email address. We will send password reset instructions to your campus inbox.
                </p>
                <input
                  type="email"
                  placeholder="student@university.edu"
                  defaultValue={email}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 mb-4 outline-none focus:border-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setForgotSubmitted(true)}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
