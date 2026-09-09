import React from 'react';
import { Outlet } from 'react-router-dom';
import { SkipLink } from './components/SkipLink';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { DesktopLenisBridge } from './motion/DesktopLenisBridge';

export const MarketingShell: React.FC = () => {
  return (
    <DesktopLenisBridge>
      <div className="min-h-screen flex flex-col bg-mi-canvas text-mi-ink selection:bg-mi-ink selection:text-mi-paper">
        <SkipLink />
        <SiteHeader />
        <main id="main-content" className="flex-1 w-full pt-16">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </DesktopLenisBridge>
  );
};

export default MarketingShell;
