/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mi: {
          canvas: '#F4F6F5',
          paper: '#FFFFFF',
          ink: '#111412',
          'ink-2': '#2D3330',
          text: '#505753',
          muted: '#78807C',
          rule: '#D8DDDA',
          'rule-strong': '#BAC1BD',
          'surface-soft': '#ECEFEE',
          change: '#E35A35',
          focus: '#2457E6',
          success: '#23755B',
          warning: '#9D6814',
          danger: '#B64049',
        },
      },
      fontFamily: {
        sans: ['"ABC Diatype"', 'Arial', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"ABC Diatype Semi Mono"', '"SFMono-Regular"', 'Consolas', 'monospace'],
        math: ['"STIX Two Math"', '"STIX2"', '"Cambria Math"', 'serif'],
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '18px',
      },
      boxShadow: {
        elevated: '0 4px 20px rgba(17, 20, 18, 0.08), 0 1px 3px rgba(17, 20, 18, 0.04)',
        modal: '0 12px 36px rgba(17, 20, 18, 0.14), 0 2px 8px rgba(17, 20, 18, 0.06)',
      },
    },
  },
  plugins: [],
};
