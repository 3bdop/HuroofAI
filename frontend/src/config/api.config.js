import Constants from 'expo-constants';

const PRODUCTION_URL = 'https://sit.udst.edu.qa/huroof';

export const API_CONFIG = {
    API_URL: PRODUCTION_URL, // <-- Direct assignment
    ENDPOINTS: {
        UPLOAD: '/upload/',
        INFERENCE: '/infer/',
    },
    TIMEOUT: 10000,
    HEADERS: {
        DEFAULT: {
            'Content-Type': 'application/json',
        },
        MULTIPART: {
            'Content-Type': 'multipart/form-data',
        },
    },
};

export const getFullUrl = (endpoint) => `${API_CONFIG.API_URL}${endpoint}`;