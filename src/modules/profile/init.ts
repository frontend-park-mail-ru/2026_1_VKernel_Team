import profileTemplate from './pages/profile/profile.hbs'; // Webpack handles this via handlebars-loader
import './pages/profile/profile.css';

export function initProfilePage() {
    const app = document.getElementById('app');
    if (!app) return;

    // Use the imported template function directly
    // Ensure all partials (sidebar, content) are registered or included in the context
    app.innerHTML = profileTemplate({
        // Initial context data here
    });
    
    console.log('Profile page rendered');
}
