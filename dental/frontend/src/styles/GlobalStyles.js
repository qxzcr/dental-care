// GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: ${({ darkMode }) => darkMode ? '#1f1f1f' : '#f5f5f5'};
        color: ${({ darkMode }) => darkMode ? '#fff' : '#333'};
        transition: all 0.3s ease;
    }

    .navbar {
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: ${({ darkMode }) => darkMode ? '#111' : '#fff'};
        color: ${({ darkMode }) => darkMode ? '#fff' : '#333'};
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .navbar a, .navbar span, .navbar button {
        color: ${({ darkMode }) => darkMode ? '#fff' : '#333'};
        text-decoration: none;
        margin: 0 10px;
    }

    .navbar button {
        padding: 8px 12px;
        background-color: ${({ darkMode }) => darkMode ? '#0056b3' : '#007bff'};
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
    }

    .navbar button:hover {
        background-color: ${({ darkMode }) => darkMode ? '#004d99' : '#0056b3'};
    }

    h1, h2, h3 {
        color: ${({ darkMode }) => darkMode ? '#fff' : '#007bff'};
        margin-bottom: 10px;
    }

    button {
        transition: background-color 0.3s ease;
    }
`;

export default GlobalStyles;
