import Constants from 'expo-constants';

const ENV = {
    dev: {
        API_URL: `http://${Constants.expoConfig.extra.serverIp}:${Constants.expoConfig.extra.serverPort}`,
    },
    prod: {
        API_URL: 'https://sit.udst.edu.qa/huroof',
    },
};

const getEnvironment = () => {
    if (!Constants.expoConfig.extra.serverIp && __DEV__) {
        throw new Error('Server IP is not configured in development environment');
    }
    return __DEV__ ? ENV.dev : ENV.prod;
};

export const API_CONFIG = {
    ...getEnvironment(),
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