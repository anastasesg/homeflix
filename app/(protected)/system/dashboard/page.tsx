import { Card, CardContent } from '@/components/ui/card';

import { ActivityFeed } from './_components/activity-feed';
import { DownloadsCard } from './_components/downloads-card';
import { LibraryCard } from './_components/library-card';
import { PendingRequests } from './_components/pending-requests';
import { RecentlyAdded } from './_components/recently-added';
import { ServicesCard } from './_components/services-card';
import { UpcomingReleases } from './_components/upcoming-releases';

export default function Page() {
  return (
    <main className="flex flex-1 flex-col gap-4 sm:gap-6">
      {/* Main Content: Status cards + Activity sidebar */}
      <div className="grid min-h-[320px] gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
        {/* Activity Feed - Sidebar */}
        <Card className="gap-0 py-0 md:col-span-3 lg:col-span-2">
          <CardContent className="h-full p-4">
            <ActivityFeed />
          </CardContent>
        </Card>

        {/* Status Cards - Main content */}
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-3 lg:col-span-3">
          <DownloadsCard />
          <LibraryCard />
          <ServicesCard />
        </div>
      </div>

      {/* Upcoming & Requests Row */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <UpcomingReleases />
        <PendingRequests />
      </div>

      {/* Recently Added Carousel */}
      <Card className="gap-0 py-0">
        <CardContent className="p-4 sm:p-5">
          <RecentlyAdded />
        </CardContent>
      </Card>
    </main>
  );
}
