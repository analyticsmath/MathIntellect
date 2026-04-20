import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type ReactNode,
} from 'react';
import type { ChartData, Visualization3D } from '../../types/api.types';
import { Loader } from '../ui/Loader';
import { chartTheme } from './chartTheme';

const PALETTE = chartTheme.palette;
const BASE_PADDING = chartTheme.padding;
const GRID_LINE = chartTheme.gridLine;
const AXIS_TEXT = chartTheme.axis.text;
const AXIS_TITLE = chartTheme.axis.title;
const AXIS_FONT_SIZE = Math.max(chartTheme.axis.fontSize, 12);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function safeMax(values: number[]) {
  if (values.length === 0) {
    return 1;
  }
  return Math.max(...values, 1e-9);
}

function safeMin(values: number[]) {
  if (values.length === 0) {
    return 0;
  }
  return Math.min(...values);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function truncateLabel(label: string, maxChars: number) {
  if (label.length <= maxChars) {
    return label;
  }
  const clipped = Math.max(3, maxChars - 1);
  return `${label.slice(0, clipped)}…`;
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((char) => `${char}${char}`).join('')
    : clean;
  const int = Number.parseInt(full, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function blendColor(a: string, b: string, t: number) {
  const colorA = hexToRgb(a);
  const colorB = hexToRgb(b);
  const mixed = {
    r: Math.round(lerp(colorA.r, colorB.r, t)),
    g: Math.round(lerp(colorA.g, colorB.g, t)),
    b: Math.round(lerp(colorA.b, colorB.b, t)),
  };
  return `rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`;
}

function mapHeat(value: number, min: number, max: number) {
  const [s0, s1, s2, s3, s4] = chartTheme.geometry.heatStops;
  const t = max === min ? 0.5 : clamp((value - min) / (max - min), 0, 1);
  if (t < 0.25) {
    return blendColor(s0, s1, t / 0.25);
  }
  if (t < 0.5) {
    return blendColor(s1, s2, (t - 0.25) / 0.25);
  }
  if (t < 0.75) {
    return blendColor(s2, s3, (t - 0.5) / 0.25);
  }
  return blendColor(s3, s4, (t - 0.75) / 0.25);
}

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(720);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(300, Math.floor(entry.contentRect.width)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

function shouldUseLiteTooltipMotion() {
  if (typeof window === 'undefined') {
    return true;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 768px)').matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  return reduced || (mobile && (memory <= 4 || cores <= 4));
}

type TooltipPayload = {
  title: string;
  value: string;
  series?: string;
  color?: string;
};

function useFloatingTooltip(containerRef: RefObject<HTMLDivElement | null>) {
  const motionRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ x: 16, y: 16 });
  const springRef = useRef({ x: 16, y: 16, vx: 0, vy: 0 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const visibleRef = useRef(false);
  const showTimerRef = useRef<number>(0);
  const pointerRafRef = useRef<number>(0);
  const springRafRef = useRef<number>(0);
  const runSpringRef = useRef<() => void>(() => {});
  const liteMotion = useMemo(() => shouldUseLiteTooltipMotion(), []);
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState<TooltipPayload | null>(null);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  const clampToBounds = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    const tooltip = tooltipRef.current;
    if (!container || !tooltip) {
      return;
    }

    const bounds = container.getBoundingClientRect();
    const nextX = clientX - bounds.left + 14;
    const nextY = clientY - bounds.top + 14;
    const tipWidth = tooltip.offsetWidth || 220;
    const tipHeight = tooltip.offsetHeight || 76;
    targetRef.current.x = clamp(nextX, 10, Math.max(10, bounds.width - tipWidth - 10));
    targetRef.current.y = clamp(nextY, 10, Math.max(10, bounds.height - tipHeight - 10));
  }, [containerRef]);

  useEffect(() => {
    runSpringRef.current = () => {
      springRafRef.current = 0;
      const motion = motionRef.current;
      if (!motion) {
        return;
      }

      const state = springRef.current;
      const target = targetRef.current;
      if (liteMotion) {
        state.x = target.x;
        state.y = target.y;
        state.vx = 0;
        state.vy = 0;
      } else {
        // Deterministic critically-damped spring for premium cursor follow.
        const stiffness = 0.22;
        const damping = 0.72;
        state.vx = (state.vx + (target.x - state.x) * stiffness) * damping;
        state.vy = (state.vy + (target.y - state.y) * stiffness) * damping;
        state.x += state.vx;
        state.y += state.vy;
      }

      motion.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0)`;

      const moving = Math.abs(target.x - state.x) > 0.12
        || Math.abs(target.y - state.y) > 0.12
        || Math.abs(state.vx) > 0.05
        || Math.abs(state.vy) > 0.05;

      if (moving || hoverRef.current || visibleRef.current) {
        springRafRef.current = window.requestAnimationFrame(() => {
          runSpringRef.current();
        });
      }
    };
  }, [liteMotion]);

  const ensureSpring = useCallback(() => {
    if (!springRafRef.current) {
      springRafRef.current = window.requestAnimationFrame(() => {
        runSpringRef.current();
      });
    }
  }, []);

  const flushPointer = useCallback(() => {
    pointerRafRef.current = 0;
    clampToBounds(pointerRef.current.x, pointerRef.current.y);
    ensureSpring();
  }, [clampToBounds, ensureSpring]);

  const trackPointer = useCallback((clientX: number, clientY: number) => {
    pointerRef.current.x = clientX;
    pointerRef.current.y = clientY;
    if (!pointerRafRef.current) {
      pointerRafRef.current = window.requestAnimationFrame(flushPointer);
    }
  }, [flushPointer]);

  useEffect(() => () => {
    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
    }
    if (pointerRafRef.current) {
      window.cancelAnimationFrame(pointerRafRef.current);
    }
    if (springRafRef.current) {
      window.cancelAnimationFrame(springRafRef.current);
    }
  }, []);

  useEffect(() => {
    if (!payload) {
      return;
    }
    const rafId = window.requestAnimationFrame(() => {
      clampToBounds(pointerRef.current.x, pointerRef.current.y);
      ensureSpring();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [payload, clampToBounds, ensureSpring]);

  const hide = useCallback(() => {
    hoverRef.current = false;
    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = 0;
    }
    setVisible(false);
  }, []);

  const show = useCallback((event: ReactPointerEvent<HTMLElement | SVGElement>, data: TooltipPayload) => {
    setPayload(data);
    hoverRef.current = true;
    trackPointer(event.clientX, event.clientY);

    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = 0;
    }

    const delay = liteMotion ? 0 : chartTheme.tooltip.enterDelayMs;
    showTimerRef.current = window.setTimeout(() => {
      showTimerRef.current = 0;
      if (!hoverRef.current) {
        return;
      }
      setVisible(true);
      ensureSpring();
    }, delay);
  }, [ensureSpring, liteMotion, trackPointer]);

  const move = useCallback((event: ReactPointerEvent<HTMLElement | SVGElement>) => {
    if (!hoverRef.current) {
      return;
    }
    trackPointer(event.clientX, event.clientY);
  }, [trackPointer]);

  const bind = useCallback((data: TooltipPayload) => ({
    onPointerEnter: (event: ReactPointerEvent<HTMLElement | SVGElement>) => show(event, data),
    onPointerMove: move,
    onPointerLeave: hide,
    onPointerCancel: hide,
  }), [hide, move, show]);

  const node = (
    <div
      ref={motionRef}
      className="pointer-events-none absolute left-0 top-0 z-20"
      style={{ transform: 'translate3d(16px, 16px, 0)', willChange: 'transform' }}
      aria-hidden
    >
      <div
        ref={tooltipRef}
        className="min-w-[160px] max-w-[260px] rounded-xl px-3 py-2"
        style={{
          border: chartTheme.tooltip.border,
          background: chartTheme.tooltip.background,
          color: chartTheme.tooltip.text,
          boxShadow: chartTheme.tooltip.shadow,
          backdropFilter: chartTheme.tooltip.blur,
          WebkitBackdropFilter: chartTheme.tooltip.blur,
          opacity: visible ? 1 : 0,
          transform: `scale(${visible ? 1 : 0.985})`,
          transition: liteMotion
            ? 'none'
            : `opacity ${visible ? chartTheme.tooltip.enterMs : chartTheme.tooltip.fadeOutMs}ms cubic-bezier(0.2, 0.8, 0.2, 1), transform ${chartTheme.tooltip.enterMs}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
        }}
      >
        {payload && (
          <>
            <p className="text-[11px] font-semibold truncate">{payload.title}</p>
            {payload.series && (
              <p className="text-[10px] mt-0.5 truncate" style={{ color: payload.color ?? chartTheme.tooltip.muted }}>
                {payload.series}
              </p>
            )}
            <p className="text-[11px] mt-1 font-mono" style={{ color: chartTheme.tooltip.text }}>
              {payload.value}
            </p>
          </>
        )}
      </div>
    </div>
  );

  return { bind, node };
}

function EmptyChart() {
  return (
    <div className="h-full grid place-items-center text-xs" style={{ color: 'var(--text-muted)' }}>
      No chart data available
    </div>
  );
}

type AxisLayout = {
  indices: number[];
  rotate: boolean;
  maxChars: number;
};

type FrameLayout = {
  padding: { top: number; right: number; bottom: number; left: number };
  chartWidth: number;
  chartHeight: number;
  xAxis: AxisLayout;
};

function buildAxisLayout(labels: string[], chartWidth: number) {
  if (labels.length === 0) {
    return { indices: [], rotate: false, maxChars: 10 };
  }

  const minSpacing = chartTheme.axis.minLabelSpacing;
  const maxVisible = Math.max(2, Math.floor(chartWidth / minSpacing));
  const stride = labels.length > maxVisible
    ? Math.ceil(labels.length / maxVisible)
    : 1;

  const indices: number[] = [];
  for (let index = 0; index < labels.length; index += stride) {
    indices.push(index);
  }

  if (indices[indices.length - 1] !== labels.length - 1) {
    indices.push(labels.length - 1);
  }

  const longest = indices.reduce((max, index) => Math.max(max, labels[index]?.length ?? 0), 0);
  const slotWidth = chartWidth / Math.max(indices.length - 1, 1);
  const estimate = longest * AXIS_FONT_SIZE * 0.56;
  const rotate = indices.length > 1 && estimate > slotWidth - 6;

  const charAllowance = rotate
    ? Math.floor((slotWidth * 1.55) / (AXIS_FONT_SIZE * 0.56))
    : Math.floor(slotWidth / (AXIS_FONT_SIZE * 0.56));

  return {
    indices,
    rotate,
    maxChars: clamp(charAllowance, 7, 26),
  };
}

function createFrameLayout(
  width: number,
  height: number,
  xTicks: string[] | undefined,
  xAxisTitle: string | undefined,
  yAxisTitle: string | undefined,
): FrameLayout {
  const firstPassWidth = Math.max(1, width - BASE_PADDING.left - BASE_PADDING.right);
  const xAxis = buildAxisLayout(xTicks ?? [], firstPassWidth);
  const xLabelDepth = xTicks && xTicks.length > 0 ? (xAxis.rotate ? 42 : 20) : 0;
  const xTitleDepth = xAxisTitle ? 20 : 0;
  const yTitleDepth = yAxisTitle ? 14 : 0;

  const padding = {
    top: BASE_PADDING.top,
    right: BASE_PADDING.right,
    left: BASE_PADDING.left + yTitleDepth,
    bottom: Math.max(BASE_PADDING.bottom, 24 + xLabelDepth + xTitleDepth),
  };

  const chartWidth = Math.max(1, width - padding.left - padding.right);
  const chartHeight = Math.max(1, height - padding.top - padding.bottom);

  return {
    padding,
    chartWidth,
    chartHeight,
    xAxis,
  };
}

function xPosition(index: number, count: number, layout: FrameLayout) {
  if (count <= 1) {
    return layout.padding.left + layout.chartWidth / 2;
  }
  return layout.padding.left + (index / (count - 1)) * layout.chartWidth;
}

function Frame({
  width,
  height,
  layout,
  children,
  xTicks,
  xAxisTitle,
  yTicks = [0, 0.25, 0.5, 0.75, 1],
  yAxisTitle,
  yFormatter = (value: number) => value.toFixed(2),
}: {
  width: number;
  height: number;
  layout: FrameLayout;
  children: ReactNode;
  xTicks?: string[];
  xAxisTitle?: string;
  yTicks?: number[];
  yAxisTitle?: string;
  yFormatter?: (v: number) => string;
}) {
  const { padding, chartHeight } = layout;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="chart-entry">
      {yTicks.map((tick) => {
        const y = padding.top + chartHeight - tick * chartHeight;
        return (
          <g key={tick}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={GRID_LINE} />
            <text
              x={padding.left - 10}
              y={y + 4}
              fontSize={AXIS_FONT_SIZE}
              fill={AXIS_TEXT}
              textAnchor="end"
            >
              {yFormatter(tick)}
            </text>
          </g>
        );
      })}

      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={width - padding.right}
        y2={padding.top + chartHeight}
        stroke={GRID_LINE}
      />

      {xTicks && xTicks.length > 0 && (
        <>
          {layout.xAxis.indices.map((index) => {
            const x = xPosition(index, xTicks.length, layout);
            const value = truncateLabel(xTicks[index], layout.xAxis.maxChars);
            return (
              <g key={`${xTicks[index]}-${index}`} transform={`translate(${x}, ${height - (xAxisTitle ? 26 : 12)})`}>
                <text
                  fontSize={AXIS_FONT_SIZE}
                  fill={AXIS_TEXT}
                  textAnchor={layout.xAxis.rotate ? 'end' : 'middle'}
                  transform={layout.xAxis.rotate ? 'rotate(-34)' : undefined}
                >
                  {value}
                </text>
              </g>
            );
          })}
        </>
      )}

      {yAxisTitle && (
        <text
          x={18}
          y={padding.top + chartHeight / 2}
          transform={`rotate(-90 18 ${padding.top + chartHeight / 2})`}
          fill={AXIS_TITLE}
          fontSize={AXIS_FONT_SIZE}
          textAnchor="middle"
        >
          {yAxisTitle}
        </text>
      )}

      {xAxisTitle && (
        <text
          x={padding.left + layout.chartWidth / 2}
          y={height - 6}
          fill={AXIS_TITLE}
          fontSize={AXIS_FONT_SIZE}
          textAnchor="middle"
        >
          {xAxisTitle}
        </text>
      )}

      {children}
    </svg>
  );
}

