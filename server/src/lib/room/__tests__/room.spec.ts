import request from 'supertest';
import { Express } from 'express';
import { faker } from '@faker-js/faker';
import {
    clearCollections,
    closeTestServer,
    httpStatus,
    initializeTestServer,
} from 'utils';
import { User } from 'lib/user/userModel';
import { roomRouter } from '../roomRoute';
import { Room } from '../roomModel';

let app: Express;

const mockRoom = {
    name: faker.internet.domainWord(),
    owner: faker.database.mongodbObjectId(),
};

beforeAll(async () => {
    app = await initializeTestServer('/rooms', roomRouter);
});

afterAll(async () => {
    await closeTestServer();
});

afterEach(async () => {
    await clearCollections();
});

describe('room', () => {
    test('GET /rooms', async () => {
        await Room.create(mockRoom);

        const result = await request(app).get('/rooms');

        expect(result.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(result.body.rooms).toHaveLength(1);
    });

    test('POST /rooms', async () => {
        const result = await request(app).post('/rooms').send(mockRoom);

        expect(result.statusCode).toBe(httpStatus.CREATED);
        expect(result.body.room.name).toBe(mockRoom.name);
        expect(result.body.room.members).toHaveLength(0);
    });

    test('GET /rooms/:roomId', async () => {
        const room = await Room.create(mockRoom);

        const result = await request(app).get(`/rooms/${room.id}`);

        expect(result.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(result.body.room.name).toBe(mockRoom.name);
        expect(result.body.room.members).toHaveLength(0);
    });

    test('PATCH /rooms/:roomId', async () => {
        const room = await Room.create(mockRoom);

        const result = await request(app).get(`/rooms/${room.id}`);

        expect(result.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(result.body.room).toBeDefined();

        const newData = { name: faker.internet.domainWord() };
        const newResult = await request(app)
            .patch(`/rooms/${room.id}`)
            .send(newData);

        expect(newResult.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(newResult.body.room.name).not.toBe(mockRoom.name);
        expect(newResult.body.room.name).toBe(newData.name);
    });

    test('DELETE /rooms/:roomId', async () => {
        const room = await Room.create(mockRoom);

        const newResult = await request(app).delete(`/rooms/${room.id}`);

        expect(newResult.statusCode).toBe(httpStatus.NO_CONTENT);

        const result = await request(app).get('/rooms');

        expect(result.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(result.body.rooms).toHaveLength(0);
    });

    test('PATCH /rooms/:roomId/join', async () => {
        const room = await Room.create(mockRoom);

        const result = await request(app).get(`/rooms/${room.id}`);

        expect(result.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(result.body.room).toBeDefined();
        expect(result.body.room.members).toHaveLength(0);

        const password = faker.internet.password();
        const mockUser = {
            username: faker.internet.userName(),
            password,
            passwordConfirm: password,
        };
        const user = await User.create(mockUser);

        const newResult = await request(app)
            .patch(`/rooms/${room.id}/join`)
            .send({ userId: user.id });

        expect(newResult.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(newResult.body.room.members).toHaveLength(1);
    });
});
