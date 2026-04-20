/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Surfaces (true dark navy, not gray) ──────────────────────────────
        bg:   {
          void:    '#010409',   // deepest black — page bg
          base:    '#0d1117',   // main surface
          card:    '#161b27',   // card bg
          raised:  '#1c2233',   // elevated / hover
          glass:   'rgba(22,27,39,0.7)',
          border:  '#21293d',   // default border
          subtle:  '#1a2236',   // muted areas
        },
        // ── Brand — indigo-violet gradient family ─────────────────────────────
        brand: {
          50:  '#f0efff',
          100: '#e2e0ff',
          200: '#c8c4ff',
          300: '#a89eff',
          400: '#8b7cf8',   // primary light
          500: '#7c6ef2',
          600: '#6355e8',   // primary
          700: '#4f43d4',
          800: '#3e34a8',
          900: '#2d2578',
          950: '#1b1552',
        },
        // ── Accent — electric cyan ────────────────────────────────────────────
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // ── Success / Warning / Danger / Info ────────────────────────────────
        emerald: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        amber: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
        },
        rose: {
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
        },
        violet: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        // ── Text hierarchy ────────────────────────────────────────────────────
        ink: {
          primary:   '#e8eaf0',  // headings
          secondary: '#8892a4',  // body
          tertiary:  '#4d5a70',  // muted
          dim:       '#2a3347',  // very muted / dividers
        },
        // ── Compatibility aliases (old token names) ───────────────────────────
        text: {
          primary:   '#e8eaf0',
          secondary: '#8892a4',
          muted:     '#8892a4',
          dim:       '#4d5a70',
        },
      },
      fontFamily: {
        sans: ['"Inter var"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Inter var"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.06em' }],
        '3xs': ['9px',  { lineHeight: '12px', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        '4xl': '1.75rem',
      },
      boxShadow: {
        // Depth system
        'depth-1':  '0 1px 2px rgba(0,0,0,0.6)',
        'depth-2':  '0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
        'depth-3':  '0 8px 24px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        'depth-4':  '0 20px 48px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)',
        // Glow
        'glow-brand':  '0 0 0 1px rgba(99,85,232,0.3), 0 0 24px rgba(99,85,232,0.15)',
        'glow-sm':     '0 0 0 1px rgba(99,85,232,0.15), 0 0 12px rgba(99,85,232,0.08)',
        'glow-cyan':   '0 0 0 1px rgba(6,182,212,0.2),  0 0 16px rgba(6,182,212,0.08)',
        'glow-emerald':'0 0 0 1px rgba(16,185,129,0.2), 0 0 16px rgba(16,185,129,0.08)',
        'glow-rose':   '0 0 0 1px rgba(244,63,94,0.2),  0 0 16px rgba(244,63,94,0.08)',
        // Card
        'card':       '0 0 0 1px rgba(33,41,61,0.8), 0 2px 8px rgba(0,0,0,0.5)',
        'card-hover': '0 0 0 1px rgba(99,85,232,0.25), 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(99,85,232,0.06)',
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      backgroundImage: {
        'gradient-brand':   'linear-gradient(135deg, #6355e8 0%, #06b6d4 100%)',
        'gradient-brand-v': 'linear-gradient(180deg, #6355e8 0%, #3e34a8 100%)',
        'gradient-card':    'linear-gradient(145deg, rgba(28,34,51,0.9) 0%, rgba(13,17,23,0.95) 100%)',
        'gradient-surface': 'linear-gradient(180deg, #0d1117 0%, #010409 100%)',
        'gradient-glow':    'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(99,85,232,0.12) 0%, transparent 70%)',
        'dot-grid':         "radial-gradient(circle, rgba(33,41,61,0.7) 1px, transparent 1px)",
        'shimmer':          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
      },
      animation: {
        'fade-in':     'fadeIn 0.2s ease-out both',
        'fade-up':     'fadeUp 0.3s cubic-bezier(0.2,0.8,0.2,1) both',
        'slide-up':    'slideUp 0.35s cubic-bezier(0.2,0.8,0.2,1) both',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.2,0.8,0.2,1) both',
        'scale-in':    'scaleIn 0.2s cubic-bezier(0.2,0.8,0.2,1) both',
        'skeleton':    'skeleton 2s ease-in-out infinite',
        'shimmer':     'shimmer 2.5s linear infinite',
        'glow-pulse':  'glowPulse 3s ease-in-out infinite alternate',
        'float':       'float 5s ease-in-out infinite',
        'spin-slow':   'spin 4s linear infinite',
        'count-up':    'countUp 0.6s cubic-bezier(0.2,0.8,0.2,1) both',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                                    to: { opacity: '1' } },
        fadeUp:    { from: { opacity: '0', transform: 'translateY(20px)' },     to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' },     to: { opacity: '1', transform: 'translateY(0)' } },
        slideRight:{ from: { opacity: '0', transform: 'translateX(-10px)' },    to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.92)' },          to: { opacity: '1', transform: 'scale(1)' } },
        skeleton:  { '0%,100%': { opacity: '0.3' }, '50%': { opacity: '0.7' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        glowPulse: { from: { opacity: '0.5' }, to: { opacity: '1' } },
        float:     { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
        countUp:   { from: { opacity: '0', transform: 'translateY(8px) scale(0.96)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.2,0.8,0.2,1)',
        'smooth': 'cubic-bezier(0.2,0.8,0.2,1)',
        'expo':   'ease-out',
      },
      spacing: {
        '4.5': '1.125rem',
        '18':  '4.5rem',
      },
    },
  },
  plugins: [],
};
