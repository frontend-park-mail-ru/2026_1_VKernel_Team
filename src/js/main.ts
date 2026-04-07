/**
 * Точка входа в приложение
 * @module main
 */

// === CSS ===
import '@css/base.css';
import '@css/components.css';
import '@css/auth.css';
import '@css/footer.css';
import '@css/main.css';

// === Side-effect модули (инициализация) ===
import '@/utils/storage';
import '@/validators/authValidator';
import '@/services/authService';
import '@/services/adsServices';
import '@/api/apiClient';

// === Точка входа: AppController вместо устаревшего App ===
import { AppController } from '@/controllers/AppController';

// === Инициализация ===
document.addEventListener('DOMContentLoaded', () => {
    AppController.init();
});
