// Individual tour segment card component
'use client';

import { useState } from 'react';
import { Edit, X, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { TourSegment } from '../types/tour';
import { StatusBadge } from '../ui/StatusBadge';
import { TourSummaryBar } from './TourSummaryBar';
import { StateRangeBadges } from './StateRangeBadges';

interface TourSegmentCardProps {
  segment: TourSegment;
  onEdit: (segmentId: string) => void;
  onDelete: (segmentId: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: (segmentId: string) => void;
}

export function TourSegmentCard({
  segment,
  onEdit,
  onDelete,
  isExpanded = false,
  onToggleExpand
}: TourSegmentCardProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this tour segment?')) {
      onDelete(segment.id);
    }
  };

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand(segment.id);
    }
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader
        className={`cursor-pointer ${onToggleExpand ? 'hover:bg-neutral-50' : ''}`}
        onClick={onToggleExpand ? handleToggleExpand : undefined}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-neutral-900">
                {segment.name}
              </h3>
              <StatusBadge status={segment.status} />
              <Badge
                variant="secondary"
                className={
                  segment.isPublic
                    ? 'bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/20'
                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                }
              >
                {segment.isPublic ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
            </div>

            <TourSummaryBar
              stateRanges={segment.stateRanges}
              description={segment.description}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(segment.id);
              }}
              className="hover:bg-[var(--color-french-blue)]/10 hover:text-[var(--color-french-blue)]"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
            {onToggleExpand && (
              <div className="ml-2">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="border-t border-neutral-200">
          <div className="mt-4">
            <StateRangeBadges stateRanges={segment.stateRanges} variant="detailed" />
          </div>
        </CardContent>
      )}
    </Card>
  );
}