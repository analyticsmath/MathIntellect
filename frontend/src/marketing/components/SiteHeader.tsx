import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const SiteHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Handle body scroll locking and Escape key for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
          triggerRef.current?.focus();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      // Focus first link in mobile menu
      const firstFocusable = menuRef.current?.querySelector<HTMLAnchorElement>('a');
      firstFocusable?.focus();

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Models', href: '/models' },
    { label: 'Workbench', href: '/workbench' },
    { label: 'Method', href: '/method' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 bg-mi-paper border-b border-mi-rule transition-all duration-300 ${
          scrolled ? 'h-[54px]' : 'h-16'
        } flex items-center justify-between px-6 sm:px-8 lg:px-12`}
      >
        {/* Left: Brand Wordmark */}
        <Link
          to="/"
          className="font-sans font-medium text-base text-mi-ink tracking-tight hover:opacity-80 transition-opacity"
        >
          Math Intellect
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`font-sans text-sm tracking-tight relative py-1 transition-colors ${
                  isActive ? 'text-mi-ink font-medium' : 'text-mi-muted hover:text-mi-ink'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-mi-ink" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/login"
            className="font-sans text-sm text-mi-muted hover:text-mi-ink transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="font-sans text-sm font-medium bg-mi-ink text-mi-paper px-4 py-2 hover:bg-mi-ink-2 transition-colors"
          >
            Start modeling
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="md:hidden font-mono text-xs uppercase tracking-wider text-mi-ink p-2 -mr-2"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* Mobile Plain Navigation Field */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 bg-mi-paper pt-20 px-8 pb-12 flex flex-col justify-between md:hidden"
        >
          <nav className="flex flex-col gap-2 mt-4" aria-label="Mobile Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={handleLinkClick}
                  className={`min-h-[48px] flex items-center font-sans text-2xl tracking-tight border-b border-mi-rule ${
                    isActive ? 'text-mi-ink font-medium' : 'text-mi-muted hover:text-mi-ink'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 pt-6 border-t border-mi-rule">
            <Link
              to="/login"
              onClick={handleLinkClick}
              className="min-h-[48px] flex items-center justify-center font-sans text-base text-mi-ink border border-mi-rule"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              onClick={handleLinkClick}
              className="min-h-[48px] flex items-center justify-center font-sans text-base font-medium bg-mi-ink text-mi-paper"
            >
              Start modeling
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
