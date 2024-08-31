import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import axios from 'axios';
import dotenv from 'dotenv';
import messageHandlers from './processingMessages/GeneralProc.js';

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
            const data = JSON.parse(message.toString());
            const hendler = messageHandlers[data.type];
            if(hendler)
                hendler(ws, data);
            else
                ws.send(JSON.stringify({success: false, message: "Тип запроса не найден"}));
        } catch (error) {
            console.error('Ошибка при обработке данных:', error.message);
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