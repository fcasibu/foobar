import request from 'supertest';
import { Express } from 'express';
import { faker } from '@faker-js/faker';
import {
    initializeTestServer,
    closeTestServer,
    clearCollections,
    httpStatus,
} from 'utils';
import { userRouter } from '../userRoute';
import { User } from '../userModel';

let app: Express;

const password = faker.internet.password();
const mockUser = {
    username: faker.internet.userName(),
    password,
    passwordConfirm: password,
};

beforeAll(async () => {
    import('lib/room/roomModel');
    app = await initializeTestServer('/users', userRouter);
});

afterAll(async () => {
    await closeTestServer();
});

afterEach(async () => {
    await clearCollections();
});

describe('user', () => {
    test('GET /users', async () => {
        await User.create(mockUser);

        const result = await request(app).get('/users');

        expect(result.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(result.body.users).toHaveLength(1);
    });

    test('GET /users/:userId', async () => {
        const user = await User.create(mockUser);

        const result = await request(app).get(`/users/${user.id}`);

        expect(result.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(result.body.user.id).toBe(user.id);
        expect(result.body.user.username).toBe(user.username);
        expect(result.body.user.password).toBeUndefined();
        expect(result.body.user.passwordConfirm).toBeUndefined();
    });

    test('PATCH /users/:userId', async () => {
        const user = await User.create(mockUser);

        const result = await request(app).get(`/users/${user.id}`);

        expect(result.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(result.body.user.id).toBe(user.id);
        expect(result.body.user.username).toBe(user.username);
        expect(result.body.user.displayName).toBeUndefined();

        const newData = {
            displayName: faker.internet.displayName(),
        };

        const newResult = await request(app)
            .patch(`/users/${user.id}`)
            .send(newData);

        expect(newResult.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(newResult.body.user.displayName).not.toBeUndefined();
        expect(newResult.body.user.displayName).toBe(newData.displayName);
    });

    test('DELETE /users/:userId', async () => {
        const user = await User.create(mockUser);

        const result = await request(app).delete(`/users/${user.id}`);

        expect(result.statusCode).toBe(httpStatus.NO_CONTENT);

        const newResult = await request(app).get(`/users/${user.id}`);

        expect(newResult.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(newResult.body.user.isAccountDisabled).toBeTruthy();
    });
});
