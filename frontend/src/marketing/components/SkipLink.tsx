import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-mi-ink focus:text-mi-paper focus:font-mono focus:text-xs focus:shadow-modal focus:border focus:border-mi-rule-strong"
    >
      Skip to main content
    </a>
  );
};
