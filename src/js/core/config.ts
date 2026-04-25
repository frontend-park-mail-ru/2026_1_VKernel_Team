declare const process: { env: { BASE_URL?: string } };

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
 * @property {string} API.BASE_URL - базовый URL сервера (без /api/v1)
 * @property {string} API.API_URL - полный URL для API запросов
 * @property {Object} APP - настройки самого приложения
 * @property {string} APP.NAME - название сайта
 * @property {string} APP.VERSION - версия приложения
 */

const BASE_URL = process.env.BASE_URL || 'http://clover-go.ru:8000';

const CONFIG = {
    API: {
        BASE_URL,
        API_URL: `${BASE_URL}/api/v1`,
    },
    APP: {
        NAME: 'Клевер',
        VERSION: '1.0.0',
    },
};

export { CONFIG };
