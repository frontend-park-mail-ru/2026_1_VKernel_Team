import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // Frontend (src: JS и TS)
    {
        files: ['**/*.{js,ts}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parser: tseslint.parser,
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-console': 'off',
            'prettier/prettier': 'error',
            'max-depth': ['error', 4],
            'max-nested-callbacks': ['error', 3],
        },
    },

    // Server (server: только JS)
    {
        files: ['server/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            'no-console': 'off',
            
            'max-depth': ['error', 4],
            'max-nested-callbacks': ['error', 3],
        },
    },

    // Ignored
    {
        ignores: ['dist/**/*', 'node_modules/**/*', 'public/**/*', '.dependency-cruiser.cjs'],
    },
    eslintConfigPrettier,
];
