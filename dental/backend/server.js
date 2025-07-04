const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Завантаження змінних середовища з .env

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes'); // Підключаємо маршрут для повідомлень

const app = express(); // Ініціалізація Express


// Додаємо статичну папку для фотографій
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware для JSON-даних і CORS
app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));

// Підключення до MongoDB без застарілих параметрів
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB database.'))
    .catch(err => console.error('Database connection error:', err));

// Реєстрація маршрутів API
app.use('/api/auth', authRoutes); // Аутентифікація
app.use('/api/appointments', appointmentRoutes); // Управління візитами
app.use('/api/users', userRoutes); // Управління користувачами
app.use('/api/messages', messageRoutes); // Управління повідомленнями

// Запуск сервера на вказаному порту
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));