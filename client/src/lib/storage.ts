const STORAGE_PREFIX = 'foobar';

export const storage = {
    get(key: string) {
        const item = localStorage.getItem(`${STORAGE_PREFIX}_${key}`);
        if (!item) return null;

        return JSON.parse(item);
    },
    set(key: string, value: unknown) {
        localStorage.setItem(`${STORAGE_PREFIX}_${key}`, JSON.stringify(value));
    },
    remove(key: string) {
        localStorage.removeItem(`${STORAGE_PREFIX}_${key}`);
    },
};
