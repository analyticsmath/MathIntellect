import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react';

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <label className="text-xs font-medium text-mi-ink">
        {children}
      </label>
      {hint && <span className="text-[11px] font-mono text-mi-muted">{hint}</span>}
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

export function FieldInput({
  label,
  hint,
  prefix,
  suffix,
  helper,
  mono,
  className = '',
  ...rest
}: FieldInputProps) {
  return (
    <div>
      {label && <Label hint={hint}>{label}</Label>}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-xs font-mono text-mi-muted pointer-events-none select-none">
            {prefix}
          </span>
        )}
        <input
          {...rest}
          className={`mi-input ${mono ? 'font-mono' : ''} ${className}`}
          style={{
            paddingLeft: prefix ? '2rem' : '0.875rem',
            paddingRight: suffix ? '2.5rem' : '0.875rem',
          }}
        />
        {suffix && (
          <span className="absolute right-3 text-xs font-mono text-mi-muted pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
      {helper && <p className="mt-1 text-[11px] font-mono text-mi-muted">{helper}</p>}
    </div>
  );
}

interface FieldSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  helper?: string;
}

export function FieldSelect({
  label,
  hint,
  helper,
  children,
  className = '',
  ...rest
}: FieldSelectProps) {
  return (
    <div>
      {label && <Label hint={hint}>{label}</Label>}
      <select
        {...rest}
        className={`mi-input cursor-pointer ${className}`}
      >
        {children}
      </select>
      {helper && <p className="mt-1 text-[11px] font-mono text-mi-muted">{helper}</p>}
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

export function FieldSlider({
  label,
  hint,
  min,
  max,
  step = 1,
  value,
  onChange,
  format,
  helper,
}: FieldSliderProps) {
  const display = format ? format(value) : String(value);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label hint={hint}>{label}</Label>
        <span className="text-xs font-mono font-semibold text-mi-ink">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-mi-ink"
      />
      {helper && <p className="text-[11px] font-mono text-mi-muted">{helper}</p>}
    </div>
  );
}

export function SectionDivider({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between pt-2 pb-1 border-b border-mi-rule">
      <span className="text-[11px] font-mono font-semibold text-mi-muted uppercase">
        {title}
      </span>
      {action && <div>{action}</div>}
    </div>
  );
}

interface SmallBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'add' | 'remove' | 'ghost';
}

export function SmallBtn({ variant = 'ghost', children, className = '', ...rest }: SmallBtnProps) {
  const variantClass =
    variant === 'add'
      ? 'bg-mi-success/10 border-mi-success text-mi-success hover:bg-mi-success/20'
      : variant === 'remove'
      ? 'bg-mi-danger/10 border-mi-danger text-mi-danger hover:bg-mi-danger/20'
      : 'bg-mi-paper border-mi-rule text-mi-ink hover:bg-mi-surface-soft';

  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-mono border transition-colors ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}
