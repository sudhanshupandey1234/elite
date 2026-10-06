import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeStatus =
  | 'PAID'
  | 'PENDING'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'PUBLISHED'
  | 'DRAFT'
  | 'ARCHIVED'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'OPEN'
  | 'CLOSED'
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL'
  | 'WON'
  | 'LOST'
  | 'ORDER_RECEIVED'
  | 'PROCESSING'
  | 'IN_DEVELOPMENT'
  | 'QUALITY_CHECK'
  | 'READY'
  | 'COMPLETED'
  | 'SUBMITTED'
  | 'REVIEWING'
  | 'INTERVIEW'
  | 'OFFERED'
  | 'REJECTED'
  | 'PRESENT'
  | 'ABSENT'
  | 'LEAVE'
  | 'HALF_DAY'
  | 'TODO'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | string;

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const normStatus = (status || '').toUpperCase();

  const getStyle = () => {
    switch (normStatus) {
      // Green / Positive
      case 'PAID':
      case 'PUBLISHED':
      case 'ACTIVE':
      case 'COMPLETED':
      case 'WON':
      case 'PRESENT':
      case 'OFFERED':
      case 'SUCCESS':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500',
        };

      // Amber / Warning / In Progress
      case 'PENDING':
      case 'PROCESSING':
      case 'IN_DEVELOPMENT':
      case 'QUALITY_CHECK':
      case 'IN_PROGRESS':
      case 'REVIEWING':
      case 'INTERVIEW':
      case 'PROPOSAL':
      case 'QUALIFIED':
      case 'HALF_DAY':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
        };

      // Blue / Info
      case 'ORDER_RECEIVED':
      case 'READY':
      case 'NEW':
      case 'OPEN':
      case 'SUBMITTED':
      case 'CONTACTED':
      case 'LEAVE':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          dot: 'bg-blue-500',
        };

      // Rose / Danger / Negative
      case 'OVERDUE':
      case 'CANCELLED':
      case 'REJECTED':
      case 'LOST':
      case 'ABSENT':
      case 'TERMINATED':
      case 'FAILED':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500',
        };

      // Gray / Neutral / Draft
      case 'DRAFT':
      case 'ARCHIVED':
      case 'INACTIVE':
      case 'CLOSED':
      case 'TODO':
      default:
        return {
          bg: 'bg-slate-100 border-slate-200 text-slate-700',
          dot: 'bg-slate-400',
        };
    }
  };

  const style = getStyle();
  const displayLabel = label || status.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide uppercase',
        style.bg,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', style.dot)} />
      <span>{displayLabel}</span>
    </span>
  );
}
