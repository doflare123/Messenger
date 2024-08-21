import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: "./Config.env" });

const app = express();
const PORT = 3000;

const server = http.createServer(app);

// Создаем WebSocket сервер
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Новое WebSocket-соединение установлено');

    ws.on('message', async (message) => {
        try {
            const { email, password } = JSON.parse(message.toString());
            try {
                const response = await axios.post(process.env.URL_CHECK_USER, { email, password });
                ws.send(JSON.stringify(response.data)); // Отправляем успешный ответ клиенту
            } catch (err) {
                console.error('Ошибка при отправке запроса:', err.message);
                ws.send(JSON.stringify({ success: false, message: 'Ошибка при отправке запроса на сервер' }));
            }
        } catch (error) {
            console.error('Ошибка при проверке пользователя:', error.message);
            ws.send(JSON.stringify({ success: false, message: 'Ошибка при обработке данных' }));
        }
    });

    ws.on('close', (code, reason) => {
        console.log(`Соединение закрыто. Код: ${code}, Причина: ${reason}`);
    });
});


// Запуск сервера
server.listen(PORT, (err) => {
    if (err) {
        console.error('Ошибка при запуске сервера:', err);
    } else {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    }
});

export default server;
