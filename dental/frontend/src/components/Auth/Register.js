import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        imie: '',
        nazwisko: '',
        email: '',
        haslo: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'haslo') {
            setPasswordRequirements({
                minLength: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /\d/.test(value),
                specialChar: /[@$!%*?&]/.test(value),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const result = await register(formData);
            if (!result.success) {
                throw new Error(result.message);
            }
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Rejestracja</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">Rejestracja zakończona sukcesem! Przekierowanie...</p>}

            <form onSubmit={handleSubmit} className="auth-form">
                <div>
                    <label>Imię:</label>
                    <input
                        type="text"
                        name="imie"
                        value={formData.imie}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Nazwisko:</label>
                    <input
                        type="text"
                        name="nazwisko"
                        value={formData.nazwisko}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Hasło:</label>
                    <input
                        type="password"
                        name="haslo"
                        value={formData.haslo}
                        onChange={handleChange}
                        required
                    />
                    <ul className="password-requirements">
                        <li style={{ color: passwordRequirements.minLength ? 'green' : 'red' }}>
                            Minimum 8 znaków
                        </li>
                        <li style={{ color: passwordRequirements.uppercase ? 'green' : 'red' }}>
                            Co najmniej jedna duża litera
                        </li>
                        <li style={{ color: passwordRequirements.lowercase ? 'green' : 'red' }}>
                            Co najmniej jedna mała litera
                        </li>
                        <li style={{ color: passwordRequirements.number ? 'green' : 'red' }}>
                            Co najmniej jedna cyfra
                        </li>
                        <li style={{ color: passwordRequirements.specialChar ? 'green' : 'red' }}>
                            Co najmniej jeden znak specjalny (@$!%*?&)
                        </li>
                    </ul>
                </div>
                <button type="submit">Zarejestruj się</button>
            </form>

            <p>
                Masz już konto? <Link to="/login">Zaloguj się</Link>
            </p>
        </div>
    );
};

export default Register;