export type User = {
    _id: string;
    auth_provider?: string;
    auth_id?: string;
    displayName: string;
    createdAt: Date;
    isAccountDisabled: boolean;
};
