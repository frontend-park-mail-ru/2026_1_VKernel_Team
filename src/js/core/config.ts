declare const process: {
    env: {
        BASE_URL?: string;
        YANDEX_JSAPI_KEY?: string;
        YANDEX_SUGGEST_KEY?: string;
    };
};

/**
 * Файл с настройками приложения
 * Здесь хранятся все важные константы: адреса сервера, название сайта и т.д.
 *
 * @module config
 */

/**
 * Объект с конфигурацией всего приложения
 *
 * @property {Object} API - настройки для связи с сервером
 * @property {string} API.BASE_URL - префикс для статических ресурсов бэкенда
 *   (пустая строка по умолчанию ⇒ same-origin, ходит через nginx)
 * @property {string} API.API_URL - относительный путь, проксируется nginx на бэкенд
 * @property {Object} APP - настройки самого приложения
 * @property {string} APP.NAME - название сайта
 * @property {string} APP.VERSION - версия приложения
 */

// Same-origin: фронт и API живут на одном домене, nginx проксирует /api/v1/* и
// /static/* (медиа) на бэкенд. BASE_URL по умолчанию пустой ⇒ относительные URL.
const BASE_URL = process.env.BASE_URL || '';

const CONFIG = {
    API: {
        BASE_URL,
        API_URL: '/api/v1',
    },
    APP: {
        NAME: 'Клевер',
        VERSION: '1.0.0',
    },
    YANDEX: {
        JSAPI_KEY: process.env.YANDEX_JSAPI_KEY || '',
        SUGGEST_KEY: process.env.YANDEX_SUGGEST_KEY || '',
    },
};

export { CONFIG };
