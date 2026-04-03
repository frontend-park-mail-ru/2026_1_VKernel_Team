/**
 * Точка входа в приложение
 *
 * @module main
 */

import '../../public/css/base.css';
import '../../public/css/components.css';
import '../../public/css/auth.css';
import '../../public/css/footer.css';
import '../../public/css/main.css';

import '@/utils/storage';
import '@/validators/authValidator';
import '@/services/authService';
import '@/services/adsServices';
import '@/api/apiClient';
import { App } from './app';

// Инициализация приложения после загрузки всех модулей
// Откладываем запуск приложения до момента,
// когда весь HTML будет построен и готов к работе
document.addEventListener('DOMContentLoaded', () => App.init());
