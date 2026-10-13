import React from "react";
import { Outlet } from "react-router-dom";
import { SkipLink } from "./components/SkipLink";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { DesktopLenisBridge } from "./motion/DesktopLenisBridge";
import { ScenarioProvider } from "./film/ScenarioContext";
import { RouteTransition } from "./film/RouteTransition";
import "./film/film.css";

export const MarketingShell: React.FC = () => {
  return (
    <DesktopLenisBridge>
      <ScenarioProvider>
        <div className="mi-cinema">
          <SkipLink />
          <SiteHeader />
          <main id="main-content">
            <Outlet />
          </main>
          <SiteFooter />
          <RouteTransition />
        </div>
      </ScenarioProvider>
    </DesktopLenisBridge>
  );
};

export default MarketingShell;
