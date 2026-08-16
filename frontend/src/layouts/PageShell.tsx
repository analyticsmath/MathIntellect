import type { ReactNode } from 'react';
import { Topbar } from './Topbar';
import { useSidebarToggle } from './sidebar-context';

interface PageShellProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

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
