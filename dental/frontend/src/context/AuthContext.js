import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            try {
                if (token && storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser && parsedUser._id) {
                        setUser(parsedUser);
                        console.log('Użytkownik załadowany z localStorage:', parsedUser);
                    } else {
                        handleLogout();
                    }
                }
            } catch (error) {
                console.error('Błąd parsowania użytkownika:', error);
                handleLogout();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const loginUser = async (credentials) => {
        try {
            const response = await login(credentials);
            console.log('Odpowiedź logowania:', response);

            if (response.success && response.token && response.user) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                setUser(response.user);
                return { success: true, user: response.user };
            }

            return {
                success: false,
                message: response.message || 'Błąd logowania. Spróbuj ponownie.',
            };
        } catch (error) {
            console.error('Błąd logowania:', error.message || error);
            return {
                success: false,
                message: error.message || 'Błąd serwera podczas logowania.',
            };
        }
    };

    const handleLogout = () => {
        // Заміна remove на removeItem
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        console.log('Użytkownik wylogowany');
        navigate('/login');
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Użytkownik zaktualizowany w kontekście:', updatedUser);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: loginUser,
                logout: handleLogout,
                updateUser,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);