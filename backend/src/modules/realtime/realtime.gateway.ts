import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

const WS_ALLOWED_ORIGINS = Array.from(
  new Set(
    [process.env.FRONTEND_URL, process.env.CORS_ORIGIN, 'http://localhost:5173']
      .filter((origin): origin is string => Boolean(origin))
      .flatMap((origin) => origin.split(','))
      .map((origin) => origin.trim())
      .filter(Boolean),
  ),
);

@WebSocketGateway({
  cors: {
    origin: WS_ALLOWED_ORIGINS,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }
}
