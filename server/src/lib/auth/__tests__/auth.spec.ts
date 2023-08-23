import request from 'supertest';
import { Express } from 'express';
import { faker } from '@faker-js/faker';
import { User } from 'lib/user';
import {
    clearCollections,
    closeTestServer,
    httpStatus,
    initializeTestServer,
} from 'utils';
import { authRouter } from '../authRoute';

jest.mock('utils/jwt', () => ({
    sign: jest.fn().mockReturnValue(''),
    verify: jest.fn().mockReturnValue(true),
}));

let app: Express;

beforeAll(async () => {
    import('lib/room/roomModel');
    app = await initializeTestServer('/auth', authRouter);
});

afterAll(async () => {
    await closeTestServer();
});

afterEach(async () => {
    await clearCollections();
});

describe('auth', () => {
    test('POST /login', async () => {
        const mockUser = {
            username: faker.internet.userName().toLowerCase(),
            password: faker.internet.password(),
        };

        const result = await request(app).post('/auth/login').send(mockUser);

        expect(result.statusCode).toBe(httpStatus.NOT_FOUND);

        await User.create(mockUser);

        const newResult = await request(app).post('/auth/login').send(mockUser);

        expect(newResult.statusCode).toBe(httpStatus.SUCCESSFUL);
        expect(newResult.body.user.username).toBe(mockUser.username);
        expect(newResult.body.token).toBeDefined();
    });

    test('POST /register', async () => {
        const password = faker.internet.password();
        const mockUser = {
            username: faker.internet.userName().toLowerCase(),
            password,
            passwordConfirm: password,
        };

        const result = await request(app).post('/auth/register').send(mockUser);

        expect(result.statusCode).toBe(httpStatus.CREATED);
        expect(result.body.user.username).toBe(mockUser.username);
        expect(result.body.token).toBeDefined();

        const newResult = await request(app)
            .post('/auth/register')
            .send(mockUser);

        expect(newResult.statusCode).toBe(httpStatus.CONFLICT);
    });
});
