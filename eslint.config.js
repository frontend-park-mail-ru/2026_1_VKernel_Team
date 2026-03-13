import js from "@eslint/js";
import globals from "globals";

export default [
  // Общие настройки для всего проекта
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2022,      // Поддержка синтаксиса ES2022
      sourceType: "module",   // Позволяет использовать import/export
      globals: {
        ...globals.browser,   // Глобальные переменные браузера (window, document)
        ...globals.node       // Глобальные переменные Node.js (process, __dirname)
      }
    },
    rules: {
      ...js.configs.recommended.rules,

      // Предупреждать о неиспользованных переменных
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],

      // Разрешаем использование console.log
      "no-console": "off",

      // Обязательно использовать const, если переменная не переназначается
      "prefer-const": "error",

      // Запрет на использование var
      "no-var": "error"
    }
  },

  // Настройки для серверной части (Node.js)
  {
    files: ["server/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node // Только инструменты Node.js
      }
    },
    rules: {
      "no-console": "off"
    }
  },

  // Настройки для фронтенда
  {
    files: ["src/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,

        // Объявляем внешние библиотеки и глобальные классы как Readonly,
        // чтобы ESLint не считал их ошибкой "переменная не определена"
        Handlebars: "readonly",
        apiClient: "readonly",
        API_ENDPOINTS: "readonly",
        AuthService: "readonly",
        AuthValidator: "readonly",
        AdsService: "readonly",
        Storage: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "off",

      "no-console": "warn"
    }
  },

  // Исключения
  {
    ignores: ["node_modules/", "public/"]
  }
];
