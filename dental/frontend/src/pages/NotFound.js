import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ padding: 20, textAlign: 'center' }}>
            <h2>404 - Strona nie znaleziona</h2>
            <p>Przepraszamy, ale strona, której szukasz, nie istnieje.</p>
            <Link to="/">Wróć do strony głównej</Link>
        </div>
    );
};

export default NotFound;