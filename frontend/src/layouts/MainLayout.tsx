/* eslint-disable react-refresh/only-export-components */

import { useState, type ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { Sidebar } from './Sidebar';
import { MobileDock } from './MobileDock';

const SidebarContext = createContext<(() => void) | undefined>(undefined);

export function useSidebarToggle() {
  return useContext(SidebarContext);
}

export function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ color: 'var(--text-primary)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(42% 30% at 6% 0%, rgba(110, 231, 255, 0.14), transparent 72%), radial-gradient(38% 28% at 92% 12%, rgba(139, 92, 246, 0.12), transparent 72%), linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-main) 84%)',
        }}
        aria-hidden
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="relative md:ml-72 min-h-screen flex flex-col pb-24 md:pb-0">
        <SidebarContext.Provider value={() => setSidebarOpen((value) => !value)}>
          {children}
        </SidebarContext.Provider>
      </main>

      <MobileDock />
    </div>
  );
}
