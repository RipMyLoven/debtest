const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Middleware для парсинга JSON
app.use(express.json());

// Основные маршруты
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// API маршрут для проверки статуса
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running successfully!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API маршрут для получения информации о сервере
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Deploy Test App',
        description: 'Simple web application for testing deployment',
        version: '1.0.0',
        node_version: process.version,
        environment: process.env.NODE_ENV || 'development'
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} in your browser`);
});

module.exports = app;