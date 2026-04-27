import type { Metadata } from 'next';

import { TvRailNav } from './_components/tv-rail-nav';
import { TvSpatialProvider } from './_components/tv-spatial-provider';

export const metadata: Metadata = {
  title: {
    default: 'Homeflix TV',
    template: '%s | Homeflix TV',
  },
};

type TvLayoutProps = React.PropsWithChildren;

export default function TvLayout({ children }: TvLayoutProps) {
  return (
    <TvSpatialProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        <TvRailNav />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </TvSpatialProvider>
  );
}
