import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IncomingMessage, Server, ServerResponse } from 'http';
import mongoose from 'mongoose';

let connection: Server<typeof IncomingMessage, typeof ServerResponse>;
let mongoServer: MongoMemoryServer;

export async function initializeTestServer() {
    const app = express();
    mongoServer = await MongoMemoryServer.create();

    mongoose.connect(mongoServer.getUri());

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    connection = app.listen(null, () => {
        console.log('Test server started');
    });
}

export async function closeTestServer() {
    connection.close(() => console.log('Test server closed'));
    await mongoose.disconnect();
    await mongoServer.stop();
}

export async function clearCollections() {
    const collections = mongoose.connection.collection;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}
