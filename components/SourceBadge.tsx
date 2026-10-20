import React from 'react';
import { DeadlineSource } from '@/types';
import {
  FileText,
  Mail,
  MessageSquare,
  School,
  FileCode,
  GraduationCap,
} from 'lucide-react';

interface SourceBadgeProps {
  source: DeadlineSource;
  size?: 'sm' | 'md';
}

export function SourceBadge({ source, size = 'sm' }: SourceBadgeProps) {
  const getBadgeConfig = () => {
    switch (source) {
      case 'Google Classroom':
        return {
          icon: <GraduationCap className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />,
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold',
          label: 'Google Classroom',
        };
      case 'WhatsApp':
        return {
          icon: <MessageSquare className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />,
          bg: 'bg-green-50 border-green-200 text-green-700 font-semibold',
          label: 'WhatsApp',
        };
      case 'Email':
        return {
          icon: <Mail className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />,
          bg: 'bg-blue-50 border-blue-200 text-blue-700 font-semibold',
          label: 'Gmail / Email',
        };
      case 'Portal':
        return {
          icon: <School className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />,
          bg: 'bg-purple-50 border-purple-200 text-purple-700 font-semibold',
          label: 'Campus Portal',
        };
      case 'PDF':
        return {
          icon: <FileText className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />,
          bg: 'bg-rose-50 border-rose-200 text-rose-700 font-semibold',
          label: 'Syllabus PDF',
        };
      default:
        return {
          icon: <FileCode className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />,
          bg: 'bg-slate-100 border-slate-200 text-slate-700 font-semibold',
          label: source,
        };
    }
  };

  const { icon, bg, label } = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-sans shadow-2xs ${bg}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
}
