import { LoggerService, LogLevel } from '@nestjs/common';

/**
 * Structured logger for MathIntelDashboard.
 *
 * In production (NODE_ENV=production): emits newline-delimited JSON to stdout/stderr.
 * In development: emits coloured human-readable output.
 *
 * Implements NestJS LoggerService so it can be passed to NestFactory.create()
 * and used as a drop-in replacement for the built-in Logger.
 */
export class AppLogger implements LoggerService {
  private readonly isProd = process.env.NODE_ENV === 'production';
  private readonly level = this.normalizeLevel(process.env.LOG_LEVEL);
  private readonly levelWeight: Record<string, number> = {
    error: 0,
    warn: 1,
    log: 2,
    debug: 3,
    verbose: 4,
  };

  private readonly COLORS = {
    log: '\x1b[32m', // green
    error: '\x1b[31m', // red
    warn: '\x1b[33m', // yellow
    debug: '\x1b[36m', // cyan
    verbose: '\x1b[35m', // magenta
  };

  private readonly RESET = '\x1b[0m';

  private normalizeLevel(level?: string): keyof AppLogger['levelWeight'] {
    const raw = (level ?? 'info').toLowerCase();
    if (raw === 'info') return 'log';
    if (raw in this.levelWeight) {
      return raw;
    }
    return 'log';
  }

  private shouldLog(level: string): boolean {
    const incoming = this.levelWeight[level] ?? this.levelWeight.log;
    const configured = this.levelWeight[this.level];
    return incoming <= configured;
  }

  private redact(text: string): string {
    return text
      .replace(/(postgres(?:ql)?:\/\/[^:\s/]+:)([^@/\s]+)@/gi, '$1***@')
      .replace(/(sk-[A-Za-z0-9_-]{10,})/g, 'sk-***')
      .replace(/(JWT_SECRET=)([^\s]+)/gi, '$1***')
      .replace(/(OPENAI_API_KEY=)([^\s]+)/gi, '$1***')
      .replace(/(DATABASE_URL=)([^\s]+)/gi, '$1***');
  }

  private sanitize(value: unknown): unknown {
    if (typeof value === 'string') {
      return this.redact(value);
    }

    if (value instanceof Error) {
      return {
        name: value.name,
        message: this.redact(value.message),
      };
    }

    if (value && typeof value === 'object') {
      try {
        return JSON.parse(this.redact(JSON.stringify(value)));
      } catch {
        return '[Unserializable object]';
      }
    }

    return value;
  }

  private write(
    level: string,
    message: unknown,
    context?: string,
    trace?: string,
  ) {
    if (!this.shouldLog(level)) {
      return;
    }

    const ts = new Date().toISOString();
    const safeMessage = this.sanitize(message);
    const safeTrace = trace ? this.redact(trace) : undefined;

    if (this.isProd) {
      // Structured JSON — parseable by log aggregators (CloudWatch, Datadog, etc.)
      const entry: Record<string, unknown> = {
        level,
        message: safeMessage,
        context,
        pid: process.pid,
        timestamp: ts,
      };
      if (safeTrace) entry.trace = safeTrace;
      const output = JSON.stringify(entry);
      if (level === 'error') {
        process.stderr.write(output + '\n');
      } else {
        process.stdout.write(output + '\n');
      }
    } else {
      // Human-readable with colour
      const color =
        this.COLORS[level as keyof typeof this.COLORS] ?? '\x1b[37m';
      const ctx = context ? `[${context}] ` : '';
      const line = `${color}[${level.toUpperCase()}]${this.RESET} ${ts} ${ctx}${String(safeMessage)}`;
      if (level === 'error') {
        console.error(line, safeTrace ? `\n${safeTrace}` : '');
      } else {
        console.log(line);
      }
    }
  }

  log(message: unknown, context?: string) {
    this.write('log', message, context);
  }
  error(message: unknown, trace?: string, context?: string) {
    this.write('error', message, context, trace);
  }
  warn(message: unknown, context?: string) {
    this.write('warn', message, context);
  }
  debug(message: unknown, context?: string) {
    this.write('debug', message, context);
  }
  verbose(message: unknown, context?: string) {
    this.write('verbose', message, context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLogLevels?(_levels: LogLevel[]) {
    /* honour NestJS contract */
  }
}
