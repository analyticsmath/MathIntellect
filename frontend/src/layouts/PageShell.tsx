import type { ReactNode } from 'react';
import { Topbar } from './Topbar';
import { useSidebarToggle } from './MainLayout';

interface PageShellProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

/**
 * Drop-in replacement for the manual <Topbar> + content pattern used in pages.
 * Automatically wires the mobile sidebar toggle.
 */
export function PageShell({ title, subtitle, action, children }: PageShellProps) {
  const toggle = useSidebarToggle();

  return (
    <>
      <Topbar
        title={title}
        subtitle={subtitle}
        action={action}
        onMenuToggle={toggle}
      />
      {children}
    </>
  );
}
