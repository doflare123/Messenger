const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: "./Config.env" });
const writeClient = require('./dbConnection');
const cors = require('cors');
const {generateSalt, hashPassword, validatePassword} = require('./security/crypt')
const {EmailValid} = require("./processingServer/ChekingEmail");
const CreateJWT = require("./security/Create_jwt");

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
    salt: String,
    Jwt: String
});
const User = mongoose.model('Users', Users);

const isEmailUnique = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        return !user;
    } catch (error) {
        console.log("Ошибка сервера", error)
    }
};

// Маршрут для проверки существования пользователя
app.post("/api/check-user", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Ищем пользователя в базе данных по email
        const salt = await User.findOne({ email: email }).select({salt: 1, _id: 0}).lean();
        const passwordTrue = await User.findOne({ email: email }).select({password: 1, _id: 0}).lean();
        const UserNameGet = await User.findOne({email: email}).select({name: 1, _id: 1}).lean();
        const isValid = validatePassword(password, passwordTrue.password, salt.salt);
        
        if (isValid) {
            try {
                const JWT_token = await CreateJWT(UserNameGet._id, UserNameGet.name);
                await User.findByIdAndUpdate(UserNameGet._id, {
                    Jwt: JWT_token
                });
                res.status(200).json({ success: true, message: 'Добро пожаловать!', userId: User._id });
            } catch (error) {
                console.log(error, "Ошибка при создании токена");
            }
        } else {
            res.status(400).json({ success: false, message: 'Неверный логин или пароль'});
        }
    } catch (error) {
        console.error('Ошибка при проверке пользователя:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.post("/api/create-user", async (req, res) =>{
    const {UserName, email, password} = req.body;

    // Проверка валидности email
    if (!EmailValid(email)) {
        return res.status(402).json({ success: false, message: 'Некорректный формат электронной почты' });
    }
    else
        isEmailUnique();

    // Проверка уникальности email
    if (!(await isEmailUnique(email))) {
        return res.status(403).json({ success: false, message: 'Электронная почта уже используется' });
    }

    const CreateSalt = generateSalt();
    const HashedPaswd = hashPassword(password, CreateSalt);

    const newUser = new User({
        name: UserName,
        email: email,
        password: HashedPaswd,
        salt: CreateSalt,
        Jwt: ''
    })

    try {
        await newUser.save();
        console.log("Пользователь успешно создан!")
    } catch (error) {
        console.log("Произошла ошибка создания пользователя", error)
    }
})


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
});

module.exports = {User};