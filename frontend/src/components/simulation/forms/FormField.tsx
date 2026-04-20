/* eslint-disable react-refresh/only-export-components */

import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react';

export const inputBase = {
  background: 'rgba(11, 16, 32, 0.9)',
  border: '1px solid rgba(148, 163, 184, 0.32)',
  color: 'var(--text-primary)',
  borderRadius: '0.8rem',
  outline: 'none',
  transition: 'border-color 180ms ease, box-shadow 180ms ease, transform 200ms ease',
} as const;

export function useInputFocus(el: HTMLElement | null, color = '#2563EB') {
  if (!el) {
    return;
  }
  el.addEventListener('focus', () => {
    (el as HTMLElement).style.borderColor = `${color}88`;
    (el as HTMLElement).style.boxShadow = `0 0 0 4px ${color}22`;
    (el as HTMLElement).style.transform = 'translateY(-1px)';
  });
  el.addEventListener('blur', () => {
    (el as HTMLElement).style.borderColor = 'rgba(148, 163, 184, 0.32)';
    (el as HTMLElement).style.boxShadow = 'none';
    (el as HTMLElement).style.transform = 'translateY(0px)';
  });
}

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </label>
      {hint && <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
}

interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  helper?: string;
  mono?: boolean;
}

export function FieldInput({ label, hint, prefix, suffix, helper, mono, className = '', style, ...rest }: FieldInputProps) {
  return (
    <div>
      {label && <Label hint={hint}>{label}</Label>}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-xs pointer-events-none select-none font-mono" style={{ color: 'var(--text-muted)' }}>
            {prefix}
          </span>
        )}
        <input
          {...rest}
          className={`w-full px-3 py-2.5 text-sm focus:outline-none ${mono ? 'font-mono' : ''} ${className}`}
          style={{
            ...inputBase,
            paddingLeft: prefix ? '2rem' : '0.75rem',
            paddingRight: suffix ? '2.5rem' : '0.75rem',
            ...style,
          }}
          onFocus={(event) => {
            event.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.65)';
            event.currentTarget.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.14)';
            event.currentTarget.style.transform = 'translateY(-1px)';
            rest.onFocus?.(event);
          }}
          onBlur={(event) => {
            event.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.32)';
            event.currentTarget.style.boxShadow = 'none';
            event.currentTarget.style.transform = 'translateY(0px)';
            rest.onBlur?.(event);
          }}
        />
        {suffix && (
          <span className="absolute right-3 text-xs pointer-events-none select-none" style={{ color: 'var(--text-muted)' }}>
            {suffix}
          </span>
        )}
      </div>
      {helper && <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{helper}</p>}
    </div>
  );
}

interface FieldSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  helper?: string;
}

export function FieldSelect({ label, hint, helper, children, className = '', style, ...rest }: FieldSelectProps) {
  return (
    <div>
      {label && <Label hint={hint}>{label}</Label>}
      <select
        {...rest}
        className={`w-full px-3 py-2.5 text-sm focus:outline-none appearance-none cursor-pointer ${className}`}
        style={{
          ...inputBase,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3E%3Cpath fill=\'%2364748b\' d=\'M4.427 6.427a.75.75 0 011.06 0L8 8.94l2.513-2.513a.75.75 0 111.06 1.06l-3.043 3.044a.75.75 0 01-1.06 0L4.427 7.487a.75.75 0 010-1.06z\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          backgroundSize: '16px',
          paddingRight: '2rem',
          ...style,
        }}
        onFocus={(event) => {
          event.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.65)';
          event.currentTarget.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.14)';
          event.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.32)';
          event.currentTarget.style.boxShadow = 'none';
          event.currentTarget.style.transform = 'translateY(0px)';
        }}
      >
        {children}
      </select>
      {helper && <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{helper}</p>}
    </div>
  );
}

interface FieldSliderProps {
  label: string;
  hint?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  helper?: string;
  accentColor?: string;
}

export function FieldSlider({ label, hint, min, max, step = 1, value, onChange, format, helper, accentColor = '#2563EB' }: FieldSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : String(value);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label hint={hint}>{label}</Label>
        <span
          className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md tabular-nums"
          style={{ background: `${accentColor}1f`, color: accentColor, border: `1px solid ${accentColor}3a` }}
        >
          {display}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor} ${pct}%, rgba(148, 163, 184, 0.5) ${pct}%, rgba(148, 163, 184, 0.5) 100%)`,
            outline: 'none',
          }}
        />
      </div>
      {helper && <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>{helper}</p>}
    </div>
  );
}

export function SectionDivider({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mt-1 mb-0">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
          {title}
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(148, 163, 184, 0.24)' }} />
      </div>
      {action && <div className="ml-3">{action}</div>}
    </div>
  );
}

interface SmallBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'add' | 'remove' | 'ghost';
}

export function SmallBtn({ variant = 'ghost', children, className = '', ...rest }: SmallBtnProps) {
  const styles: Record<string, CSSProperties> = {
    add: { background: 'rgba(16, 185, 129, 0.14)', border: '1px solid rgba(16, 185, 129, 0.38)', color: '#86efac' },
    remove: { background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#fecaca' },
    ghost: { background: 'rgba(11, 16, 32, 0.84)', border: '1px solid rgba(148, 163, 184, 0.24)', color: 'var(--text-soft)' },
  };

  return (
    <button
      type="button"
      {...rest}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-85 disabled:opacity-30 ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}
