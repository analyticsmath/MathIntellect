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

  private readonly COLORS = {
    log: '\x1b[32m', // green
    error: '\x1b[31m', // red
    warn: '\x1b[33m', // yellow
    debug: '\x1b[36m', // cyan
    verbose: '\x1b[35m', // magenta
  };

  private readonly RESET = '\x1b[0m';

  private write(
    level: string,
    message: unknown,
    context?: string,
    trace?: string,
  ) {
    const ts = new Date().toISOString();

    if (this.isProd) {
      // Structured JSON — parseable by log aggregators (CloudWatch, Datadog, etc.)
      const entry: Record<string, unknown> = {
        level,
        message,
        context,
        pid: process.pid,
        timestamp: ts,
      };
      if (trace) entry.trace = trace;
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
      const line = `${color}[${level.toUpperCase()}]${this.RESET} ${ts} ${ctx}${message}`;
      if (level === 'error') {
        console.error(line, trace ? `\n${trace}` : '');
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

  setLogLevels?(_levels: LogLevel[]) {
    /* honour NestJS contract */
  }
}
