import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const result = await login(email, password);
            if (!result.success) {
                throw new Error(result.message);
            }
            alert('Zalogowano pomyślnie!');
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Zaloguj się</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Podaj email"
                    />
                </label>
                <label>
                    Hasło:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Podaj hasło"
                    />
                </label>
                <button type="submit">Zaloguj się</button>
            </form>
            <p>
                Nie masz konta? <Link to="/register">Zarejestruj się</Link>
            </p>
        </div>
    );
};

export default Login;