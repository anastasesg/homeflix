'use client';

import { useEffect } from 'react';

import { init } from '@noriginmedia/norigin-spatial-navigation';

interface TvSpatialProviderProps {
  children: React.ReactNode;
}

function TvSpatialProvider({ children }: TvSpatialProviderProps) {
  useEffect(() => {
    init({
      debug: false,
      visualDebug: false,
    });
  }, []);

  return <>{children}</>;
}

export { TvSpatialProvider };
