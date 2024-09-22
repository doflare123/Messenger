const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: "./Config.env" });
const User = require("../modules/Users");
const Chatmessege = require("../modules/Messeges");

async function Dialogs(userId) {
    try {
        // Найти все сообщения для данного пользователя
        const messages = await Chatmessege.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .sort({ data: -1, time: -1 }) // Сортировка по дате и времени
        .lean();

        // Собрать уникальных партнеров и последнее сообщение с ними
        const chats = {};

        messages.forEach(message => {
            const partnerId = message.sender === userId ? message.receiver : message.sender;

            // Создаем полную временную метку для сравнения
            const messageTimestamp = new Date(`${message.data}T${message.time}`);

            // Сравниваем временные метки сообщений, чтобы выбрать последнее
            if (!chats[partnerId] || new Date(`${chats[partnerId].lastMessage.data}T${chats[partnerId].lastMessage.time}`) < messageTimestamp) {
                chats[partnerId] = {
                    partnerId,
                    lastMessage: {
                        text: message.text,
                        data: message.data, // Добавляем дату
                        time: message.time  // Добавляем время
                    }
                };
            }
        });

        // Получить данные о пользователях
        const partnerIds = Object.keys(chats);
        const users = await User.find({ _id: { $in: partnerIds } }).lean();
        
        // Создать словарь для быстрого доступа к никнеймам
        const userMap = users.reduce((acc, user) => {
            acc[user._id] = user.name;
            return acc;
        }, {});

        // Присоединить никнеймы пользователей к результатам чатов
        const chatList = Object.values(chats).map(chat => ({
            partnerId: userMap[chat.partnerId] || 'Неизвестный пользователь',
            lastMessage: chat.lastMessage
        }));

        return chatList;
    } catch (error) {
        console.error("Error retrieving chats:", error);
        throw new Error("Ошибка поиска чатов");
    }
}


module.exports = Dialogs;
