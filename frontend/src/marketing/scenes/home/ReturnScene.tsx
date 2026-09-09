import React from 'react';
import { Link } from 'react-router-dom';
import { MediaPicture } from '../../components/MediaPicture';

export const ReturnScene: React.FC = () => {
  return (
    <section
      className="relative w-full min-h-[90svh] bg-mi-paper flex items-center justify-center overflow-hidden py-16 px-6 sm:px-8 lg:px-16"
      aria-label="See the System Differently"
    >
      {/* Background Return Photograph: Desktop MI-PH-001 / Mobile MI-PH-002 */}
      <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
        <div className="hidden md:block w-full h-full">
          <MediaPicture
            id="MI-PH-001"
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
            focalVariant="desktop"
            alt="Paved pedestrian crossing seen from above"
          />
        </div>
        <div className="block md:hidden w-full h-full">
          <MediaPicture
            id="MI-PH-002"
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
            focalVariant="mobile"
            alt="Vertical perspective of crossing traversal"
          />
        </div>
      </div>

      {/* Center Thematic Resolution Plane */}
      <div className="relative z-10 w-full max-w-[800px] bg-mi-paper/95 border border-mi-rule p-8 sm:p-14 text-center space-y-6">
        <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
          Movement 10: Return to Reality
        </span>
        <h2 className="font-sans font-medium text-[clamp(2.5rem,4.5vw,4.8rem)] leading-[0.94] tracking-tight text-mi-ink">
          See the system differently.
        </h2>
        <p className="text-mi-ink-2 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Make assumptions explicit, test them, compare the evidence, and replay the state. What began as unstructured motion is now an inspectable computational truth.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link
            to="/signup"
            className="bg-mi-ink text-mi-paper font-sans text-sm font-medium px-7 py-3.5 hover:bg-mi-ink-2 transition-colors min-h-[44px] flex items-center"
          >
            Create a model
          </Link>
          <Link
            to="/method"
            className="text-mi-ink font-sans text-sm font-medium hover:underline underline-offset-4 min-h-[44px] flex items-center"
          >
            Read the method
          </Link>
        </div>
      </div>
    </section>
  );
};
