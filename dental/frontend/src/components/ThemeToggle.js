import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useContext(AuthContext);

    return (
        <button onClick={toggleTheme} className="theme-toggle">
            {darkMode ? 'Jasny motyw' : 'Ciemny motyw'}
        </button>
    );
};

export default ThemeToggle;