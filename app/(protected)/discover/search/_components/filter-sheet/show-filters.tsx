'use client';

import { useQuery } from '@tanstack/react-query';
import { Radio, Tv } from 'lucide-react';

import { cn } from '@/lib/utils';
import { showNetworksQueryOptions } from '@/options/queries/shows/metadata';

import { Checkbox } from '@/components/ui/checkbox';

import { FilterSection } from './index';

// ============================================================================
// Types
// ============================================================================

interface ShowFiltersProps {
  networks: number[];
  status: string[];
  onNetworksChange: (networks: number[]) => void;
  onStatusChange: (status: string[]) => void;
}

// ============================================================================
// Constants
// ============================================================================

const STATUS_OPTIONS = [
  { value: '0', label: 'Returning Series' },
  { value: '3', label: 'Ended' },
  { value: '2', label: 'In Production' },
  { value: '4', label: 'Cancelled' },
] as const;

// ============================================================================
// Main Component
// ============================================================================

function ShowFilters({ networks, status, onNetworksChange, onStatusChange }: ShowFiltersProps) {
  const networksQuery = useQuery(showNetworksQueryOptions());
  const availableNetworks = networksQuery.data ?? [];

  // Handlers
  const handleNetworkToggle = (networkId: number) => {
    onNetworksChange(networks.includes(networkId) ? networks.filter((n) => n !== networkId) : [...networks, networkId]);
  };

  const handleStatusToggle = (statusValue: string) => {
    onStatusChange(status.includes(statusValue) ? status.filter((s) => s !== statusValue) : [...status, statusValue]);
  };

  return (
    <>
      {/* ─── Networks ─── */}
      <FilterSection title="Networks" icon={Tv} badge={networks.length || undefined}>
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {availableNetworks.map((network) => (
            <label
              key={network.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
            >
              <Checkbox
                checked={networks.includes(network.id)}
                onCheckedChange={() => handleNetworkToggle(network.id)}
              />
              <span className="truncate">{network.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* ─── Show Status ─── */}
      <FilterSection title="Show Status" icon={Radio} badge={status.length || undefined}>
        <div className="flex flex-wrap gap-2 pt-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleStatusToggle(opt.value)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                status.includes(opt.value)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-muted/50 text-muted-foreground hover:bg-muted/50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </>
  );
}

export type { ShowFiltersProps };
export { ShowFilters };
