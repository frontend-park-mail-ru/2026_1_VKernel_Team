import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    // 1. Базовые правила для всех файлов
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // 2. Настройки для ФРОНТЕНДА (src: JS и TS)
    {
        files: ['**/*.{js,ts}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parser: tseslint.parser, // Чтобы линтер понимал TS синтаксис
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            // 1. Отключаем ругань на 'any'
            '@typescript-eslint/no-explicit-any': 'off',

            // 2. Отключаем ошибки за неиспользуемые переменные (делаем их просто предупреждениями)
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            // 3. Разрешаем console.log везде (если хотите)
            'no-console': 'off',

            // Остальные правила оформления оставляем (они полезны)
            'indent': ['error', 4, { SwitchCase: 1 }],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'semi': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'eol-last': ['error', 'always'],
            'no-trailing-spaces': 'error',
        },

    },

    // 3. Настройки для СЕРВЕРА (server: только JS)
    {
        files: ['server/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.node, // Глобальные переменные Node.js (process, __dirname и т.д.)
            },
        },
        rules: {
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'no-console': 'off', // На сервере логи — это нормально и полезно
            'eol-last': ['error', 'always'],
            'no-trailing-spaces': 'error',
        },
    },

    // 4. Игнорируемые папки
    {
        ignores: [
            'dist/**/*',
            'node_modules/**/*',
            'public/**/*',
            '.dependency-cruiser.cjs',
        ],
    },
    eslintConfigPrettier,
];
