/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mi: {
          canvas: '#F1F3F2',
          paper: '#F8F9F8',
          white: '#FFFFFF',
          ink: '#101311',
          'ink-2': '#2B302D',
          muted: '#626864',
          rule: '#CFD4D0',
          'rule-strong': '#AEB5B0',
          dark: '#151916',
          'dark-2': '#202521',
          'on-dark': '#F2F4F3',

          // Semantic Data Colors (never decorative, never gradients)
          'data-blue': '#315F7A',
          'data-green': '#3E6B50',
          'data-red': '#983E36',
          'data-amber': '#8A651F',
          'data-plum': '#6B526F',

          // App status fallbacks
          change: '#983E36',
          focus: '#315F7A',
          success: '#3E6B50',
          warning: '#8A651F',
          danger: '#983E36',
        },
      },
      fontFamily: {
        sans: [
          '"Instrument Sans Variable"',
          'Instrument Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Arial',
          'sans-serif',
        ],
        display: [
          '"Instrument Sans Variable"',
          'Instrument Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: [
          '"IBM Plex Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
        math: ['KaTeX_Math', 'KaTeX_Main', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(16, 19, 17, 0.04)',
        modal: '0 8px 30px rgba(16, 19, 17, 0.12)',
      },
    },
  },
  plugins: [],
};
