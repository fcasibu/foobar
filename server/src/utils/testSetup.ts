import express, { Express, Router } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IncomingMessage, Server, ServerResponse } from 'http';
import mongoose from 'mongoose';

let connection: Server<typeof IncomingMessage, typeof ServerResponse> | null;
let mongoServer: MongoMemoryServer | null;

async function initializeMongoServer() {
    try {
        mongoServer = await MongoMemoryServer.create();
        mongoose.connect(mongoServer.getUri());
    } catch (e) {
        console.error(`Unable to connect to mongo server.`, e);
    }
}

export function initializeTestServer(
    routePath: string,
    router: Router,
): Promise<Express> {
    return new Promise((resolve) => {
        const app = express();
        initializeMongoServer();

        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        app.use(routePath, router);

        connection = app.listen(null, () => {
            resolve(app);
        });
    });
}

export async function clearCollections() {
    const { collections } = mongoose.connection;

    await Promise.all(
        Object.values(collections).map(
            (collection) => collection?.deleteMany(),
        ),
    );
}

export async function closeTestServer() {
    connection?.close();
    await clearCollections();
    await mongoose.disconnect();
    await mongoServer?.stop();
    connection = null;
    mongoServer = null;
}
