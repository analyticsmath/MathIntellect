import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/app.logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new AppLogger();

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
        AllExceptionsFilter.name,
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message:
        typeof message === 'object' && 'message' in message
          ? (message as { message: string }).message
          : message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
