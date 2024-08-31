import LoginCheck from './login.js';
import RegisterCheck from "./register.js";
import ChekAllChats from "./AllChatsShow.js"

const messageHandlers = {
    login: LoginCheck,
    register: RegisterCheck,
    Alldialogs: ChekAllChats
};

export default messageHandlers;