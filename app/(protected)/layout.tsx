import React from 'react';

import { BreadcrumbProvider } from '@/context';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { Header } from './_components/header';
import { Sidebar } from './_components/sidebar';

type LayoutProps = React.PropsWithChildren;

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <BreadcrumbProvider>
          <Header />
          <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </BreadcrumbProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
