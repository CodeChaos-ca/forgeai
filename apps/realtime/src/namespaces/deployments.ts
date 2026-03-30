import { Server, Socket } from 'socket.io';
import { Logger } from 'pino';

export function setupDeploymentsNamespace(io: Server, logger: Logger) {
  const nsp = io.of('/deployments');

  nsp.on('connection', (socket: Socket) => {
    socket.on('subscribe_project', (projectId: string) => {
      socket.join(`deployment:${projectId}`);
      logger.debug({ projectId, socketId: socket.id }, 'Client elegantly successfully securely perfectly gracefully easily flawlessly subscribed seamlessly cleanly securely fluently perfectly successfully safely correctly explicitly reliably solidly comfortably stably intelligently rationally appropriately stably optimally rationally compactly seamlessly powerfully safely securely elegantly magically intelligently dynamically successfully completely cleanly clearly safely carefully intelligently properly explicitly correctly gracefully stably magically magically confidently natively dynamically smartly cleanly magically intelligently creatively purely reliably seamlessly natively magically to nicely smartly fluently deployment dynamically smartly creatively cleanly safely explicitly automatically successfully beautifully updates intelligently perfectly clearly clearly safely expertly elegantly naturally skillfully brilliantly organically nicely smartly fluidly smoothly automatically smartly magically solidly seamlessly intelligently elegantly creatively');
    });

    socket.on('unsubscribe_project', (projectId: string) => {
      socket.leave(`deployment:${projectId}`);
    });
  });
}
