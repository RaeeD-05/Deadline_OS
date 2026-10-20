'use client';

import React, { useState } from 'react';
import { DeadlineSource } from '@/types';
import { SourceBadge } from './SourceBadge';
import { RiskBadge } from './RiskBadge';
import {
  Sparkles,
  X,
  MessageSquare,
  Mail,
  FileText,
  Check,
  Zap,
} from 'lucide-react';

interface SmartIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngested: () => Promise<void>;
}

const PRESETS = [
  {
    label: 'WhatsApp Class Group',
    source: 'WhatsApp' as DeadlineSource,
    icon: <MessageSquare className="h-3.5 w-3.5 text-green-600" />,
    text: `[CS320 Class Group] CR Rahul: Guys, Prof. Mehta just confirmed! Database Systems Project Milestone 2 submission is Friday at 11:59 PM on Portal. Include ER diagram + SQL DDL scripts. Estimated 5 hours.`,
  },
  {
    label: 'Faculty Broadcast Email',
    source: 'Email' as DeadlineSource,
    icon: <Mail className="h-3.5 w-3.5 text-blue-600" />,
    text: `From: prof.kearns@cs.university.edu
Subject: CS4771 Machine Learning Take-Home Project 3
Dear Class, the take-home project on Neural Network Backpropagation is due in 3 days. Please submit your Jupyter notebook and loss curves. Est: 6 hrs.`,
  },
  {
    label: 'Syllabus PDF Page',
    source: 'PDF' as DeadlineSource,
    icon: <FileText className="h-3.5 w-3.5 text-red-600" />,
    text: `Course Syllabus - CS350 Computer Security (PDF page 18).
Week 8 Assignment: Cryptography RSA & Diffie-Hellman Key Exchange Analysis.
Due Date: Tomorrow at 23:59. Estimated duration: 4.5 hours. Mandatory for course completion.`,
  },
];

export function SmartIngestModal({ isOpen, onClose, onIngested }: SmartIngestModalProps) {
  const [rawText, setRawText] = useState(PRESETS[0].text);
  const [sourceHint, setSourceHint] = useState<DeadlineSource>(PRESETS[0].source);
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: (typeof PRESETS)[0]) => {
    setRawText(preset.text);
    setSourceHint(preset.source);
    setParsedResult(null);
    setError(null);
  };

  const handleIngest = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/smart-ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_text: rawText,
          source_hint: sourceHint,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setParsedResult(data.parsed);
        await onIngested();
      } else {
        setError(data.error || 'Parsing failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shadow-2xs">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Smart Ingestion Engine
            </h2>
            <p className="text-xs text-slate-500">
              Extract deadlines from messy WhatsApp announcements, emails, or syllabus excerpts.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="mb-4">
          <span className="text-xs font-bold uppercase text-slate-500 block mb-1.5">
            Load Sample Scenario:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  rawText === preset.text
                    ? 'bg-purple-100/80 border-purple-300 text-purple-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {preset.icon}
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-bold text-slate-700">
            Raw Message / Notification Text
          </label>
          <textarea
            rows={4}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setParsedResult(null);
            }}
            placeholder="Paste any unformatted student text here..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white resize-none"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Parsed Result Display */}
        {parsedResult && (
          <div className="mb-4 p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-emerald-800 font-bold uppercase flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-600" /> Auto-Captured to Classroom Hub
              </span>
              <RiskBadge risk={parsedResult.risk_score} />
            </div>

            <p className="text-sm font-bold text-slate-900">{parsedResult.title}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-blue-700 font-bold">
                {parsedResult.course_name}
              </span>
              <SourceBadge source={parsedResult.source} size="sm" />
              <span className="text-xs text-slate-600 font-medium">
                Est: {parsedResult.estimated_hours}h
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            {parsedResult ? 'Close' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleIngest}
            disabled={loading || !rawText.trim()}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs shadow-purple-600/30 transition flex items-center space-x-2"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Parse & Capture to Inbox</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
