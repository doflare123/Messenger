import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config({ path: "./Config.env" });

const app = express();
const PORT = 3000;

// Создаем HTTP сервер
const server = http.createServer(app);

// Создаем WebSocket сервер
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Новое WebSocket-соединение установлено');

    ws.on('message', (message) => {
        console.log('Получено сообщение:', message);
    });

    ws.on('close', (code, reason) => {
        console.log(`Соединение закрыто. Код: ${code}, Причина: ${reason}`);
    });

    ws.send('Привет от сервера!');
});

// Запуск сервера
server.listen(PORT, (err) => {
    if (err) {
        console.error('Ошибка при запуске сервера:', err);
    } else {
        console.log(`Сервер запущен на http://192.168.88.106:${PORT}`);
    }
});

export default server;
