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
        }).sort({ date: -1, time: -1 }).lean();

        // Собрать уникальных партнеров и последнее сообщение с ними
        const chats = {};
        
        messages.forEach(message => {
            const partnerId = message.sender === userId ? message.receiver : message.sender;

            if (!chats[partnerId] || new Date(chats[partnerId].lastMessage.time) < new Date(message.time)) {
                chats[partnerId] = {
                    partnerId,
                    lastMessage: {
                        text: message.text,
                        time: message.time
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
