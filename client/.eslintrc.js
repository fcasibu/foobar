module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'airbnb',
        'airbnb-typescript',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.js'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    plugins: ['react-refresh', 'react', '@typescript-eslint'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'variable',
                modifiers: ['destructured'],
                format: null,
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
            {
                selector: 'variable',
                format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            },
            {
                selector: 'parameter',
                format: ['camelCase', 'PascalCase'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'enumMember',
                format: ['UPPER_CASE'],
            },
        ],
        'import/no-unresolved': 0,
        'no-shadow': 0,
        '@typescript-eslint/no-shadow': [2],
        '@typescript-eslint/no-empty-function': 0,
        'no-use-before-define': 0,
        '@typescript-eslint/no-use-before-define': [2, { functions: false }],
        '@typescript-eslint/consistent-type-imports': 'error',
        'import/prefer-default-export': 0,
        'import/extensions': 0,
    },
};
