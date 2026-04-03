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
const _isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
);

const CONFIG = {
    API: {
        // BASE_URL всегда указывает на реальный бэкенд.
        BASE_URL: 'http://clover-go.ru:8000',

        // Локально -> стучимся на относительный '/api/v1' (запросы перехватит Node.js)
        // На проде -> стучимся напрямую к бэкенду на порт 8000
        API_URL: _isLocal ? '/api/v1' : 'http://clover-go.ru:8000/api/v1',
    },
    // Другие константы конфигурации можно добавить сюда же
    APP: {
        NAME: 'Клевер',
        VERSION: '1.0.0',
    },
};

export { CONFIG };
