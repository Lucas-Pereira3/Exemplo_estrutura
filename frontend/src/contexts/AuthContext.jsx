
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
    
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                senha: password,
            });
      
            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success('Login realizado com sucesso!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao fazer login');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, ...userInfo } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userInfo));
            setUser(userInfo);
            toast.success('Cadastro realizado com sucesso!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao cadastrar');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logout realizado com sucesso!');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};