'use client';

import Link from 'next/link';

import { ArrowRight, CheckCircle2, Server, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ServiceStatus = 'healthy' | 'unhealthy';

interface Service {
  name: string;
  status: ServiceStatus;
  lastSync: string;
}

// Mock data - will be replaced with real API calls
const serviceStats = {
  services: [
    { name: 'Movies', status: 'healthy' as const, lastSync: '2m' },
    { name: 'Shows', status: 'healthy' as const, lastSync: '5m' },
    { name: 'Music', status: 'unhealthy' as const, lastSync: '3h' },
    { name: 'Downloads', status: 'healthy' as const, lastSync: '1m' },
    { name: 'Indexers', status: 'healthy' as const, lastSync: '10m' },
    { name: 'Media Server', status: 'healthy' as const, lastSync: '1m' },
  ] satisfies Service[],
};

function ServicesCard() {
  const healthyCount = serviceStats.services.filter((s) => s.status === 'healthy').length;

  return (
    <Card className="gap-0 py-0 sm:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
            <Server className="size-4 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-sm">Services</CardTitle>
            <p className="text-xs text-muted-foreground">System health</p>
          </div>
        </div>
        <Badge variant={healthyCount === serviceStats.services.length ? 'secondary' : 'destructive'}>
          <CheckCircle2 className="size-3" />
          {healthyCount}/{serviceStats.services.length} healthy
        </Badge>
      </CardHeader>

      <Separator />

      <CardContent className="py-4">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {serviceStats.services.map((service) => (
            <Tooltip key={service.name}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'flex cursor-default flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors',
                    service.status === 'healthy'
                      ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                      : 'bg-red-500/10 hover:bg-red-500/15'
                  )}
                >
                  {service.status === 'healthy' ? (
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  ) : (
                    <XCircle className="size-4 text-red-400" />
                  )}
                  <span className="text-[10px] leading-tight">{service.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-medium">{service.name}</p>
                  <p className="text-muted-foreground">
                    {service.status === 'healthy' ? 'Operational' : 'Needs attention'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Last sync: {service.lastSync} ago</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="p-0">
        <Button variant="ghost" size="sm" className="w-full rounded-none rounded-b-xl" asChild>
          <Link href="/system/services">
            Manage services
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ServicesCard };
