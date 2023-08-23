import { DateTime } from 'luxon';
import { model, Schema } from 'mongoose';

const UserSchema = new Schema(
    {
        auth_provider: { type: String, default: null },
        auth_id: {
            type: String,
            default: null,
        },
        displayName: String,
        isAccountDisabled: { type: Boolean, default: false },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
        timestamps: true,
    },
);

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

export const User = model('User', UserSchema);
