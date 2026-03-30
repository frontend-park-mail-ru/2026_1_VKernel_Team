import '/src/utils/storage.js';
import '/src/validators/authValidator.js';
import '/src/services/authService.js';
import '/src/services/adsServices.js';
import '/src/api/apiClient.js';
import { AppController } from './controllers/AppController.js';
document.addEventListener('DOMContentLoaded', () => AppController.init());
