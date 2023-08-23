import mongoose from 'mongoose';
import { SocketServer } from 'services';
import app from './app';

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to mongodb.');

    const server = app.listen(process.env.PORT, () => {
        console.log(
            `Server is running at http://localhost:${process.env.PORT}`,
        );
    });

    const socketService = new SocketServer(server);
    socketService.init();
});
