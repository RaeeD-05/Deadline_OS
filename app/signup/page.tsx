'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import {
  User as UserIcon,
  Mail,
  Lock,
  GraduationCap,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const COMMON_UNIVERSITIES = [
  'Massachusetts Institute of Technology (MIT)',
  'Stanford University',
  'UC Berkeley',
  'Carnegie Mellon University (CMU)',
  'Harvard University',
  'Georgia Tech',
  'University of Washington',
  'Indian Institute of Technology (IIT)',
  'National University of Singapore (NUS)',
  'University of Toronto',
  'Other / Custom College',
];

const COMMON_SEMESTERS = [
  'Semester 1 - Freshman Fall',
  'Semester 2 - Freshman Spring',
  'Semester 3 - Sophomore Fall',
  'Semester 4 - Sophomore Spring',
  'Semester 5 - Junior Fall',
  'Semester 6 - Junior Spring',
  'Semester 7 - Senior Fall',
  'Semester 8 - Senior Spring',
  'Graduate / Masters Year 1',
  'Graduate / Masters Year 2',
  'PhD Candidate',
];

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeName, setCollegeName] = useState(COMMON_UNIVERSITIES[0]);
  const [customCollege, setCustomCollege] = useState('');
  const [semester, setSemester] = useState(COMMON_SEMESTERS[5]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const finalCollege =
      collegeName === 'Other / Custom College' && customCollege.trim()
        ? customCollege.trim()
        : collegeName;

    const res = await signup({
      name: name.trim(),
      email: email.trim(),
      password,
      college_name: finalCollege,
      semester,
    });

    if (!res.success) {
      setError(res.error || 'Failed to create account.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] text-slate-800">
      {/* Left Column: Academic Classroom Persona */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 bg-gradient-to-br from-blue-700 via-indigo-700 to-emerald-600 text-white shadow-xl overflow-hidden">
        <div className="flex items-center space-x-3">
          <div className="h-11 w-11 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
            <GraduationCap className="h-7 w-7 text-blue-600" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Deadline<span className="text-amber-300">OS</span>
          </span>
        </div>

        <div className="my-auto py-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-blue-100 mb-6 backdrop-blur-xs">
            <BookOpen className="h-4 w-4 text-amber-300" />
            <span>Classroom Hub Onboarding</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white mb-4">
            Tame scattered coursework in 60 seconds.
          </h1>

          <p className="text-blue-100 text-sm leading-relaxed mb-6 font-normal">
            When deadlines collide across syllabi, college portals, and class WhatsApp chats, DeadlineOS coordinates your daily schedule so you always know your next high-impact move.
          </p>

          <div className="space-y-3 font-medium text-xs text-blue-50">
            <div className="flex items-center space-x-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Multi-Source Ingestion Engine (Classroom, WhatsApp, Portals, PDF)</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span>Cognitive Load & Collision Forecasting</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="h-2 w-2 rounded-full bg-red-400"></span>
              <span>Emergency Rescue Mode Dynamic Reorganizer</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-blue-100/70 font-medium">
          <span>Student Privacy First • Zero Advertising</span>
        </div>
      </div>

      {/* Right Column: Registration & Onboarding Form in Clean White */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 overflow-y-auto bg-white">
        <div className="w-full max-w-lg space-y-6 my-auto">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Create your Classroom Account
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Personalize your semester workspace and configure automated deadline tracking.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-900 text-sm placeholder-slate-400 transition outline-none"
                />
              </div>
            </div>

            {/* University Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                University Email Address
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

            {/* College & Semester Onboarding Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  College / University
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <select
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 text-xs transition outline-none"
                  >
                    {COMMON_UNIVERSITIES.map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Semester / Year
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 text-xs transition outline-none"
                  >
                    {COMMON_SEMESTERS.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {collegeName === 'Other / Custom College' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Custom College Name
                </label>
                <input
                  type="text"
                  required
                  value={customCollege}
                  onChange={(e) => setCustomCollege(e.target.value)}
                  placeholder="Enter your college or institution name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 text-sm placeholder-slate-400 transition outline-none"
                />
              </div>
            )}

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 text-sm placeholder-slate-400 transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 text-sm placeholder-slate-400 transition outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Classroom Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 transition">
                Sign in to Classroom Hub
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
