import './utils/storage.js';
import './validators/authValidator.js';
import './services/authService.js';
import './services/adsServices.js';
import './api/apiClient.js';
import { App } from './app.js';

// Инициализация приложения после загрузки всех модулей
// Откладываем запуск приложения до момента,
// когда весь HTML будет построен и готов к работе
document.addEventListener('DOMContentLoaded', () => App.init());