function HistogramChart({ chart, height }: { chart: Extract<ChartData, { type: 'histogram' }>; height: number }) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const tooltip = useFloatingTooltip(ref);
  const values = chart.frequencies.length ? chart.frequencies : chart.counts;

  if (values.length === 0) {
    return <div ref={ref} style={{ height }}><EmptyChart /></div>;
  }

  const maxValue = safeMax(values);
  const layout = createFrameLayout(width, height, chart.labels, 'Bins', 'Frequency');
  const { chartWidth, chartHeight, padding } = layout;
  const barWidth = chartWidth / values.length;

  return (
    <div ref={ref} style={{ height }} className="chart-shell relative">
      <Frame
        width={width}
        height={height}
        layout={layout}
        xTicks={chart.labels}
        xAxisTitle="Bins"
        yAxisTitle="Frequency"
        yTicks={[0, 0.25, 0.5, 0.75, 1]}
        yFormatter={(tick) => (tick * maxValue).toFixed(3)}
      >
        {values.map((value, index) => {
          const normalized = value / maxValue;
          const barHeight = normalized * chartHeight;
          const x = padding.left + index * barWidth + barWidth * 0.12;
          const y = padding.top + chartHeight - barHeight;
          const color = blendColor(chartTheme.geometry.barStart, chartTheme.geometry.barEnd, index / Math.max(values.length - 1, 1));
          return (
            <rect
              key={`${index}-${value}`}
              x={x}
              y={y}
              width={barWidth * 0.76}
              height={Math.max(barHeight, 1)}
              rx={4}
              fill={color}
              opacity="0.9"
              {...tooltip.bind({
                title: chart.labels[index] ?? `Bin ${index + 1}`,
                value: value.toFixed(4),
                color,
              })}
            />
          );
        })}
      </Frame>
      {tooltip.node}
    </div>
  );
}

