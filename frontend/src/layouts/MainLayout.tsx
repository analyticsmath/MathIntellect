import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileDock } from './MobileDock';
import { SidebarContext } from './sidebar-context';

export function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggle = () => setSidebarOpen((prev) => !prev);
  const close = () => setSidebarOpen(false);

  return (
    <SidebarContext.Provider value={{ open: sidebarOpen, toggle, close }}>
      <div className="min-h-screen bg-mi-canvas text-mi-ink flex flex-col">
        <Sidebar open={sidebarOpen} onClose={close} />

        <main className="flex-1 md:ml-56 min-h-screen flex flex-col pb-20 md:pb-0">
          {children}
        </main>

        <MobileDock />
      </div>
    </SidebarContext.Provider>
  );
}
