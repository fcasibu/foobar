import { DateTime } from 'luxon';
import { model, Schema } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import z from 'zod';

export const baseUserSchema = z
    .object({
        username: z
            .string()
            .nonempty({ message: 'Username must not be empty.' })
            .min(4, { message: 'Username must be at least 4 characters long.' })
            .toLowerCase(),
        displayName: z
            .string()
            .min(1, {
                message: 'Display Name must be at least 1 character long.',
            })
            .optional(),
        password: z
            .string()
            .nonempty({ message: 'Password must not be empty.' })
            .min(8, {
                message: 'Password must be at least 8 characters long.',
            }),
        passwordConfirm: z.string().optional(),
    })
    .strict();

export const refinedUserSchema = baseUserSchema.refine(
    ({ password, passwordConfirm }) => password === passwordConfirm,
    {
        message: 'Passwords do not match.',
        path: ['passwordConfirm'],
    },
);

type UserDocument = Document &
    z.infer<typeof refinedUserSchema> & {
        formattedDate: string;
        validatePassword(password: string): Promise<boolean>;
    };

const UserSchema = new Schema(
    {
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
        isAccountDisabled: { type: Boolean, default: false },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

UserSchema.pre('save', { document: true }, async function savePreHook(next) {
    if (!this.isModified('password')) {
        next();
        return;
    }

    this.password = await hash(this.password, 10);
    this.passwordConfirm = undefined;
    next();
});

UserSchema.methods.validatePassword = function validatePassword(
    password: string,
) {
    return compare(password, this.password);
};

UserSchema.virtual('rooms', {
    ref: 'Room',
    localField: '_id',
    foreignField: 'members',
});

UserSchema.virtual('formattedDate').get(function getFormattedDate() {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(
        DateTime.DATE_MED,
    );
});

export const User = model<UserDocument>('User', UserSchema);
