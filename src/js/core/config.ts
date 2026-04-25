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

// Определяем, где запущен фронтенд
const _isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const BASE_URL = process.env.BASE_URL || 'http://clover-go.ru:8000';

const CONFIG = {
    API: {
        BASE_URL,
        // Если локально - шлем на прокси, чтобы браузер не бло��ировал куки!
        API_URL: _isLocal ? '/api/v1' : `${BASE_URL}/api/v1`,
    },
    APP: {
        NAME: 'Клевер',
        VERSION: '1.0.0',
    },
};

export { CONFIG };
