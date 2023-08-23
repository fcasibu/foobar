import request from 'supertest';
import { Express, NextFunction } from 'express';
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

const mockUser = {
    displayName: faker.internet.displayName(),
};

jest.mock('../../../middlewares', () => ({
    ...jest.requireActual('../../../middlewares'),
    isAuthenticated: (_req: Request, _res: Response, next: NextFunction) =>
        next(),
}));

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
        expect(result.body.user.displayName).toBe(user.displayName);
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
