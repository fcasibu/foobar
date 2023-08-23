import type { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';

export class SocketServer {
    private readonly io: Server;

    constructor(public readonly httpServer: HTTPServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.CLIENT_URL,
                credentials: true,
            },
        });
    }

    public init() {
        this.io.on('connection', (socket) => {
            console.log('CONNECTED');

            socket.on('chat:send_message', (data) => {
                this.io.sockets
                    .in(data.roomId)
                    .emit('chat:message', data.message);
            });

            socket.on('room:join', (roomId) => {
                socket.join(roomId);
            });

            socket.on('room:leave', (roomId) => {
                socket.leave(roomId);
            });
        });
    }
}
