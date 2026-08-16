import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <div className="min-h-screen flex flex-col bg-mi-canvas text-mi-ink font-sans">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-mi-ink text-mi-paper text-sm font-medium"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-mi-paper/95 border-b border-mi-rule shadow-sm py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-medium text-lg md:text-xl tracking-tight text-mi-ink focus-visible:ring-2 focus-visible:ring-mi-focus"
          >
            <span className="w-3.5 h-3.5 bg-mi-ink inline-block" aria-hidden="true" />
            <span>Math Intellect</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium" aria-label="Main Navigation">
            <Link
              to="/models"
              className={`transition-colors hover:text-mi-ink ${
                location.pathname === '/models' ? 'text-mi-ink font-semibold' : 'text-mi-text'
              }`}
            >
              Models
            </Link>
            <Link
              to="/method"
              className={`transition-colors hover:text-mi-ink ${
                location.pathname === '/method' ? 'text-mi-ink font-semibold' : 'text-mi-text'
              }`}
            >
              Method
            </Link>
            <Link
              to="/workbench"
              className={`transition-colors hover:text-mi-ink ${
                location.pathname === '/workbench' ? 'text-mi-ink font-semibold' : 'text-mi-text'
              }`}
            >
              Workbench
            </Link>
          </nav>

          {/* Action / Auth Button */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="mi-btn-primary px-4 py-2 text-xs"
              >
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-medium text-mi-text hover:text-mi-ink px-2 py-1.5"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="mi-btn-primary px-4 py-2 text-xs"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/workbench"
              className="mi-btn-primary px-3 py-1.5 text-xs"
            >
              Workbench
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="p-2 text-mi-ink border border-mi-rule bg-mi-paper"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-mi-paper border-b border-mi-rule px-6 py-6 space-y-4">
            <nav className="flex flex-col space-y-3 text-base font-medium">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-mi-ink hover:text-mi-change">Overview</Link>
              <Link to="/models" onClick={() => setMobileMenuOpen(false)} className="text-mi-ink hover:text-mi-change">Models Atlas</Link>
              <Link to="/workbench" onClick={() => setMobileMenuOpen(false)} className="text-mi-ink hover:text-mi-change">Workbench</Link>
              <Link to="/method" onClick={() => setMobileMenuOpen(false)} className="text-mi-ink hover:text-mi-change">Methodology</Link>
            </nav>
            <div className="pt-4 border-t border-mi-rule flex flex-col gap-3">
              {isAuthenticated ? (
                <Link to="/app" onClick={() => setMobileMenuOpen(false)} className="mi-btn-primary w-full text-center py-2.5 text-sm">
                  Go to Workspace
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mi-btn-secondary w-full text-center py-2.5 text-sm">
                    Sign in
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="mi-btn-primary w-full text-center py-2.5 text-sm">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>

      {/* Quiet Authored Utility Footer */}
      <footer className="w-full border-t border-mi-rule bg-mi-paper py-12 px-6 md:px-12 lg:px-16 mt-auto">
        <div className="max-w-[1720px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2 font-medium text-base text-mi-ink">
              <span className="w-3 h-3 bg-mi-ink inline-block" aria-hidden="true" />
              <span>Math Intellect</span>
            </div>
            <p className="text-xs text-mi-text max-w-sm leading-relaxed">
              Scientific simulation and decision workbench. Designed according to Valtum architectural doctrine.
            </p>
          </div>

          <div className="md:col-span-2 space-y-2 text-xs font-mono">
            <div className="text-mi-muted uppercase">NAVIGATION</div>
            <ul className="space-y-1.5 text-mi-text">
              <li><Link to="/models" className="hover:text-mi-ink">Models Atlas</Link></li>
              <li><Link to="/workbench" className="hover:text-mi-ink">Workbench</Link></li>
              <li><Link to="/method" className="hover:text-mi-ink">Methodology</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs font-mono">
            <div className="text-mi-muted uppercase">PLATFORM</div>
            <ul className="space-y-1.5 text-mi-text">
              <li><Link to="/login" className="hover:text-mi-ink">Sign in</Link></li>
              <li><Link to="/signup" className="hover:text-mi-ink">Create account</Link></li>
              <li><Link to="/app" className="hover:text-mi-ink">Simulation Workspace</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs font-mono text-mi-muted">
            <div className="text-mi-muted uppercase">PROVENANCE</div>
            <p className="text-[11px] leading-normal">
              Continuous models, closed-form verification and deterministic reproducibility.
            </p>
            <div className="text-[11px] pt-1">
              © {new Date().getFullYear()} Math Intellect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
