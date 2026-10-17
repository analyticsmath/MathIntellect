import { Outlet } from "react-router-dom";
import { SkipLink } from "./components/SkipLink";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { ScenarioProvider } from "./film/ScenarioContext";
import { PublicTransitionProvider } from "./possibility/transitions/PublicTransitionProvider";
import "./possibility/styles/tokens.css";
import "./possibility/styles/base.css";
export function MarketingShell() {
  return (
    <ScenarioProvider>
      <PublicTransitionProvider>
        <div className="pe-site">
          <SkipLink />
          <SiteHeader />
          <main id="main-content">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      </PublicTransitionProvider>
    </ScenarioProvider>
  );
}
export default MarketingShell;
