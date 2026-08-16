import { useState, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';

interface MarketingLayoutProps {
  children: ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-mi-dark-0 text-mi-cream font-sans selection:bg-mi-cream selection:text-mi-dark-0">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-mi-cream text-mi-dark-0 text-sm font-medium rounded"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-mi-dark-0/95 border-b border-mi-photo-line py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-serif text-xl md:text-2xl text-mi-cream tracking-tight hover:text-white transition-colors"
          >
            <span>Math Intellect</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-sans text-mi-copy" aria-label="Main Navigation">
            <Link to="/models" className="hover:text-mi-cream transition-colors">
              Models
            </Link>
            <Link to="/method" className="hover:text-mi-cream transition-colors">
              Method
            </Link>
            <Link to="/workbench" className="hover:text-mi-cream transition-colors">
              Workbench
            </Link>
          </nav>

          {/* Desktop Authentication & Action */}
          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-mi-cream text-mi-dark-0 text-xs font-medium tracking-tight hover:bg-white transition-colors"
              >
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-sans text-mi-copy hover:text-mi-cream transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-mi-cream text-mi-dark-0 text-xs font-medium tracking-tight hover:bg-white transition-colors"
                >
                  Open workbench
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button (44px target) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 flex items-center justify-center text-mi-cream hover:text-white"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-mi-dark-1 border-b border-mi-photo-line px-6 py-6 space-y-5">
            <nav className="flex flex-col space-y-4 text-base font-sans text-mi-copy">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-mi-cream">
                Overview
              </Link>
              <Link to="/models" onClick={() => setMobileMenuOpen(false)} className="hover:text-mi-cream">
                Models
              </Link>
              <Link to="/method" onClick={() => setMobileMenuOpen(false)} className="hover:text-mi-cream">
                Method
              </Link>
              <Link to="/workbench" onClick={() => setMobileMenuOpen(false)} className="hover:text-mi-cream">
                Workbench
              </Link>
            </nav>
            <div className="pt-4 border-t border-mi-photo-line flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  to="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full bg-mi-cream text-mi-dark-0 font-medium text-sm"
                >
                  Go to Workspace
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-full border border-mi-photo-line text-mi-cream text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/app"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-full bg-mi-cream text-mi-dark-0 font-medium text-sm"
                  >
                    Open workbench
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

      {/* Atmospheric Integrated Scandi Footer */}
      <footer className="w-full border-t border-mi-photo-line bg-mi-dark-0 py-16 px-6 md:px-12 lg:px-16 text-mi-cream">
        <div className="max-w-[1380px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="font-serif text-2xl text-mi-cream block">
              Math Intellect
            </Link>
            <p className="font-sans text-sm text-mi-copy max-w-sm leading-relaxed">
              A continuous mathematical simulation and decision workbench for uncertainty, strategy, dynamics, and interacting systems.
            </p>
            <div className="pt-2 text-xs font-sans text-mi-muted">
              © {new Date().getFullYear()} Math Intellect. All mathematical derivations preserved.
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="font-sans text-xs text-mi-muted uppercase tracking-wider">Atlas &amp; Workbench</div>
            <ul className="space-y-2.5 text-sm font-sans text-mi-copy">
              <li>
                <Link to="/models" className="hover:text-mi-cream transition-colors">
                  Model Atlas
                </Link>
              </li>
              <li>
                <Link to="/workbench" className="hover:text-mi-cream transition-colors">
                  Simulation Workbench
                </Link>
              </li>
              <li>
                <Link to="/method" className="hover:text-mi-cream transition-colors">
                  Epistemic Method
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <div className="font-sans text-xs text-mi-muted uppercase tracking-wider">Access &amp; Account</div>
            <ul className="space-y-2.5 text-sm font-sans text-mi-copy">
              <li>
                <Link to="/app" className="hover:text-mi-cream transition-colors">
                  Open Interactive App
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-mi-cream transition-colors">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-mi-cream transition-colors">
                  Create Analyst Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
