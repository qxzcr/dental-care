import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api'; // предположим, у тебя есть api сервис для запросов

const RegisterPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ imie: '', nazwisko: '', email: '', password: '', role: 'patient', specialty: '' });
    const [error, setError] = useState('');

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecial = /[@$!%*?&]/.test(password);
        return minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecial;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword(user.password)) {
            setError('Hasło nie spełnia wymagań.');
            return;
        }
        try {
            const result = await register(user);
            if (result.success) {
                alert('Rejestracja pomyślna! Przekierowanie na główną stronę.');
                navigate('/login');
            } else {
                setError(result.message || 'Błąd rejestracji.');
            }
        } catch (err) {
            setError('Błąd serwera. Spróbuj ponownie.');
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Rejestracja Pacjenta</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imię</label>
                        <input
                            type="text"
                            value={user.imie}
                            onChange={(e) => setUser({ ...user, imie: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nazwisko</label>
                        <input
                            type="text"
                            value={user.nazwisko}
                            onChange={(e) => setUser({ ...user, nazwisko: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hasło</label>
                        <input
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>Minimum 8 znaków: {user.password.length >= 8 ? '✓' : '✗'}</li>
                        <li>Co najmniej jedna duża litera: {/[A-Z]/.test(user.password) ? '✓' : '✗'}</li>
                        <li>Co najmniej jedna mała litera: {/[a-z]/.test(user.password) ? '✓' : '✗'}</li>
                        <li>Co najmniej jedna cyfra: {/\d/.test(user.password) ? '✓' : '✗'}</li>
                        <li>Co najmniej jeden znak specjalny (@$!%*?&): {/@$!%*?&/.test(user.password) ? '✓' : '✗'}</li>
                    </ul>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                        disabled={!validatePassword(user.password)}
                    >
                        Zarejestruj się
                    </button>
                    <p className="text-center text-sm text-gray-600">
                        Masz już konto? <a href="/login" className="text-blue-600 hover:underline">Zaloguj się</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
