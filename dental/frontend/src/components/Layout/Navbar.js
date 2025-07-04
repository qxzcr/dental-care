import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Dental Clinic</Link>
                <div className="space-x-4">
                    {!user ? (
                        <>
                            <Link to="/login" className="hover:underline">Zaloguj się</Link>
                            <Link to="/register" className="hover:underline">Zarejestruj się</Link>
                        </>
                    ) : (
                        <>
                            <span>Witaj, {user.name}</span>
                            <button onClick={logout} className="hover:underline">Wyloguj</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;