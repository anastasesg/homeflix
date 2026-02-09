'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ArrowRight, Check, Film, Tv, X } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type MediaType = 'movie' | 'show';

interface RequestItem {
  id: string;
  title: string;
  year: number;
  type: MediaType;
  requestedBy: string;
  requestedAt: string;
}

// Mock data - will be replaced with real API calls
const initialRequests: RequestItem[] = [
  { id: '1', title: 'Dune: Part Two', year: 2024, type: 'movie', requestedBy: 'Alex', requestedAt: '2h' },
  { id: '2', title: 'The Gentlemen', year: 2024, type: 'show', requestedBy: 'Jamie', requestedAt: '5h' },
  { id: '3', title: 'Civil War', year: 2024, type: 'movie', requestedBy: 'Sam', requestedAt: '1d' },
];

function PendingRequests() {
  const [requests, setRequests] = useState(initialRequests);

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDecline = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-pink-500/10">
            <Avatar size="sm">
              <AvatarFallback className="bg-transparent text-[10px] text-pink-400">?</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <CardTitle className="text-sm">Requests</CardTitle>
            <p className="text-xs text-muted-foreground">{requests.length} pending</p>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 py-3">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <p className="text-xs text-muted-foreground">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-1">
            {requests.map((request) => (
              <div
                key={request.id}
                className="group flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-secondary/50"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar size="sm" className="bg-muted">
                      <AvatarFallback className="text-[10px]">
                        {request.requestedBy.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {request.requestedBy} · {request.requestedAt} ago
                  </TooltipContent>
                </Tooltip>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    {request.type === 'movie' ? (
                      <Film className="size-3 text-muted-foreground" />
                    ) : (
                      <Tv className="size-3 text-muted-foreground" />
                    )}
                    <p className="truncate text-xs font-medium">{request.title}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{request.year}</p>
                </div>

                <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                        onClick={() => handleApprove(request.id)}
                      >
                        <Check className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Approve</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDecline(request.id)}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Decline</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="p-0">
        <Button variant="ghost" size="sm" className="w-full rounded-none rounded-b-xl" asChild>
          <Link href="/system/requests">
            Manage requests
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { PendingRequests };
