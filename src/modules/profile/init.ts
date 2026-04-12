import { ProfileController } from './controller';

export function initProfileModule() {
    console.log('Profile module loaded');
    return ProfileController;
}
