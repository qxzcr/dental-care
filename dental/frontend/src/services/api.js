// import axios from 'axios';
//
// // Utworzenie instancji axios (domyślna konfiguracja dla wszystkich żądań do API)
// const api = axios.create({
//     baseURL: 'http://localhost:5000/api', // Adres bazy URL API
//     headers: {
//         'Content-Type': 'application/json', // Ustawiony typ zawartości na JSON
//     },
// });
//
// // Interceptor do obsługi żądań (dodawanie tokenu autoryzacyjnego)
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token'); // Pobranie tokena z localStorage
//         if (token) {
//             console.log('Token dodany do nagłówków:', token); // Logowanie tokena w konsoli
//             config.headers.Authorization = `Bearer ${token}`;
//         } else {
//             console.warn('Brak tokena. Użytkownik niezalogowany.'); // Ostrzeżenie jeśli token nie istnieje
//         }
//         return config;
//     },
//     (error) => Promise.reject(error) // Obsługa błędów związanych z konfiguracją żądania
// );
//
// // Interceptor do obsługi odpowiedzi
// api.interceptors.response.use(
//     (response) => response.data, // Zwracamy dane zamiast całej odpowiedzi
//     (error) => {
//         // Obsługa statusu 401 (Nieautoryzowany dostęp)
//         if (error.response?.status === 401 && error.config?.url !== '/auth/login') {
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             window.location.href = '/login'; // Przekierowanie użytkownika na stronę logowania
//         }
//         return Promise.reject(error.response?.data || { success: false, message: 'Błąd sieciowy' }); // Obsługa innych błędów
//     }
// );
//
// // Funkcje API:
//
// // Logowanie użytkownika
// const login = async (credentials) => {
//     const response = await api.post('/auth/login', credentials);
//     return response;
// };
//
// // Rejestracja użytkownika
// const register = async (userData) => {
//     const response = await api.post('/users/register', userData);
//     return response;
// };
//
// // Pobieranie listy użytkowników
// const getUsers = async () => {
//     const response = await api.get('/users');
//     return response;
// };
//
// // Usuwanie użytkownika po ID
// const deleteUser = async (id) => {
//     const response = await api.delete(`/users/${id}`);
//     return response;
// };
//
// // Pobieranie listy wizyt
// const getAppointments = async (params = {}) => {
//     const response = await api.get('/appointments', { params });
//     return response;
// };
//
// // Tworzenie nowej wizyty
// const createAppointment = async (appointmentData) => {
//     const response = await api.post('/appointments', appointmentData);
//     return response;
// };
//
// // Pobieranie wiadomości
// const getMessages = async () => {
//     const response = await api.get('/messages');
//     return response;
// };
//
// // Wysyłanie wiadomości
// const sendMessage = async (messageData) => {
//     const response = await api.post('/messages', messageData);
//     return response;
// };
//
// // Eksport funkcji
// export {
//     api,
//     login,
//     register,
//     getUsers,
//     deleteUser,
//     getAppointments,
//     createAppointment,
//     getMessages,
//     sendMessage,
// };

import axios from 'axios';

// Настройка API
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Базовый URL API. Проверьте, что он корректен.
    headers: {
        'Content-Type': 'application/json',
    },
});

// Перехватчик для установки токена авторизации
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Получаем токен из localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок запроса
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Перехватчик для обработки ответов API
api.interceptors.response.use(
    (response) => response.data, // Возвращаем только данные ответа
    (error) => {
        if (error.response?.status === 401) {
            // Удаляем токен и перенаправляем на страницу авторизации
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || { success: false, message: 'Ошибка сети' });
    }
);

// Реализация API методов
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
};

export const register = async (userData) => {
    const response = await api.post('/users/register', userData);
    return response;
};

export const getUsers = async () => {
    const response = await api.get('/users');
    return response;
};

export const getAppointments = async (params = {}) => {
    const response = await api.get('/appointments', { params });
    return response;
};

export const createAppointment = async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response;
};

// Добавляем реализацию для getMessages
export const getMessages = async () => {
    const response = await api.get('/messages');
    return response;
};

// Добавляем реализацию для sendMessage
export const sendMessage = async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response;
};

// Экспортируем сам экземпляр api, если он используется где-то напрямую
export { api };

