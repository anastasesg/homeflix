'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Star } from 'lucide-react';

import type { MovieReview } from '@/api/entities';
import { movieReviewsQueryOptions } from '@/options/queries/movies/detail';

import { SectionHeader } from '@/components/media/sections/section-header';
import { Query } from '@/components/query';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Utilities
// ============================================================================

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ============================================================================
// Sub-Components
// ============================================================================

interface ReviewCardProps {
  review: MovieReview;
}

function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border/10 bg-muted/10 p-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {review.authorAvatar ? (
            <Image src={review.authorAvatar} alt={review.author} fill className="object-cover" sizes="32px" />
          ) : (
            getInitials(review.author)
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground">{review.author}</p>
            {review.rating && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <span>{review.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className={`mt-2 text-sm leading-relaxed text-muted-foreground ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {review.content}
          </p>
          {review.content.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs font-medium text-amber-500/80 transition-colors hover:text-amber-500"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Loading
// ============================================================================

function ReviewsSectionLoading() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Success
// ============================================================================

interface ReviewsSectionContentProps {
  reviews: MovieReview[];
}

function ReviewsSectionContent({ reviews }: ReviewsSectionContentProps) {
  if (reviews.length === 0) return null;

  const visibleReviews = reviews.slice(0, 3);

  return (
    <section>
      <SectionHeader icon={MessageSquare} title="Reviews" count={reviews.length} />
      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface ReviewsSectionProps {
  tmdbId: number;
}

function ReviewsSection({ tmdbId }: ReviewsSectionProps) {
  const query = useQuery(movieReviewsQueryOptions(tmdbId));

  return (
    <Query
      result={query}
      callbacks={{
        loading: ReviewsSectionLoading,
        error: () => null,
        success: (reviews) => <ReviewsSectionContent reviews={reviews} />,
      }}
    />
  );
}

export type { ReviewsSectionProps };
export { ReviewsSection };
