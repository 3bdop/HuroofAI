import axios from 'axios';
import { API_CONFIG } from '../config';

const apiClient = axios.create({
    baseURL: API_CONFIG.API_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS.DEFAULT,
});

apiClient.interceptors.request.use(
    (config) => {
        console.log(`Making request to: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Server Error:', error.response.data);
        } else if (error.request) {
            console.error('Network Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const uploadAudio = async (formData) => {
    try {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.UPLOAD, formData, {
            headers: API_CONFIG.HEADERS.MULTIPART,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default apiClient;