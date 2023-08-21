import request from 'supertest';
import { Express } from 'express';
import { faker } from '@faker-js/faker';
import { initializeTestServer, closeTestServer, clearCollections } from 'utils';
import { userRouter } from '../userRoute';
import { User } from '../userModel';

let app: Express;

beforeAll(async () => {
    app = await initializeTestServer('/users', userRouter);
});

afterAll(async () => {
    await closeTestServer();
});

afterEach(() => {
    clearCollections();
});

describe('user', () => {
    test('GET /users', async () => {
        const password = faker.internet.password();
        const mockUser = {
            username: faker.internet.userName(),
            password,
            passwordConfirm: password,
        };
        await User.create(mockUser);

        const result = await request(app).get(`/users`);

        expect(result.statusCode).toBe(200);
        expect(result.body.users).toHaveLength(1);
    });

    test('GET /users/:userId', async () => {
        const password = faker.internet.password();
        const mockUser = {
            username: faker.internet.userName(),
            password,
            passwordConfirm: password,
        };
        const user = await User.create(mockUser);

        const result = await request(app).get(`/users/${user.id}`);

        expect(result.statusCode).toBe(200);
        expect(result.body.user.id).toBe(user.id);
        expect(result.body.user.username).toBe(user.username);
        expect(result.body.user.password).toBeUndefined();
        expect(result.body.user.passwordConfirm).toBeUndefined();
    });

    test('PUT /users/:userId', async () => {
        const password = faker.internet.password();
        const mockUser = {
            username: faker.internet.userName(),
            password,
            passwordConfirm: password,
        };
        const user = await User.create(mockUser);

        const result = await request(app).get(`/users/${user.id}`);

        expect(result.statusCode).toBe(200);
        expect(result.body.user.id).toBe(user.id);
        expect(result.body.user.username).toBe(user.username);
        expect(result.body.user.displayName).toBeUndefined();

        const newData = {
            displayName: faker.internet.displayName(),
        };

        const newResult = await request(app)
            .patch(`/users/${user.id}`)
            .send(newData);

        expect(newResult.body.user.displayName).toBe(newData.displayName);
    });

    test('DELETE /users/:userId', async () => {
        const password = faker.internet.password();
        const mockUser = {
            username: faker.internet.userName(),
            password,
            passwordConfirm: password,
        };
        const user = await User.create(mockUser);

        const result = await request(app).delete(`/users/${user.id}`);

        expect(result.statusCode).toBe(200);

        const newResult = await request(app).get('/users');

        expect(newResult.statusCode).toBe(200);
        expect(newResult.body.users).toHaveLength(0);
    });
});
