// Импортируем стили, чтобы Webpack их подхватил
import './profile.css';

// Позже сюда добавим импорт контроллера
// import { ProfileController } from '../../controller';

export function initProfilePage() {
  console.log('Страница профиля инициализирована');
  
  // В будущем здесь будет что-то вроде:
  // const controller = new ProfileController();
  // controller.mount(document.querySelector('.profile-layout'));
}