function CdfChart({ chart, height }: { chart: Extract<ChartData, { type: 'cdf' }>; height: number }) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const tooltip = useFloatingTooltip(ref);

  if (chart.x.length === 0 || chart.y.length === 0) {
    return <div ref={ref} style={{ height }}><EmptyChart /></div>;
  }

  const xMin = safeMin(chart.x);
  const xMax = safeMax(chart.x);
  const xTicks = chart.x.map((value) => value.toFixed(2));
  const layout = createFrameLayout(width, height, xTicks, 'Value', 'Cumulative Probability');
  const { chartWidth, chartHeight, padding } = layout;

  const points = chart.x.map((x, index) => {
    const nx = xMax === xMin ? 0 : (x - xMin) / (xMax - xMin);
    const ny = clamp(chart.y[index], 0, 1);
    const px = padding.left + nx * chartWidth;
    const py = padding.top + chartHeight - ny * chartHeight;
    return `${px},${py}`;
  });

  const markerStride = Math.max(1, Math.ceil(chart.x.length / 26));

  return (
    <div ref={ref} style={{ height }} className="chart-shell relative">
      <Frame
        width={width}
        height={height}
        layout={layout}
        xTicks={xTicks}
        xAxisTitle="Value"
        yAxisTitle="Cumulative Probability"
        yTicks={[0, 0.25, 0.5, 0.75, 1]}
      >
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={chartTheme.geometry.linePrimary}
          strokeWidth={2.4}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {chart.x.map((x, index) => {
          if (index % markerStride !== 0 && index !== chart.x.length - 1) {
            return null;
          }
          const nx = xMax === xMin ? 0 : (x - xMin) / (xMax - xMin);
          const ny = clamp(chart.y[index], 0, 1);
          return (
            <circle
              key={`cdf-point-${index}`}
              cx={padding.left + nx * chartWidth}
              cy={padding.top + chartHeight - ny * chartHeight}
              r={3}
              fill={chartTheme.geometry.linePrimary}
              {...tooltip.bind({
                title: `x = ${x.toFixed(3)}`,
                value: `CDF ${chart.y[index].toFixed(4)}`,
                color: chartTheme.geometry.linePrimary,
              })}
            />
          );
        })}
      </Frame>
      {tooltip.node}
    </div>
  );
}

