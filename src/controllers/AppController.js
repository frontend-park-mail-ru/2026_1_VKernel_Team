import { AuthController } from './AuthController.js';
import { AdsController } from './AdsController.js';
import { ProfileController } from './ProfileController.js';
const AppController = {
    templates: {},
    currentView: 'main-page',
    isAuthenticated: false,
    user: null,
    UI_CONSTANTS: {
        DEFAULT_AVATAR: '/images/default-avatar.jpg',
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
        LOADER_HTML: '<div class="spinner"></div>',
    },
    async init() {
        await this.loadTemplates();
        await AuthController.checkAuth();
        this.setupGlobalHandlers();
        this.router();
        window.addEventListener('popstate', () => this.router());
    },
    async loadTemplates() {
        const templateNames = [
            'auth-links',
            'login-forms',
            'register-form',
            'user-profile',
            'main-page',
            'not-found',
        ];
        for (const name of templateNames) {
            // ✅ Путь должен быть /src/templates/ (сервер отдаёт из src/)
            const response = await fetch(`/src/templates/${name}.hbs`);
            const source = await response.text();
            this.templates[name] = Handlebars.compile(source);
        }
        this.registerHandlebarsHelpers();
    },
    registerHandlebarsHelpers() {
        Handlebars.registerHelper('formatPrice', (price) => {
            return price === 0 ? 'Бесплатно' : price + ' ₽';
        });
        Handlebars.registerHelper('ifAuthenticated', function (options) {
            return AppController.isAuthenticated ? options.fn(this) : options.inverse(this);
        });
    },
    async router() {
        const path = window.location.pathname;
        if (!this.isAuthenticated && ['/profile'].includes(path)) {
            this.navigateTo('/login');
            return;
        }
        switch (path) {
            case '/':
            case '/index.html':
                await AdsController.renderMain();
                break;
            case '/login':
                AuthController.showLogin();
                break;
            case '/register':
                AuthController.showRegister();
                break;
            case '/profile':
                ProfileController.showProfile();
                break;
            default:
                this.renderNotFound();
        }
    },
    navigateTo(path) {
        window.history.pushState({}, '', path);
        this.router();
    },
    renderNotFound() {
        const app = document.getElementById('app');
        if (!app || !this.templates['not-found'])
            return;
        app.innerHTML = this.templates['not-found']();
    },
    setupGlobalHandlers() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const navElement = target.closest('[data-nav]');
            if (navElement) {
                e.preventDefault();
                const path = navElement.dataset.nav;
                if (path)
                    this.navigateTo(path);
                return;
            }
            const actionElement = target.closest('[data-action]');
            if (actionElement) {
                e.preventDefault();
                const action = actionElement.dataset.action;
                if (action === 'logout') {
                    AuthController.logout();
                }
                return;
            }
        });
    },
    showLoading(show) {
        const loader = document.getElementById('global-loader');
        if (!show) {
            loader?.remove();
            return;
        }
        if (!loader) {
            const newLoader = document.createElement('div');
            newLoader.id = 'global-loader';
            newLoader.className = 'loader-overlay';
            newLoader.innerHTML = this.UI_CONSTANTS.LOADER_HTML;
            document.body.appendChild(newLoader);
        }
    },
};
export { AppController };
