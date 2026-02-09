'use client';

import { useQuery } from '@tanstack/react-query';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

import { Query } from '@/components/query';
import { Button } from '@/components/ui/button';

import type { DataQueryOptions } from './types';

// ============================================================================
// Types
// ============================================================================

interface ExternalLink {
  id: string;
  url: string;
  label: string;
  icon: React.ElementType;
}

// ============================================================================
// Success
// ============================================================================

interface ExternalLinksSectionSuccessProps {
  links: ExternalLink[];
}

function ExternalLinksSectionSuccess({ links }: ExternalLinksSectionSuccessProps) {
  if (links.length === 0) return null;

  return (
    <section className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-6">
      <span className="text-xs uppercase tracking-wider text-muted-foreground/70">External Links</span>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Button key={link.id} variant="outline" size="sm" className="h-8 gap-1.5 border-border/40 text-xs" asChild>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <Icon className="size-3.5" />
              {link.label}
              <ExternalLinkIcon className="size-3" />
            </a>
          </Button>
        );
      })}
    </section>
  );
}

// ============================================================================
// Main
// ============================================================================

interface ExternalLinksSectionProps<T> {
  queryOptions: DataQueryOptions<T>;
  buildLinks: (data: T) => ExternalLink[];
}

function ExternalLinksSection<T>({ queryOptions, buildLinks }: ExternalLinksSectionProps<T>) {
  const query = useQuery(queryOptions);

  return (
    <Query
      result={query}
      callbacks={{
        loading: () => null,
        error: () => null,
        success: (data) => {
          const links = buildLinks(data);
          return <ExternalLinksSectionSuccess links={links} />;
        },
      }}
    />
  );
}

export type { ExternalLink, ExternalLinksSectionProps };
export { ExternalLinksSection };
