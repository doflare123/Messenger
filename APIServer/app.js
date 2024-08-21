const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: "./Config.env" });
const writeClient = require('./dbConnection');
const cors = require('cors');
const {validatePassword} = require('./crypt')

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST']
}));

// Подключение к MongoDB
mongoose.connect(writeClient, {
}).then(() => {
    console.log('Подключено к MongoDB');
}).catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
});

// Схема пользователя
const Users = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    salt: String
});

const User = mongoose.model('Users', Users);

// Маршрут для проверки существования пользователя
app.post("/api/check-user", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ищем пользователя в базе данных по email
        const salt = await User.findOne({ email: email }).select({salt: 1, _id: 0}).lean();
        const passwordTrue = await User.findOne({ email: email }).select({password: 1, _id: 0}).lean();
        const isValid = validatePassword(password, passwordTrue, salt.salt);
        
        if (isValid) {
            res.status(200).json({ success: true, message: 'Добро пожаловать!', userId: User._id });
        } else {
            res.status(400).json({ success: false, message: 'Неверный логин или пароль'});
        }
    } catch (error) {
        console.error('Ошибка при проверке пользователя:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
});