function TimeSeriesChart({ chart, height }: { chart: Extract<ChartData, { type: 'time_series' }>; height: number }) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const tooltip = useFloatingTooltip(ref);
  const [hoveredSeries, setHoveredSeries] = useState<number | null>(null);
  const values = useMemo(() => chart.series.flatMap((series) => series.data), [chart.series]);
  const yMin = useMemo(() => safeMin(values), [values]);
  const yMax = useMemo(() => safeMax(values), [values]);
  const layout = useMemo(
    () => createFrameLayout(width, height, chart.labels, 'Time', 'Value'),
    [chart.labels, height, width],
  );
  const { chartWidth, chartHeight, padding } = layout;
  const xStep = useMemo(
    () => (chart.labels.length > 1 ? chartWidth / (chart.labels.length - 1) : chartWidth),
    [chart.labels.length, chartWidth],
  );

  const compactLegend = width < 460;
  const legendSeries = compactLegend ? chart.series.slice(0, 4) : chart.series;
  const markerStride = useMemo(
    () => Math.max(1, Math.ceil(chart.labels.length / (width < 540 ? 16 : 26))),
    [chart.labels.length, width],
  );
  const paths = useMemo(
    () => chart.series.map((series) => series.data.map((point, index) => {
      const px = padding.left + index * xStep;
      const pyNormalized = yMax === yMin ? 0.5 : (point - yMin) / (yMax - yMin);
      const py = padding.top + chartHeight - pyNormalized * chartHeight;
      return `${px},${py}`;
    }).join(' ')),
    [chart.series, chartHeight, padding.left, padding.top, xStep, yMax, yMin],
  );
  const markers = useMemo(
    () => chart.series.map((series) => series.data.map((point, index) => {
      if (index % markerStride !== 0 && index !== series.data.length - 1) {
        return null;
      }
      const pyNormalized = yMax === yMin ? 0.5 : (point - yMin) / (yMax - yMin);
      return {
        index,
        point,
        x: padding.left + index * xStep,
        y: padding.top + chartHeight - pyNormalized * chartHeight,
      };
    }).filter((item): item is { index: number; point: number; x: number; y: number } => Boolean(item))),
    [chart.series, chartHeight, markerStride, padding.left, padding.top, xStep, yMax, yMin],
  );

  if (chart.labels.length === 0 || values.length === 0) {
    return <div ref={ref} style={{ height }}><EmptyChart /></div>;
  }

  return (
    <div ref={ref} style={{ height }} className="chart-shell relative">
      <Frame
        width={width}
        height={height}
        layout={layout}
        xTicks={chart.labels}
        xAxisTitle="Time"
        yAxisTitle="Value"
        yTicks={[0, 0.25, 0.5, 0.75, 1]}
        yFormatter={(tick) => (yMin + (yMax - yMin) * tick).toFixed(2)}
      >
        {chart.series.map((series, seriesIndex) => {
          const stroke = PALETTE[seriesIndex % PALETTE.length];
          const focused = hoveredSeries === null || hoveredSeries === seriesIndex;
          return (
            <polyline
              key={series.name}
              points={paths[seriesIndex] ?? ''}
              fill="none"
              stroke={stroke}
              strokeWidth={hoveredSeries === seriesIndex ? 3 : seriesIndex === 0 ? 2.6 : 1.8}
              strokeOpacity={focused ? (seriesIndex === 0 ? 1 : 0.88) : 0.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: 'stroke-opacity 160ms cubic-bezier(0.2, 0.8, 0.2, 1), stroke-width 160ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            />
          );
        })}

        {chart.series.map((series, seriesIndex) => {
          const color = PALETTE[seriesIndex % PALETTE.length];
          const focused = hoveredSeries === null || hoveredSeries === seriesIndex;
          return markers[seriesIndex]?.map((marker) => {
            const binding = tooltip.bind({
              title: chart.labels[marker.index] ?? `T${marker.index + 1}`,
              series: series.name,
              value: marker.point.toFixed(4),
              color,
            });
            return (
              <circle
                key={`${series.name}-${marker.index}`}
                cx={marker.x}
                cy={marker.y}
                r={hoveredSeries === seriesIndex ? 3.4 : 3}
                fill={color}
                opacity={focused ? 0.92 : 0.25}
                onPointerEnter={(event) => {
                  setHoveredSeries(seriesIndex);
                  binding.onPointerEnter(event);
                }}
                onPointerMove={binding.onPointerMove}
                onPointerLeave={() => {
                  setHoveredSeries(null);
                  binding.onPointerLeave();
                }}
                onPointerCancel={() => {
                  setHoveredSeries(null);
                  binding.onPointerCancel();
                }}
                style={{ transition: 'opacity 160ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}
              />
            );
          });
        })}
      </Frame>

      <div className="mt-2 flex flex-wrap gap-2">
        {legendSeries.map((series, index) => (
          <span
            key={series.name}
            className="inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md"
            style={{
              color: 'var(--text-secondary)',
              border: `1px solid ${chartTheme.surface.legendBorder}`,
              background: chartTheme.surface.legendBackground,
              opacity: hoveredSeries === null || hoveredSeries === index ? 1 : 0.4,
              transition: 'opacity 160ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: PALETTE[index % PALETTE.length] }}
            />
            {series.name}
          </span>
        ))}
        {compactLegend && chart.series.length > legendSeries.length && (
          <span
            className="inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md"
            style={{
              color: 'var(--text-secondary)',
              border: `1px solid ${chartTheme.surface.legendBorder}`,
              background: chartTheme.surface.legendBackground,
            }}
          >
            +{chart.series.length - legendSeries.length} more
          </span>
        )}
      </div>
      {tooltip.node}
    </div>
  );
}

function GroupedBarChart({ chart, height }: { chart: Extract<ChartData, { type: 'bar' }>; height: number }) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const tooltip = useFloatingTooltip(ref);
  const [hoveredSeries, setHoveredSeries] = useState<number | null>(null);
  const values = useMemo(() => chart.series.flatMap((series) => series.data), [chart.series]);
  const maxValue = useMemo(() => safeMax(values), [values]);
  const layout = useMemo(
    () => createFrameLayout(width, height, chart.labels, 'Category', 'Value'),
    [chart.labels, height, width],
  );
  const { chartWidth, chartHeight, padding } = layout;
  const groupWidth = useMemo(() => chartWidth / chart.labels.length, [chart.labels.length, chartWidth]);
  const barWidth = useMemo(() => groupWidth / Math.max(chart.series.length, 1), [chart.series.length, groupWidth]);

  const compactLegend = width < 460;
  const legendSeries = compactLegend ? chart.series.slice(0, 4) : chart.series;
  const barLayout = useMemo(
    () => chart.series.map((series, seriesIndex) => series.data.map((value, index) => {
      const normalized = value / maxValue;
      const barHeight = normalized * chartHeight;
      return {
        key: `${series.name}-${index}`,
        title: chart.labels[index] ?? `Item ${index + 1}`,
        series: series.name,
        value,
        x: padding.left + index * groupWidth + seriesIndex * barWidth + 2,
        y: padding.top + chartHeight - barHeight,
        width: Math.max(barWidth - 4, 3),
        height: Math.max(barHeight, 1),
        color: PALETTE[seriesIndex % PALETTE.length],
      };
    })),
    [barWidth, chart.labels, chart.series, chartHeight, groupWidth, maxValue, padding.left, padding.top],
  );

  if (values.length === 0 || chart.labels.length === 0) {
    return <div ref={ref} style={{ height }}><EmptyChart /></div>;
  }

  return (
    <div ref={ref} style={{ height }} className="chart-shell relative">
      <Frame
        width={width}
        height={height}
        layout={layout}
        xTicks={chart.labels}
        xAxisTitle="Category"
        yAxisTitle="Value"
        yTicks={[0, 0.25, 0.5, 0.75, 1]}
        yFormatter={(tick) => (tick * maxValue).toFixed(2)}
      >
        {barLayout.map((seriesBars, seriesIndex) => (
          seriesBars.map((bar) => {
            const focused = hoveredSeries === null || hoveredSeries === seriesIndex;
            const binding = tooltip.bind({
              title: bar.title,
              series: bar.series,
              value: bar.value.toFixed(4),
              color: bar.color,
            });
            return (
              <rect
                key={bar.key}
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                rx={3}
                fill={bar.color}
                opacity={focused ? 0.94 : 0.25}
                onPointerEnter={(event) => {
                  setHoveredSeries(seriesIndex);
                  binding.onPointerEnter(event);
                }}
                onPointerMove={binding.onPointerMove}
                onPointerLeave={() => {
                  setHoveredSeries(null);
                  binding.onPointerLeave();
                }}
                onPointerCancel={() => {
                  setHoveredSeries(null);
                  binding.onPointerCancel();
                }}
                style={{ transition: 'opacity 160ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}
              />
            );
          })
        ))}
      </Frame>

      <div className="mt-2 flex flex-wrap gap-2">
        {legendSeries.map((series, index) => (
          <span
            key={series.name}
            className="inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md"
            style={{
              color: 'var(--text-secondary)',
              border: `1px solid ${chartTheme.surface.legendBorder}`,
              background: chartTheme.surface.legendBackground,
              opacity: hoveredSeries === null || hoveredSeries === index ? 1 : 0.4,
              transition: 'opacity 160ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: PALETTE[index % PALETTE.length] }}
            />
            {series.name}
          </span>
        ))}
        {compactLegend && chart.series.length > legendSeries.length && (
          <span
            className="inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md"
            style={{
              color: 'var(--text-secondary)',
              border: `1px solid ${chartTheme.surface.legendBorder}`,
              background: chartTheme.surface.legendBackground,
            }}
          >
            +{chart.series.length - legendSeries.length} more
          </span>
        )}
      </div>
      {tooltip.node}
    </div>
  );
}

function BoxPlotChart({ chart, height }: { chart: Extract<ChartData, { type: 'boxplot' }>; height: number }) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const tooltip = useFloatingTooltip(ref);
  const values = [...chart.min, ...chart.q1, ...chart.median, ...chart.q3, ...chart.max];

  if (chart.labels.length === 0 || values.length === 0) {
    return <div ref={ref} style={{ height }}><EmptyChart /></div>;
  }

  const yMin = safeMin(values);
  const yMax = safeMax(values);
  const layout = createFrameLayout(width, height, chart.labels, 'Series', 'Value');
  const { chartWidth, chartHeight, padding } = layout;
  const step = chart.labels.length > 1 ? chartWidth / (chart.labels.length - 1) : chartWidth;

  const toY = (value: number) => {
    const normalized = yMax === yMin ? 0.5 : (value - yMin) / (yMax - yMin);
    return padding.top + chartHeight - normalized * chartHeight;
  };

  return (
    <div ref={ref} style={{ height }} className="chart-shell relative">
      <Frame
        width={width}
        height={height}
        layout={layout}
        xTicks={chart.labels}
        xAxisTitle="Series"
        yAxisTitle="Value"
        yTicks={[0, 0.25, 0.5, 0.75, 1]}
        yFormatter={(tick) => (yMin + (yMax - yMin) * tick).toFixed(2)}
      >
        {chart.labels.map((label, index) => {
          const x = padding.left + index * step;
          const color = PALETTE[index % PALETTE.length];
          const boxTop = toY(chart.q3[index]);
          const boxBottom = toY(chart.q1[index]);
          const medianY = toY(chart.median[index]);
          const minY = toY(chart.min[index]);
          const maxY = toY(chart.max[index]);
          const boxWidth = Math.min(step * 0.44, 32);

          return (
            <g key={`${label}-${index}`} {...tooltip.bind({
              title: label,
              value: `min ${chart.min[index].toFixed(2)} / q1 ${chart.q1[index].toFixed(2)} / median ${chart.median[index].toFixed(2)} / q3 ${chart.q3[index].toFixed(2)} / max ${chart.max[index].toFixed(2)}`,
              color,
            })}>
              <line x1={x} y1={maxY} x2={x} y2={minY} stroke={color} strokeOpacity="0.86" strokeWidth={1.5} />
              <line x1={x - boxWidth * 0.4} y1={maxY} x2={x + boxWidth * 0.4} y2={maxY} stroke={color} strokeOpacity="0.86" strokeWidth={1.5} />
              <line x1={x - boxWidth * 0.4} y1={minY} x2={x + boxWidth * 0.4} y2={minY} stroke={color} strokeOpacity="0.86" strokeWidth={1.5} />
              <rect
                x={x - boxWidth / 2}
                y={boxTop}
                width={boxWidth}
                height={Math.max(boxBottom - boxTop, 1)}
                fill={`${color}2b`}
                stroke={color}
                strokeWidth={1.4}
                rx={4}
              />
              <line x1={x - boxWidth / 2} y1={medianY} x2={x + boxWidth / 2} y2={medianY} stroke={color} strokeWidth={2} />
            </g>
          );
        })}
      </Frame>
      {tooltip.node}
    </div>
  );
}

function HeatmapChart({ chart, height }: { chart: Extract<ChartData, { type: 'heatmap' }>; height: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltip = useFloatingTooltip(containerRef);
  const values = chart.z.flat();

  if (values.length === 0) {
    return <div style={{ height }}><EmptyChart /></div>;
  }

  const min = safeMin(values);
  const max = safeMax(values);

  return (
    <div ref={containerRef} className="chart-entry chart-shell relative overflow-auto rounded-2xl" style={{ height }}>
      <div
        className="grid gap-1.5 p-1.5 rounded-xl"
        style={{
          gridTemplateColumns: `minmax(96px, auto) repeat(${chart.xLabels.length}, minmax(74px, 1fr))`,
        }}
      >
        <div />
        {chart.xLabels.map((label, col) => (
          <div key={`x-${label}-${col}`} className="text-[12px] text-center px-1" style={{ color: AXIS_TEXT }}>
            {truncateLabel(label, 14)}
          </div>
        ))}

        {chart.yLabels.map((rowLabel, row) => (
          <Fragment key={`row-${rowLabel}-${row}`}>
            <div
              className="text-[12px] px-2 py-2 rounded-md flex items-center"
              style={{ color: AXIS_TEXT, background: chartTheme.surface.legendBackground }}
            >
              {truncateLabel(rowLabel, 14)}
            </div>
            {chart.z[row]?.map((value, col) => {
              const isEq = chart.equilibriumCells.some((cell) => cell.row === row && cell.col === col);
              return (
                <div
                  key={`cell-${row}-${col}`}
                  className="relative rounded-md h-10 md:h-11 grid place-items-center text-[11px] font-semibold"
                  style={{
                    color: chartTheme.geometry.heatText,
                    background: mapHeat(value, min, max),
                    border: isEq
                      ? `1px solid ${chartTheme.geometry.heatBorderStrong}`
                      : `1px solid ${chartTheme.geometry.heatBorderSoft}`,
                  }}
                  {...tooltip.bind({
                    title: `${rowLabel} vs ${chart.xLabels[col]}`,
                    value: value.toFixed(4),
                    color: chartTheme.geometry.heatText,
                  })}
                >
                  {value.toFixed(2)}
                  {isEq && (
                    <span className="absolute top-0.5 right-1 text-[10px]" style={{ color: chartTheme.geometry.equilibriumMark }}>
                      ★
                    </span>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
      {tooltip.node}
    </div>
  );
}

function PieChart({ chart, height }: { chart: Extract<ChartData, { type: 'pie' }>; height: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltip = useFloatingTooltip(containerRef);
  const total = chart.values.reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return <div style={{ height }}><EmptyChart /></div>;
  }

  const gradientParts = chart.values.reduce(
    (acc, value, index) => {
      const end = acc.cursor + (value / total) * 360;
      return {
        cursor: end,
        parts: [...acc.parts, `${PALETTE[index % PALETTE.length]} ${acc.cursor.toFixed(2)}deg ${end.toFixed(2)}deg`],
      };
    },
    { cursor: 0, parts: [] as string[] },
  ).parts;

  return (
    <div ref={containerRef} className="chart-entry chart-shell relative" style={{ height }}>
      <div className="h-full grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4">
        <div className="relative w-[160px] h-[160px] mx-auto">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}
          />
          <div
            className="absolute inset-[28%] rounded-full"
            style={{
              background: chartTheme.surface.chartBackground,
              border: `1px solid ${chartTheme.surface.chartBorder}`,
            }}
          />
        </div>

        <div className="space-y-2">
          {chart.labels.map((label, index) => {
            const value = chart.values[index] ?? 0;
            const pct = (value / total) * 100;
            const color = PALETTE[index % PALETTE.length];
            return (
              <div
                key={`${label}-${index}`}
                className="flex items-center justify-between gap-3 text-xs px-2.5 py-2 rounded-lg"
                style={{
                  background: chartTheme.surface.legendBackground,
                  border: `1px solid ${chartTheme.surface.legendBorder}`,
                }}
                {...tooltip.bind({
                  title: label,
                  value: `${value.toFixed(2)} (${pct.toFixed(1)}%)`,
                  color,
                })}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  {label}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{`${value.toFixed(2)} (${pct.toFixed(1)}%)`}</span>
              </div>
            );
          })}
        </div>
      </div>
      {tooltip.node}
    </div>
  );
}

export const ChartRenderer = memo(function ChartRenderer({ chart, height = 300 }: { chart: ChartData; height?: number }) {
  switch (chart.type) {
    case 'histogram':
      return <HistogramChart chart={chart} height={height} />;
    case 'cdf':
      return <CdfChart chart={chart} height={height} />;
    case 'boxplot':
      return <BoxPlotChart chart={chart} height={height} />;
    case 'time_series':
      return <TimeSeriesChart chart={chart} height={height} />;
    case 'heatmap':
      return <HeatmapChart chart={chart} height={height} />;
    case 'bar':
      return <GroupedBarChart chart={chart} height={height} />;
    case 'pie':
      return <PieChart chart={chart} height={height} />;
    default:
      return <div style={{ height }}><EmptyChart /></div>;
  }
});

function isMobileLowPerformance() {
  if (typeof window === 'undefined') {
    return false;
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 768px)').matches;
  if (!mobile) {
    return false;
  }
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  return reduced || memory <= 4 || cores <= 4;
}

function Fallback3DScene({ label }: { label: string }) {
  return (
    <div
      className="w-full h-full rounded-2xl overflow-hidden grid place-items-center"
      style={{
        border: `1px solid ${chartTheme.surface.chartBorder}`,
        background: chartTheme.surface.fallback3DBackground,
      }}
    >
      <div className="text-center px-6">
        <p className="text-sm font-semibold">3D fallback visualization active</p>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
      </div>
    </div>
  );
}

export const Chart3DRenderer = memo(function Chart3DRenderer({
  viz,
  height = 500,
  active = true,
}: {
  viz: Visualization3D;
  height?: number;
  active?: boolean;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<{ domElement: HTMLCanvasElement } | null>(null);
  const cameraRef = useRef<{ position: { set: (x: number, y: number, z: number) => void } } | null>(null);
  const controlsRef = useRef<{ target: { set: (x: number, y: number, z: number) => void }; update: () => void } | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lowPerfMobile = useMemo(() => isMobileLowPerformance(), []);

  const normalized = useMemo(() => viz, [viz]);
  const axisTitles = useMemo(() => {
    if (normalized.plotType === 'multi_scatter3d') {
      return {
        x: normalized.xTitle,
        y: normalized.yTitle,
        z: normalized.zTitle,
      };
    }
    return {
      x: normalized.xTitle,
      y: normalized.yTitle,
      z: normalized.zTitle,
    };
  }, [normalized]);

  useEffect(() => {
    const onFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);

  const resetCamera = () => {
    const camera = cameraRef.current as unknown as { position?: { set: (x: number, y: number, z: number) => void } };
    const controls = controlsRef.current;
    if (!camera?.position || !controls) {
      return;
    }

    camera.position.set(0, 2.1, 6.8);
    controls.target.set(0, 0, 0);
    controls.update();
  };

  const toggleFullscreen = async () => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    if (!document.fullscreenElement) {
      await shell.requestFullscreen();
      return;
    }
    await document.exitFullscreen();
  };

  const exportScreenshot = () => {
    const renderer = rendererRef.current;
    if (!renderer?.domElement) {
      return;
    }

    const link = document.createElement('a');
    link.href = renderer.domElement.toDataURL('image/png');
    link.download = `math-intellect-3d-${Date.now()}.png`;
    link.click();
  };

  useEffect(() => {
    if (!active || lowPerfMobile) {
      setReady(false);
      setError(null);
      return;
    }

    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    let alive = true;
    let rafId = 0;
    let cleanup = () => {};
    rendererRef.current = null;
    cameraRef.current = null;
    controlsRef.current = null;
    setReady(false);
    setError(null);

    const boot = async () => {
      try {
        const THREE = await import('three');
        const controlsModule = await import('three/examples/jsm/controls/OrbitControls.js');
        const OrbitControls = controlsModule.OrbitControls;
        if (!alive || !mountRef.current) {
          return;
        }

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(chartTheme.threeD.fogColor, chartTheme.threeD.fogDensity);

        const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
        camera.position.set(0, 2.1, 6.8);
        cameraRef.current = camera as unknown as { position: { set: (x: number, y: number, z: number) => void } };

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setClearAlpha(0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
        rendererRef.current = renderer as unknown as { domElement: HTMLCanvasElement };

        const group = new THREE.Group();
        scene.add(group);

        const ambient = new THREE.AmbientLight(chartTheme.threeD.ambientColor, 0.62);
        const key = new THREE.DirectionalLight(chartTheme.threeD.directionalColor, 1.05);
        key.position.set(2.5, 3.5, 3.8);
        const rim = new THREE.DirectionalLight(chartTheme.threeD.rimColor, 0.35);
        rim.position.set(-3, 1.2, -2.4);
        const accent = new THREE.PointLight(chartTheme.threeD.pointColor, 0.8, 18);
        accent.position.set(0, 2.4, 3.2);
        scene.add(ambient, key, rim, accent);

        const toFloat = (value: number | string, fallback: number) => {
          const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
          return Number.isFinite(parsed) ? parsed : fallback;
        };

        const toRange = (values: number[]) => {
          const min = safeMin(values);
          const max = safeMax(values);
          return { min, max };
        };

        const paintVertices = (buffer: Float32Array, zValues: number[], min: number, max: number) => {
          for (let index = 0; index < zValues.length; index += 1) {
            const value = zValues[index];
            const t = max === min ? 0.5 : clamp((value - min) / (max - min), 0, 1);
            const c = hexToRgb(mapHeat(t, 0, 1));
            const ci = index * 3;
            buffer[ci] = c.r / 255;
            buffer[ci + 1] = c.g / 255;
            buffer[ci + 2] = c.b / 255;
          }
        };

        let hasRenderableGeometry = false;

        if (normalized.plotType === 'surface') {
          const xCount = Math.max(normalized.x.length, 2);
          const yCount = Math.max(normalized.y.length, 2);
          const zFlat = normalized.z.flat().filter((value) => Number.isFinite(value));

          if (zFlat.length > 0) {
            const zRange = toRange(zFlat);
            const geometry = new THREE.PlaneGeometry(7, 5, xCount - 1, yCount - 1);
            const positions = geometry.attributes.position.array as Float32Array;

            for (let row = 0; row < yCount; row += 1) {
              for (let col = 0; col < xCount; col += 1) {
                const i = row * xCount + col;
                const z = normalized.z[row]?.[col] ?? 0;
                const nz = zRange.max === zRange.min ? 0 : (z - zRange.min) / (zRange.max - zRange.min);
                positions[i * 3 + 2] = (nz - 0.5) * 2.4;
              }
            }

            const colors = new Float32Array(xCount * yCount * 3);
            const zForColors = Array.from({ length: xCount * yCount }, (_, index) => {
              const row = Math.floor(index / xCount);
              const col = index % xCount;
              return normalized.z[row]?.[col] ?? 0;
            });
            paintVertices(colors, zForColors, zRange.min, zRange.max);
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.computeVertexNormals();

            const mesh = new THREE.Mesh(
              geometry,
              new THREE.MeshStandardMaterial({
                vertexColors: true,
                metalness: 0.16,
                roughness: 0.32,
                emissive: new THREE.Color(chartTheme.geometry.linePrimary),
                emissiveIntensity: 0.12,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.96,
              }),
            );
            mesh.rotation.x = -1.05;
            mesh.position.y = -0.2;
            group.add(mesh);

            const wire = new THREE.LineSegments(
              new THREE.WireframeGeometry(geometry),
              new THREE.LineBasicMaterial({
                color: 0xb6dcff,
                transparent: true,
                opacity: 0.3,
              }),
            );
            wire.rotation.copy(mesh.rotation);
            wire.position.copy(mesh.position);
            group.add(wire);
            hasRenderableGeometry = true;
          }
        } else if (normalized.plotType === 'scatter3d') {
          const length = Math.min(normalized.x.length, normalized.y.length, normalized.z.length);
          if (length > 0) {
            const xValues = normalized.x.slice(0, length).map((value, index) => toFloat(value, index));
            const yValues = normalized.y.slice(0, length).map((value, index) => toFloat(value, index));
            const zValues = normalized.z.slice(0, length).map((value, index) => toFloat(value, index));

            const xRange = toRange(xValues);
            const yRange = toRange(yValues);
            const zRange = toRange(zValues);

            const points = new Float32Array(length * 3);
            for (let index = 0; index < length; index += 1) {
              const nx = xRange.max === xRange.min ? 0 : (xValues[index] - xRange.min) / (xRange.max - xRange.min);
              const ny = yRange.max === yRange.min ? 0 : (yValues[index] - yRange.min) / (yRange.max - yRange.min);
              const nz = zRange.max === zRange.min ? 0 : (zValues[index] - zRange.min) / (zRange.max - zRange.min);
              points[index * 3] = (nx - 0.5) * 6.2;
              points[index * 3 + 1] = (nz - 0.5) * 3;
              points[index * 3 + 2] = (ny - 0.5) * 4.8;
            }

            const colors = new Float32Array(length * 3);
            const colorValues = normalized.colorValues?.slice(0, length) ?? zValues;
            paintVertices(colors, colorValues, safeMin(colorValues), safeMax(colorValues));

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const cloud = new THREE.Points(
              geometry,
              new THREE.PointsMaterial({
                size: 0.11,
                sizeAttenuation: true,
                vertexColors: true,
                transparent: true,
                opacity: 0.92,
              }),
            );
            group.add(cloud);

            if (normalized.mode.includes('lines')) {
              const line = new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({ color: 0x9fdef9, transparent: true, opacity: 0.44 }),
              );
              group.add(line);
            }

            hasRenderableGeometry = true;
          }
        } else if (normalized.plotType === 'multi_scatter3d') {
          normalized.traces.forEach((trace, traceIndex) => {
            const length = Math.min(trace.x.length, trace.y.length, trace.z.length);
            if (length === 0) {
              return;
            }

            const xValues = trace.x.slice(0, length).map((value, index) => toFloat(value, index));
            const yValues = trace.y.slice(0, length).map((value, index) => toFloat(value, index));
            const zValues = trace.z.slice(0, length).map((value, index) => toFloat(value, index));
            const xRange = toRange(xValues);
            const yRange = toRange(yValues);
            const zRange = toRange(zValues);

            const points = new Float32Array(length * 3);
            for (let index = 0; index < length; index += 1) {
              const nx = xRange.max === xRange.min ? 0 : (xValues[index] - xRange.min) / (xRange.max - xRange.min);
              const ny = yRange.max === yRange.min ? 0 : (yValues[index] - yRange.min) / (yRange.max - yRange.min);
              const nz = zRange.max === zRange.min ? 0 : (zValues[index] - zRange.min) / (zRange.max - zRange.min);
              points[index * 3] = (nx - 0.5) * 6.2;
              points[index * 3 + 1] = (nz - 0.5) * 3;
              points[index * 3 + 2] = (ny - 0.5) * 4.8;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
            const color = new THREE.Color(PALETTE[traceIndex % PALETTE.length]);

            group.add(new THREE.Line(
              geometry,
              new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.76 }),
            ));
            group.add(new THREE.Points(
              geometry,
              new THREE.PointsMaterial({
                color,
                size: 0.1,
                sizeAttenuation: true,
                transparent: true,
                opacity: 0.9,
              }),
            ));

            hasRenderableGeometry = true;
          });
        }

        if (!hasRenderableGeometry) {
          const grid = new THREE.GridHelper(8, 16, chartTheme.threeD.fallbackGridColor, chartTheme.threeD.fallbackGridColor);
          grid.position.y = -1.2;
          const gridMaterial = grid.material as { transparent?: boolean; opacity?: number };
          gridMaterial.transparent = true;
          gridMaterial.opacity = 0.34;
          group.add(grid);

          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.9, 42, 28),
            new THREE.MeshPhysicalMaterial({
              color: chartTheme.threeD.fallbackSphereColor,
              emissive: chartTheme.threeD.fallbackSphereColor,
              emissiveIntensity: 0.24,
              metalness: 0.2,
              roughness: 0.3,
              clearcoat: 1,
              clearcoatRoughness: 0.12,
              transparent: true,
              opacity: 0.96,
            }),
          );
          sphere.position.y = -0.05;
          group.add(sphere);

          const orbit = new THREE.Mesh(
            new THREE.TorusGeometry(1.55, 0.02, 14, 96),
            new THREE.MeshBasicMaterial({
              color: chartTheme.threeD.fallbackGridColor,
              transparent: true,
              opacity: 0.42,
            }),
          );
          orbit.rotation.x = Math.PI / 2;
          orbit.position.y = -0.05;
          group.add(orbit);
        }

        const glow = new THREE.Mesh(
          new THREE.CircleGeometry(2.7, 40),
          new THREE.MeshBasicMaterial({
            color: 0x64e8d9,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        glow.position.set(0, 1.5, -1.4);
        scene.add(glow);

        const pointer = { x: 0, y: 0 };
        const target = { x: 0, y: 0 };
        const center = new THREE.Vector3(0, 0, 0);
        const minDistance = 2.8;

        let lastInteractionAt = performance.now();

        const touchInteraction = () => {
          lastInteractionAt = performance.now();
        };

        const updatePointer = (event: PointerEvent) => {
          const rect = mount.getBoundingClientRect();
          if (!rect.width || !rect.height) {
            return;
          }
          target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          target.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
          touchInteraction();
        };
        const resetPointer = () => {
          target.x = 0;
          target.y = 0;
        };

        const resize = () => {
          const width = Math.max(1, mount.clientWidth);
          const sceneHeight = Math.max(1, mount.clientHeight);
          camera.aspect = width / sceneHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(width, sceneHeight, false);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
        };

        resize();
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.minDistance = minDistance;
        controls.maxDistance = 12.5;
        controls.maxPolarAngle = Math.PI * 0.48;
        controls.target.set(0, 0, 0);
        controls.update();
        controls.addEventListener('start', touchInteraction);
        controls.addEventListener('change', touchInteraction);
        controlsRef.current = controls as unknown as { target: { set: (x: number, y: number, z: number) => void }; update: () => void };

        const clock = new THREE.Clock();
        const animate = () => {
          if (!alive) {
            return;
          }
          rafId = requestAnimationFrame(animate);
          const t = clock.getElapsedTime();
          pointer.x = lerp(pointer.x, target.x, 0.08);
          pointer.y = lerp(pointer.y, target.y, 0.08);

          const idle = performance.now() - lastInteractionAt > 1300;
          if (idle) {
            group.rotation.y += 0.003;
          } else {
            group.rotation.y = Math.sin(t * 0.24) * 0.1 + pointer.x * 0.1;
          }

          group.rotation.x = -0.04 + pointer.y * 0.05;
          glow.rotation.z = -t * 0.15;

          controls.update();
          const controlsTarget = controls.target.clone();
          const distance = camera.position.distanceTo(controlsTarget);
          if (distance < minDistance) {
            const direction = camera.position.clone().sub(controlsTarget).normalize();
            camera.position.copy(controlsTarget.clone().add(direction.multiplyScalar(minDistance)));
          }

          camera.lookAt(center);
          renderer.render(scene, camera);
        };

        animate();
        setReady(true);

        mount.addEventListener('pointermove', updatePointer);
        mount.addEventListener('pointerleave', resetPointer);
        mount.addEventListener('wheel', touchInteraction, { passive: true });
        window.addEventListener('resize', resize);

        cleanup = () => {
          window.removeEventListener('resize', resize);
          mount.removeEventListener('pointermove', updatePointer);
          mount.removeEventListener('pointerleave', resetPointer);
          mount.removeEventListener('wheel', touchInteraction);
          cancelAnimationFrame(rafId);
          controls.removeEventListener('start', touchInteraction);
          controls.removeEventListener('change', touchInteraction);
          controls.dispose();
          renderer.dispose();
          scene.traverse((object) => {
            if ('geometry' in object) {
              (object.geometry as { dispose?: () => void }).dispose?.();
            }
            if ('material' in object) {
              const mat = object.material as { dispose?: () => void } | Array<{ dispose?: () => void }>;
              if (Array.isArray(mat)) {
                mat.forEach((item) => item.dispose?.());
              } else {
                mat.dispose?.();
              }
            }
          });
          if (renderer.domElement.parentNode === mount) {
            mount.removeChild(renderer.domElement);
          }
        };
      } catch (cause) {
        console.error('3D renderer failed', cause);
        if (alive) {
          setError('Unable to render 3D chart');
        }
      }
    };

    void boot();

    return () => {
      alive = false;
      cleanup();
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
    };
  }, [active, lowPerfMobile, normalized]);

  if (!active || lowPerfMobile) {
    return (
      <div ref={shellRef} className="relative" style={{ height }}>
        <Fallback3DScene label="Interactive 3D is auto-downgraded on this device for stable performance." />
      </div>
    );
  }

  return (
    <div ref={shellRef} className="relative" style={{ height }}>
      {!ready && !error && (
        <div className="absolute inset-0 grid place-items-center z-10">
          <Loader size="sm" message="Loading 3D…" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 grid place-items-center text-sm" style={{ color: 'var(--text-muted)' }}>
          <Fallback3DScene label={error} />
        </div>
      )}
      <div
        className="absolute left-3 bottom-3 z-20 rounded-lg px-3 py-2 text-[11px] hidden md:block"
        style={{ border: chartTheme.surface.controlBorder, background: chartTheme.surface.controlBackground, color: 'var(--text-secondary)' }}
      >
        <div><span style={{ color: 'var(--text-muted)' }}>X:</span> {axisTitles.x}</div>
        <div><span style={{ color: 'var(--text-muted)' }}>Y:</span> {axisTitles.y}</div>
        <div><span style={{ color: 'var(--text-muted)' }}>Z:</span> {axisTitles.z}</div>
      </div>
      <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg px-2.5 py-1.5 text-[11px]"
          style={{ border: chartTheme.surface.controlBorder, background: chartTheme.surface.controlBackground, color: 'var(--text-primary)' }}
          onClick={resetCamera}
          data-ripple
        >
          Reset
        </button>
        <button
          type="button"
          className="rounded-lg px-2.5 py-1.5 text-[11px]"
          style={{ border: chartTheme.surface.controlBorder, background: chartTheme.surface.controlBackground, color: 'var(--text-primary)' }}
          onClick={toggleFullscreen}
          data-ripple
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        <button
          type="button"
          className="rounded-lg px-2.5 py-1.5 text-[11px]"
          style={{ border: chartTheme.surface.controlBorder, background: chartTheme.surface.controlBackground, color: 'var(--text-primary)' }}
          onClick={exportScreenshot}
          data-ripple
        >
          Screenshot
        </button>
      </div>
      <div ref={mountRef} className="w-full h-full chart-entry rounded-2xl overflow-hidden" />
    </div>
  );
});
