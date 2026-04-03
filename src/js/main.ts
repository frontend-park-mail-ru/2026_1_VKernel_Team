/**
 * Точка входа приложения
 * Инициализирует все модули и запускает приложение
 */

import '@/utils/storage';
import '@/validators/authValidator';
import '@/services/authService';
import '@/services/adsServices';
import '@/api/apiClient';
import { AppController } from '@/controllers/AppController';

document.addEventListener('DOMContentLoaded', () => {
    AppController.init();
});
