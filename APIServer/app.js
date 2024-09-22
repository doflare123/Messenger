const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: "./Config.env" });
const writeUri = require('./dbConnection');
const cors = require('cors');
const { generateSalt, hashPassword, validatePassword } = require('./security/crypt');
const { EmailValid } = require("./processingServer/ChekingEmail");
const CreateJWT = require("./security/Create_jwt");
const Dialogs = require("./ChatLogic/SearchAllChats");
const User = require('./modules/Users'); 
const Chat = require('./ChatLogic/Chat');
const { SendingMess } = require('./ChatLogic/SendMessage');
const { SearchUs } = require('./ChatLogic/SearchUsers');

const app = express();
const PORT = 8080;


app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST']
}));

// Подключение к MongoDB
mongoose.connect(writeUri, {
}).then(() => {
    console.log('Подключено к MongoDB');
}).catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
});

const isEmailUnique = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        return !user;
    } catch (error) {
        console.log("Ошибка сервера", error)
    }
};

const isUserNameUnique = async (UserName) => {
    try {
        const user = await User.findOne({ name: UserName });
        return !user;
    } catch (error) {
        console.log("Ошибка сервера", error)
    }
};

app.post("/api/check-user", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select({ salt: 1, password: 1, name: 1, _id: 1 }).lean();

        if (!user) {
            console.log("User not found");
            return res.status(400).json({ success: false, message: 'Пользователь не найден' });
        }

        const isValid = validatePassword(password, user.password, user.salt);

        if (!isValid) {
            console.log("Invalid password");
            return res.status(400).json({ success: false, message: 'Неверный логин или пароль' });
        }
        
        const JWT_token = await CreateJWT(user._id, user.name);

        const updatedUser = await User.findByIdAndUpdate(user._id, { Jwt: JWT_token }, { new: true }).lean();

        if (!updatedUser) {
            console.log("Error updating token");
            return res.status(500).json({ success: false, message: 'Ошибка обновления токена' });
        }

        console.log("Sending success response");
        return res.status(200).json({
            success: true,
            message: 'Добро пожаловать!',
            token: JWT_token,
            id: updatedUser._id.toString(),
            name: user.name
        });

    } catch (error) {
        console.error('Ошибка при проверке пользователя:', error);
        return res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.post("/api/create-user", async (req, res) =>{
    const {UserName, email, password} = req.body;

    // Проверка уникальности email
    if (!(await isEmailUnique(email))) {
        return res.status(403).json({ success: false, message: 'Электронная почта уже используется' });
    }
    if(!(await isUserNameUnique(UserName)))
        return res.status(403).json({ success: false, message: 'Никнейм уже используется' });
    

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

app.post('/api/SearchAllUnikChats', async (req, res) => {
    console.log("Start search")
    const { JwtToken, UserId } = req.body;
    try {
        const user = await User.findOne({ Jwt: JwtToken }).lean();
        if (user) {
            try {
                const FindDialogs = await Dialogs(UserId);
                res.status(200).json({ success: true, FindDialogs });
            } catch (error) {
                console.error("Ошибка поиска диалогов:", error);
                res.status(405).json({success:false, message: "Что-то пошло не так при поиске диалогов"});
            }
        } else {
            console.log("Не найден пользователь или неправильный токен");
            res.status(403).json({ success: false, message: 'Ошибка в токене' });
        }
    } catch (error) {
        console.error("Ошибка поиска диалогов:", error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.post('/api/SearchAllMessages', async (req, res) => {
    console.log("Start search messages");
    const { JwtToken, UserId, AponentName } = req.body;

    try {
        const user = await User.findOne({ Jwt: JwtToken }).lean();
        if (!user) {
            console.log("Не найден пользователь или неправильный токен");
            return res.status(403).json({ success: false, message: 'Ошибка в токене' });
        }
        try {
            const FindMessages = await Chat(UserId, AponentName);
            res.status(200).json({ success: true, FindMessages });
        } catch (error) {
            console.error("Ошибка поиска сообщений:", error);
            res.status(405).json({ success: false, message: "Что-то пошло не так при поиске сообщений" });
        }
    } catch (error) {
        console.error("Ошибка поиска сообщений:", error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.post('/api/SentMessage', async (req, res) => {
    console.log("Sending message");
    console.log(req.body)
    const {DataTime, JwtToken, recipient, sender, text, Data} = req.body;

    try {
        const user = await User.findOne({ Jwt: JwtToken }).lean();
        if (!user) {
            console.log("Не найден пользователь или неправильный токен");
            return res.status(403).json({ success: false, message: 'Ошибка в токене' });
        }
        try {
            const SentMess = await SendingMess(text, sender, recipient, DataTime, Data);
            console.log("Новое сообщение:", SentMess);
            res.status(200).json({success: true, SentMess});
        } catch (error) {
            console.error("Ошибка сохранения сообщений:", error);
            res.status(405).json({ success: false, message: "Что-то пошло не так при поиске сообщений" });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"При отправке сообщения произошла ошибка"})
    }

});

app.post('/api/SearchUsers', async (req, res) => {
    console.log("start search users");
    const { JwtToken, searchQuery } = req.body;
    try {
        const user = await User.findOne({ Jwt: JwtToken }).lean();
        if (!user) {
            return res.status(403).json({ success: false, message: 'Ошибка в токене' });
        }
        try {
            const users = await SearchUs(searchQuery);
            console.log(users)
            res.status(200).json({
                success: true,
                type: 'SearchUserResponse',
                data: users
            });
        } catch (error) {
            console.error('Ошибка поиска пользователей:', error);
            res.status(500).json({ success: false, message: 'Ошибка поиска пользователей' });
        }
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        res.status(500).json({ success: false, message: 'Ошибка проверки токена' });
    }
});






// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
});

module.exports = {User};