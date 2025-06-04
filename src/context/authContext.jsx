import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Send credentials with every request
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            // Set the token in Axios headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            try {
                const response = await axios.get('https://employee-api1.vercel.app/api/auth/verify');

                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                    setUser(null);
                }
            } catch (error) {
                console.error('Error verifying user:', error?.response?.data?.error || error.message);
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    const login = (userData, token) => {
        if (token && userData) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        // Optional: window.location.href = '/login';
    };

    return (
        <UserContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);

export default AuthProvider;
