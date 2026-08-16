import { createContext, useContext } from 'react';

export interface SidebarContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

export const SidebarContext = createContext<SidebarContextValue>({
  open: false,
  toggle: () => {},
  close: () => {},
});

export function useSidebarToggle(): () => void {
  const ctx = useContext(SidebarContext);
  return ctx.toggle;
}
