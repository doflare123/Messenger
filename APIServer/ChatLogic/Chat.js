const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: "./Config.env" });
const User = require("../modules/Users");
const Chatmessege = require("../modules/Messeges");

const Chat = async (userId, aponentName) => {
    try {
        // Находим пользователя по его имени
        const aponent = await User.findOne({ name: aponentName }).lean();
        if (!aponent) {
            throw new Error('Собеседник не найден');
        }

        // Ищем все сообщения между пользователем и его собеседником
        const messages = await Chatmessege.find({
            $or: [
                { sender: userId, receiver: aponent._id.toString() },
                { sender: aponent._id.toString(), receiver: userId }
            ]
        }).sort({ time: 1 }); // Сортируем сообщения по времени

        return messages;
    } catch (error) {
        console.error("Ошибка поиска сообщений:", error);
        throw error;
    }
};

module.exports = Chat;