import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppLogger } from './common/logger/app.logger';

async function bootstrap() {
  const logger = new AppLogger();
  const app = await NestFactory.create(AppModule, { logger });

  // WebSocket adapter (Socket.IO)
  app.useWebSocketAdapter(new IoAdapter(app));

  // CORS — allow frontend origin
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  logger.log(
    `MathIntelDashboard API running on http://localhost:${port}/api/v1`,
    'Bootstrap',
  );
}
void bootstrap();
