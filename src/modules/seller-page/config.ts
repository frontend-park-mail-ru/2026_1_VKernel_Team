export const SELLER_API_ENDPOINTS = {
    PROFILE: (id: number | string) => `/users/${id}`,
    ADS: (id: number | string) => `/users/${id}/ads`,
};
