export const PROFILE_CONFIG = {
    API: {
        GET_PROFILE: '/profile',
        UPDATE_PROFILE: '/profile',
        UPLOAD_AVATAR: '/profile/avatar',
        LOGOUT: '/auth/logout',
        GET_FAVORITES: '/profile/favorites',
        ADD_FAVORITE: (id: number | string) => `/ads/${id}/favorite`,
        REMOVE_FAVORITE: (id: number | string) => `/ads/${id}/favorite`,
    },
};
