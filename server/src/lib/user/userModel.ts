import { DateTime } from 'luxon';
import { model, Schema } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import z from 'zod';

export const userSchema = z
    .object({
        username: z
            .string()
            .nonempty({ message: 'Username is required.' })
            .min(4, { message: 'Username must be 4 characters long.' })
            .toLowerCase(),
        displayName: z
            .string()
            .min(1, { message: 'Display Name must have at least 1 character.' })
            .nullish(),
        password: z
            .string()
            .nonempty({ message: 'Password is required.' })
            .min(8, {
                message: 'Password must be at least 8 characters long.',
            }),
        passwordConfirm: z.string().optional(),
    })
    .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
        message: 'Passwords do not match.',
        path: ['passwordConfirm'],
    });

type UserDocument = Document &
    z.infer<typeof userSchema> & {
        formattedDate: string;
        validatePassword(password: string): Promise<boolean>;
    };

const UserSchema = new Schema({
    username: {
        type: String,
        min: 4,
        required: true,
        lowercase: true,
    },
    displayName: {
        type: String,
        min: 1,
    },
    password: {
        type: String,
        min: 8,
        required: true,
    },
    passwordConfirm: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre(
    /(findOneAndUpdate|save)/i,
    { document: true },
    async function (next) {
        if (!this.isModified('password')) return next();

        this.password = await hash(this.password, 10);

        delete this.passwordConfirm;
        next();
    },
);

UserSchema.methods.validatePassword = async function (password: string) {
    return await compare(password, this.password);
};

UserSchema.virtual('formattedDate').get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(
        DateTime.DATE_MED,
    );
});

UserSchema.virtual('rooms', {
    ref: 'Room',
    localField: '_id',
    foreignField: 'user',
});

export const User = model<UserDocument>('User', UserSchema);
