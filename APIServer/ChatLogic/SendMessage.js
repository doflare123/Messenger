const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: "./Config.env" });
const User = require("../modules/Users");
const Chatmessege = require("../modules/Messeges");
const {encryptMessage} = require("../security/CryptingMessages");

async function SendingMess(text, sender, recipientName, DataTime, Data) {
    console.log(DataTime,     Data)
    try {
        // Поиск пользователя по имени
        const recipient = await User.findOne({ name: recipientName });
        
        if (!recipient) {
            throw new Error("Получатель не найден");
        }

        const recipientId = recipient._id; // Получаем ID получателя

        const newMessage = new Chatmessege({
            data: Data,            // Дата сообщения
            time: DataTime,        // Время сообщения
            sender: sender,        // ID отправителя
            receiver: recipientId, // ID получателя
            text: text,   // Зашифрованный текст сообщения
        });

        await newMessage.save(); // Сохранение в MongoDB
        console.log("Сообщение успешно сохранено с шифрованием");
        return newMessage;
    } catch (error) {
        console.error("Ошибка при сохранении сообщения:", error);
        throw error;
    }
}

module.exports = { SendingMess };
