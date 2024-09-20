const dotenv = require('dotenv');
dotenv.config({ path: "./Config.env" });
const User = require("../modules/Users");

async function SearchUs(searchQuery) {
    // Выполняем поиск пользователей, где name начинается с searchQuery
    const users = await User.find({
        $or: [
            { name: new RegExp('^' + searchQuery, 'i') } // ^ обозначает начало строки
        ]
    }, { name: 1, _id: 0 }).lean(); // Возвращаем только поле name и исключаем поле _id

    return users.map(user => ({ username: user.name })); // Форматируем результат
}

module.exports = { SearchUs };
