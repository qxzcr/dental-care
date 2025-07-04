import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Додаємо <Router>
import App from './App';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router> {/* Тільки один <Router> для всієї програми */}
        <AuthProvider>
            <App />
        </AuthProvider>
    </Router>
);