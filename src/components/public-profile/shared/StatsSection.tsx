'use client';
import { Star } from 'lucide-react';
import { StatsProps } from '../types';

export default function StatsSection({ rating, reviewCount, additionalStats = [] }: StatsProps) {
  return (
    <section className="bg-neutral-50 border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center gap-12">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="text-2xl font-bold text-neutral-900">{rating}</span>
            <span className="text-neutral-600">({reviewCount} reviews)</span>
          </div>
          
          {/* Additional Stats */}
          {additionalStats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2">
              {stat.icon && <stat.icon className="w-5 h-5 text-neutral-600" />}
              <span className="text-lg font-semibold text-neutral-900">{stat.value}</span>
              <span className="text-neutral-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}