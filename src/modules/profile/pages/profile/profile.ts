import '@modules/profile/pages/profile/profile.scss';
import template from '@modules/profile/pages/profile/profile.hbs';
import { HeaderComponent } from '@modules/common/components/header/header';
import { SearchSectionComponent } from '@modules/common/components/search-section/search-section';
import { ProfileAvatar } from '@modules/profile/components/profile-avatar/profile-avatar';
import { ProfileSidebar } from '@modules/profile/components/profile-sidebar/profile-sidebar';
import { ProfileContent } from '@modules/profile/components/profile-content/profile-content';
import { WalletTab } from '@modules/wallet/components/wallet-tab/wallet-tab';
import { TopupModal } from '@modules/wallet/components/topup-modal/topup-modal';
import { PromoteModal } from '@modules/promotion/components/promote-modal/promote-modal';
import { PromoHistoryTab } from '@modules/promotion/components/history-tab/history-tab';
import modalTemplate from '@modules/common/components/modal/modal.hbs';
import profileAdCardTemplate from '@modules/profile/components/profile-ad-card/profile-ad-card.hbs';
import '@modules/profile/components/profile-ad-card/profile-ad-card.scss';
import type { HandlebarsTemplateFunction } from '@/types';

declare const Handlebars: any;

let compiledTemplate: HandlebarsTemplateFunction | null = null;

export function loadTemplates(): void {
    try {
        compiledTemplate = template;

        Handlebars.registerPartial('header', HeaderComponent.getTemplate());
        Handlebars.registerPartial('search-section', SearchSectionComponent.getTemplate());

        Handlebars.registerPartial('profile-avatar', ProfileAvatar.getTemplate());
        Handlebars.registerPartial('profile-sidebar', ProfileSidebar.getTemplate());
        Handlebars.registerPartial('profile-content', ProfileContent.getTemplate());

        Handlebars.registerPartial(
            'wallet/components/wallet-tab/wallet-tab',
            WalletTab.getTemplate(),
        );
        Handlebars.registerPartial(
            'wallet/components/topup-modal/topup-modal',
            TopupModal.getTemplate(),
        );
        Handlebars.registerPartial(
            'promotion/components/promote-modal/promote-modal',
            PromoteModal.getTemplate(),
        );
        Handlebars.registerPartial(
            'promotion/components/history-tab/history-tab',
            PromoHistoryTab.getTemplate(),
        );
        Handlebars.registerPartial('common/components/modal/modal', modalTemplate);
        Handlebars.registerPartial(
            'profile/components/profile-ad-card/profile-ad-card',
            profileAdCardTemplate,
        );
    } catch (error) {
        console.error('Failed to load profile templates:', error);
    }
}

export function getTemplate(): HandlebarsTemplateFunction | null {
    return compiledTemplate;
}
