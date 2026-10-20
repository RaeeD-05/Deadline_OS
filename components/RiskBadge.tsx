import React from 'react';
import { RiskScore } from '@/types';
import { Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function RiskBadge({ risk }: { risk: RiskScore }) {
  if (risk === 'High') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700 text-[11px] font-sans font-bold shadow-2xs">
        <Flame className="h-3 w-3 text-red-600" />
        <span>HIGH RISK</span>
      </span>
    );
  }

  if (risk === 'Medium') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 text-[11px] font-sans font-bold shadow-2xs">
        <AlertTriangle className="h-3 w-3 text-amber-600" />
        <span>MED RISK</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] font-sans font-bold shadow-2xs">
      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
      <span>LOW RISK</span>
    </span>
  );
}
