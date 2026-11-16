import React from 'react';
import { formatCentsGHC } from '../utils/revenue';
import { TrendingUp } from './Icons';

interface RevenueCardProps {
  title?: string;
  totalCents: number;
  subtitle?: string;
  badgeText?: string;
  isToday?: boolean;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  title = 'Daily Gross Revenue',
  totalCents,
  subtitle = "Gross revenue generated today",
  badgeText = 'GH₵ Cedis',
  isToday = true,
}) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between transition-all hover:shadow-md">
    <div className="flex items-start justify-between">
      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs font-black text-xl">
        <span>GH₵</span>
      </div>
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
        <TrendingUp className="w-3 h-3 text-emerald-600" />
        <span>{badgeText}</span>
      </span>
    </div>
    <div className="mt-4">
      <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        {formatCentsGHC(totalCents)}
      </div>
      <p className="text-xs font-semibold text-slate-500 mt-1">
        {title}
      </p>
      {subtitle && (
        <p className="text-[11px] font-medium text-emerald-600 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);
