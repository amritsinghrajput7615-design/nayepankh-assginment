import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);
    const [loading, setLoading] = useState(true);

    // Initial check of authentication
    useEffect(() => {
        const verifyAuth = async () => {
            if (token) {
                // Set default authorization header
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    // Fetch user profile based on role
                    if (role === 'admin') {
                        // Admins don't have a separate profile route in backend, 
                        // so we recover admin details from localStorage or verify token
                        const storedUser = localStorage.getItem('user');
                        if (storedUser) {
                            setUser(JSON.parse(storedUser));
                        } else {
                            // If user object is missing, set default admin object
                            setUser({ email: 'admin@nayepankh.org', role: 'admin', username: 'Admin' });
                        }
                    } else {
                        // Volunteer profile
                        const res = await axios.get('/api/volunteers/profile');
                        setUser(res.data.user);
                    }
                } catch (error) {
                    console.error('Session verification failed:', error.message);
                    logout();
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        verifyAuth();
    }, [token, role]);

    const login = async (email, password, loginRole) => {
        setLoading(true);
        try {
            const url = loginRole === 'admin' ? '/api/admin/login' : '/api/volunteers/login';
            const res = await axios.post(url, { email, password });
            
            const { token: returnedToken, admin, volunteer, message } = res.data;
            const activeToken = returnedToken;
            const activeUser = loginRole === 'admin' ? admin : volunteer;

            if (!activeToken) {
                throw new Error('No authentication token received from server');
            }

            // Save to localStorage
            localStorage.setItem('token', activeToken);
            localStorage.setItem('role', loginRole);
            localStorage.setItem('user', JSON.stringify(activeUser));

            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;

            setToken(activeToken);
            setRole(loginRole);
            setUser(activeUser);

            setLoading(false);
            return { success: true, message, user: activeUser };
        } catch (error) {
            setLoading(false);
            const errMsg = error.response?.data?.message || error.message || 'Login failed';
            return { success: false, message: errMsg };
        }
    };

    const registerVolunteer = async (volunteerData) => {
        setLoading(true);
        try {
            // Register route in backend: POST /volunteers/create
            const res = await axios.post('/api/volunteers/create', volunteerData);
            
            setLoading(false);
            return { 
                success: true, 
                message: res.data.message || 'Registration successful. Please login.' 
            };
        } catch (error) {
            setLoading(false);
            const errMsg = error.response?.data?.message || error.message || 'Registration failed';
            return { success: false, message: errMsg };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setRole(null);
        setUser(null);
    };

    const updateProfileState = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        token,
        role,
        loading,
        login,
        registerVolunteer,
        logout,
        updateProfileState,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
