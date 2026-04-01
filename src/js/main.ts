/**
 * Точка входа в приложение
 *
 * @module main
 */

import loginFormsTemplate from '@templates/login-forms.hbs';
import registerFormTemplate from '@templates/register-form.hbs';
import mainPageTemplate from '@templates/main-page.hbs';
import userProfileTemplate from '@templates/user-profile.hbs';
import notFoundTemplate from '@templates/not-found.hbs';
import authLinksTemplate from '@templates/auth-links.hbs';

const templates = {
    'login-forms': loginFormsTemplate,
    'register-form': registerFormTemplate,
    'main-page': mainPageTemplate,
    'user-profile': userProfileTemplate,
    'not-found': notFoundTemplate,
    'auth-links': authLinksTemplate,
};

import '@css/base.css';
import '@css/components.css';
import '@css/auth.css';
import '@css/main.css';

import '@/utils/storage';
import '@/validators/authValidator';
import '@/services/authService';
import '@/services/adsServices';
import '@/api/apiClient';
import { App } from './app';

// Инициализация приложения после загрузки всех модулей
// Откладываем запуск приложения до момента,
// когда весь HTML будет построен и готов к работе
document.addEventListener('DOMContentLoaded', () => App.init(templates));
