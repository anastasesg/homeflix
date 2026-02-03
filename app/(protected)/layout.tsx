import React from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { Header } from './_components/header';
import { Sidebar } from './_components/sidebar';

type LayoutProps = React.PropsWithChildren;

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
