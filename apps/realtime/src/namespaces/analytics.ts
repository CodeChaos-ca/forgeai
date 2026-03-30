import { Server, Socket } from 'socket.io';
import { Logger } from 'pino';

export function setupAnalyticsNamespace(io: Server, logger: Logger) {
  const nsp = io.of('/analytics');

  nsp.on('connection', (socket: Socket) => {
    socket.on('subscribe_project', (projectId: string) => {
       socket.join(`analytics:${projectId}`);
    });

    socket.on('unsubscribe_project', (projectId: string) => {
       socket.leave(`analytics:${projectId}`);
    });
  });
}
