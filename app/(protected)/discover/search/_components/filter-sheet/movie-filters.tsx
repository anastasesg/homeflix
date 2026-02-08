'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Shield, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { movieCertificationsQueryOptions } from '@/options/queries/movies/metadata';
import { peopleSearchQueryOptions } from '@/options/queries/search';

import { FilterSection } from './index';
import { SearchSelect } from './search-select';

// ============================================================================
// Types
// ============================================================================

interface MovieFiltersProps {
  certifications: string[];
  cast: number[];
  crew: number[];
  onCertificationsChange: (certs: string[]) => void;
  onCastChange: (cast: number[]) => void;
  onCrewChange: (crew: number[]) => void;
}

// ============================================================================
// Main Component
// ============================================================================

function MovieFilters({
  certifications,
  cast,
  crew,
  onCertificationsChange,
  onCastChange,
  onCrewChange,
}: MovieFiltersProps) {
  const certificationsQuery = useQuery(movieCertificationsQueryOptions());
  const availableCertifications = certificationsQuery.data ?? [];

  // Label tracking for SearchSelect
  const [castLabels, setCastLabels] = useState<Map<number, string>>(new Map());
  const [crewLabels, setCrewLabels] = useState<Map<number, string>>(new Map());

  // Handlers
  const handleCertToggle = (cert: string) => {
    onCertificationsChange(
      certifications.includes(cert) ? certifications.filter((c) => c !== cert) : [...certifications, cert]
    );
  };

  const handleCastChange = (ids: number[], labels: Map<number, string>) => {
    setCastLabels(labels);
    onCastChange(ids);
  };

  const handleCrewChange = (ids: number[], labels: Map<number, string>) => {
    setCrewLabels(labels);
    onCrewChange(ids);
  };

  return (
    <>
      {/* ─── Content Rating ─── */}
      <FilterSection title="Content Rating" icon={Shield} badge={certifications.length || undefined}>
        <div className="flex flex-wrap gap-2 pt-1">
          {availableCertifications.map((cert) => (
            <button
              key={cert.certification}
              type="button"
              onClick={() => handleCertToggle(cert.certification)}
              title={cert.meaning}
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                certifications.includes(cert.certification)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-muted/50 text-muted-foreground hover:bg-muted/50'
              )}
            >
              {cert.certification}
            </button>
          ))}
          {availableCertifications.length === 0 && <p className="text-xs text-muted-foreground">Loading...</p>}
        </div>
      </FilterSection>

      {/* ─── Cast ─── */}
      <FilterSection title="Cast" icon={Users} badge={cast.length || undefined}>
        <div className="pt-1">
          <SearchSelect
            searchQueryFn={(q) => peopleSearchQueryOptions(q)}
            mapResults={(data) => {
              const items = data as Array<{ id: number; name: string; department: string }>;
              return items?.map((p) => ({ id: p.id, name: p.name, detail: p.department })) ?? [];
            }}
            selected={cast}
            selectedLabels={castLabels}
            onChange={handleCastChange}
            placeholder="Search cast members..."
          />
        </div>
      </FilterSection>

      {/* ─── Crew ─── */}
      <FilterSection title="Crew" icon={Users} badge={crew.length || undefined}>
        <div className="pt-1">
          <SearchSelect
            searchQueryFn={(q) => peopleSearchQueryOptions(q)}
            mapResults={(data) => {
              const items = data as Array<{ id: number; name: string; department: string }>;
              return items?.map((p) => ({ id: p.id, name: p.name, detail: p.department })) ?? [];
            }}
            selected={crew}
            selectedLabels={crewLabels}
            onChange={handleCrewChange}
            placeholder="Search crew members..."
          />
        </div>
      </FilterSection>
    </>
  );
}

export type { MovieFiltersProps };
export { MovieFilters };
