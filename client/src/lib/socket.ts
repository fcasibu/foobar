import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_SERVER_URL);

// type SocketMessage = {
//     type: string;
//     data: unknown;
// };
//
// export class SocketClient {
//     private socket: Socket;
//
//     constructor(readonly url: string) {
//         this.socket = io(url);
//     }
//
//     public sendMessage(message: SocketMessage) {
//         this.socket.emit('message', message);
//     }
//
//     public connect() {
//         this.socket.connect();
//     }
//
//     public disconnect() {
//         this.socket.disconnect();
//     }
// }
