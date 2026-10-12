import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MARKETING_MEDIA } from '../media/mediaManifest';

/**
 * The marketing finale is an authored brand composition, not a utility strip.
 * Kept DOM-first so it remains complete with JavaScript motion disabled.
 */
export function SiteFooter() {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <footer
      id="site-footer"
      className="relative isolate overflow-hidden bg-[#121718] text-[#F6F7F6]"
    >
      <div className="relative mx-auto flex min-h-[78svh] max-w-[1800px] flex-col justify-between px-5 pb-7 pt-20 sm:px-10 sm:pb-10 sm:pt-24 lg:px-14 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(250px,0.5fr)] lg:items-start">
          <div className="max-w-[1080px]">
            <p className="mb-5 max-w-md text-base leading-relaxed text-[#AAB5B0] sm:text-lg">
              The next question is yours.
            </p>
            <h2 className="font-sans text-[clamp(3.25rem,7.5vw,8.5rem)] font-medium leading-[0.93] tracking-[-0.07em]">
              Make the unknown
              <span className="block text-[#AAB5B0]">something you can test.</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-5 sm:mt-12">
              <Link
                to="/workbench"
                className="inline-flex min-h-12 items-center gap-4 border-b border-[#F6F7F6] pb-2 text-base font-medium transition-opacity hover:opacity-65 focus-visible:outline-offset-4"
              >
                Explore the workbench
                <span aria-hidden="true">↗</span>
              </Link>
              <Link
                to="/signup"
                className="inline-flex min-h-12 items-center gap-4 border-b border-[#8A9891] pb-2 text-base text-[#CBD2CD] transition-colors hover:text-white focus-visible:outline-offset-4"
              >
                Start modeling
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm lg:pt-2">
            <div className="flex flex-col items-start gap-4">
              <Link to="/" className="transition-opacity hover:opacity-65">Home</Link>
              <Link to="/models" className="transition-opacity hover:opacity-65">Models</Link>
              <Link to="/workbench" className="transition-opacity hover:opacity-65">Workbench</Link>
              <Link to="/method" className="transition-opacity hover:opacity-65">Method</Link>
            </div>
            <div className="flex flex-col items-start gap-4 text-[#BAC4BE]">
              <Link to="/login" className="transition-colors hover:text-white">Sign in</Link>
              <Link to="/signup" className="transition-colors hover:text-white">Create account</Link>
              <button
                type="button"
                aria-expanded={showCredits}
                aria-controls="footer-photo-credits"
                onClick={() => setShowCredits((open) => !open)}
                className="min-h-10 text-left underline decoration-[#77867D] underline-offset-4 transition-colors hover:text-white"
              >
                {showCredits ? 'Hide photo credits' : 'Photo credits'}
              </button>
            </div>
          </nav>
        </div>

        <div className="mt-24 sm:mt-32 lg:mt-40">
          <div
            aria-label="Math Intellect"
            className="select-none font-sans text-[clamp(3.15rem,11.5vw,13.6rem)] font-medium leading-[0.78] tracking-[-0.092em]"
          >
            <span className="block">MATH</span>
            <span className="block">INTELLECT</span>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#3E4944] pt-5 text-xs text-[#AAB5B0] sm:mt-14">
            <span>© {new Date().getFullYear()} Math Intellect</span>
            <span>Mathematical simulation, built for informed decisions.</span>
          </div>
        </div>

        {showCredits && (
          <div
            id="footer-photo-credits"
            className="mt-10 border-t border-[#3E4944] pt-6"
          >
            <h3 className="mb-5 text-sm font-medium">Photography credits</h3>
            <ul className="grid gap-3 text-xs text-[#B4BDB7] sm:grid-cols-2 lg:grid-cols-4">
              {Object.values(MARKETING_MEDIA).map((asset) => (
                <li key={asset.id}>
                  <a
                    href={asset.canonicalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-8 items-center underline decoration-[#66776C] underline-offset-4 hover:text-white"
                  >
                    {asset.creator} <span className="sr-only">(opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
}

export default SiteFooter;
