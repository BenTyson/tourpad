import React from 'react';
import { Card } from '@/components/ui/Card';
import { StatCardProps } from './types';

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  ...props
}: StatCardProps) {
  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow" {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && <div className="text-[var(--color-french-blue)]">{icon}</div>}
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
}