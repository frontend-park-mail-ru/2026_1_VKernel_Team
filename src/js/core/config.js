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

const CONFIG = {
    API: {
        BASE_URL: 'http://clover-go.ru:8000',
        API_URL: 'http://clover-go.ru:8000/api/v1',
    },
    // Другие константы конфигурации можно добавить сюда же
    APP: {
        NAME: 'Клевер',
        VERSION: '1.0.0'
    }
};

export { CONFIG };
