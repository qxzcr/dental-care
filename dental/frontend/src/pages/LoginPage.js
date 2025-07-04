import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Використовується контекст авторизації (як і було у вашому коді)

// Компонент сторінки входу
const LoginPage = () => {
    const { login, logout } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' }); // Поле для входу
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Обробник форми входу
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const result = await login(credentials);

        if (result.success) {
            const userRole = result.user?.role;
            if (userRole === 'admin') {
                navigate('/admin-profile', { replace: true });
            } else if (userRole === 'doctor') {
                navigate('/doctor-profile', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } else {
            setError(result.message || 'Błąd wprowadzonych danych.');
        }

        setIsSubmitting(false);
    };

    // Обробник виходу з облікового запису
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Zaloguj się</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) =>
                                setCredentials({ ...credentials, email: e.target.value })
                            }
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="jan.kowalski@doktor.pl"
                            disabled={isSubmitting}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hasło</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) =>
                                setCredentials({ ...credentials, password: e.target.value })
                            }
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="••••••••••••"
                            disabled={isSubmitting}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                    <p className="text-center text-sm text-gray-600">
                        Nie masz konta?{' '}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Zarejestruj się
                        </a>
                    </p>
                </form>
                <div className="mt-4 text-center">
                    <button
                        onClick={handleLogout}
                        className="text-red-600 hover:underline text-sm"
                    >
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;