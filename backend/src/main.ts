import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppLogger } from './common/logger/app.logger';

const DEV_DEFAULT_ORIGIN = 'http://localhost:5173';
const REQUIRED_PRODUCTION_ENV = ['DATABASE_URL', 'JWT_SECRET'];

function parseAllowedOrigins(): string[] {
  const raw = [process.env.FRONTEND_URL, process.env.CORS_ORIGIN]
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set([...raw, DEV_DEFAULT_ORIGIN]));
}

function assertRequiredEnv(logger: AppLogger): void {
  if ((process.env.NODE_ENV ?? 'development') !== 'production') {
    return;
  }

  const missing = REQUIRED_PRODUCTION_ENV.filter(
    (key) => !process.env[key] || process.env[key]?.trim().length === 0,
  );

  if (missing.length > 0) {
    logger.error(
      `Missing required production env vars: ${missing.join(', ')}`,
      undefined,
      'Bootstrap',
    );
    throw new Error(`Missing required production env vars: ${missing.join(', ')}`);
  }
}

async function bootstrap() {
  const logger = new AppLogger();
  assertRequiredEnv(logger);

  const app = await NestFactory.create(AppModule, { logger });

  // WebSocket adapter (Socket.IO)
  app.useWebSocketAdapter(new IoAdapter(app));

  // CORS — restrict to known frontend origins
  const allowedOrigins = parseAllowedOrigins();
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // URI versioning — keeps v1 routes stable and enables v2 evolution
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global prefix — exclude /health so Docker/load-balancer can reach it without auth
  app.setGlobalPrefix('api', { exclude: ['health'] });

  // Global validation pipe — strip unknown fields, transform types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response wrapper
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = Number(process.env.PORT ?? 5000);
  logger.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`, 'Bootstrap');
  await app.listen(port);
  logger.log(
    `MathIntelDashboard API running on http://localhost:${port}/api/v1`,
    'Bootstrap',
  );
}
void bootstrap();
