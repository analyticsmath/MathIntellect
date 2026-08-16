import React from 'react';

interface MathExpressionProps {
  tex: string;
  display?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const MathExpression: React.FC<MathExpressionProps> = ({
  tex,
  display = false,
  className = '',
  ariaLabel,
}) => {
  // Format common mathematical TeX syntax into readable typographical symbols
  const formatted = tex
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\partial/g, '∂')
    .replace(/\\varepsilon/g, 'ε')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/_\{([^}]+)\}/g, '₍$1₎')
    .replace(/_([a-zA-Z0-9])/g, '₍$1₎')
    .replace(/\^\{([^}]+)\}/g, '⁽$1⁾')
    .replace(/\^2/g, '²')
    .replace(/\^t/g, 'ᵗ');

  if (display) {
    return (
      <div
        role="math"
        aria-label={ariaLabel || tex}
        className={`font-math my-2 text-center text-mi-ink text-base md:text-lg tracking-wide select-all ${className}`}
      >
        {formatted}
      </div>
    );
  }

  return (
    <span
      role="math"
      aria-label={ariaLabel || tex}
      className={`font-math text-mi-ink inline-block px-1 font-medium ${className}`}
    >
      {formatted}
    </span>
  );
};
