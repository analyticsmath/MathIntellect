import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MARKETING_MEDIA } from '../media/mediaManifest';

export const SiteFooter: React.FC = () => {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <footer className="border-t border-mi-rule bg-mi-paper text-mi-ink text-sm py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-mi-rule">
          {/* Brand & Purpose */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-sans font-medium text-base text-mi-ink block">
              Math Intellect
            </span>
            <p className="text-mi-muted text-sm max-w-sm">
              Deterministic mathematical simulation and decision workbench. Turn explicit assumptions into reproducible computational evidence.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
                Platform
              </span>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/models" className="hover:text-mi-ink-2 transition-colors">
                    Model Atlas
                  </Link>
                </li>
                <li>
                  <Link to="/workbench" className="hover:text-mi-ink-2 transition-colors">
                    Workbench
                  </Link>
                </li>
                <li>
                  <Link to="/method" className="hover:text-mi-ink-2 transition-colors">
                    Method Dossier
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
                Account
              </span>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/login" className="hover:text-mi-ink-2 transition-colors">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-mi-ink-2 transition-colors">
                    Create account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Quiet Image Credits Action */}
          <div className="md:col-span-4 flex flex-col md:items-end justify-between">
            <button
              type="button"
              onClick={() => setShowCredits(!showCredits)}
              className="text-left md:text-right font-mono text-xs text-mi-muted hover:text-mi-ink transition-colors underline underline-offset-4"
            >
              {showCredits ? 'Hide image credits' : 'Image credits'}
            </button>
            <span className="font-mono text-xs text-mi-muted mt-4 md:mt-0">
              © {new Date().getFullYear()} Math Intellect
            </span>
          </div>
        </div>

        {/* Collapsible Image Credits Panel */}
        {showCredits && (
          <div className="pt-8 pb-4 border-b border-mi-rule">
            <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block mb-4">
              Contextual Photography Credits (Unsplash License)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 font-mono text-xs text-mi-muted">
              {Object.values(MARKETING_MEDIA).map((asset) => (
                <div key={asset.id} className="truncate">
                  <span className="text-mi-ink">{asset.id}</span>:{' '}
                  <a
                    href={asset.canonicalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-mi-ink underline"
                  >
                    {asset.creator}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};
