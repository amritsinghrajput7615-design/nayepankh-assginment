import axios from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
   
});

// Request Interceptor to dynamically inject the JWT bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // Ensure headers object exists before assigning
        config.headers = config.headers || {};
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor to intercept general errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Handle token expiration or unauthorized access globally
            console.warn('Session expired or unauthorized request.');
        }
        return Promise.reject(error);
    }
);

export default api;
