import LoginCheck from './login.js';
import RegisterCheck from "./register.js";
import ChekAllChats from "./AllChatsShow.js";
import SearchAllMesseges from "./AllMesseges.js"

const messageHandlers = {
    login: LoginCheck,
    register: RegisterCheck,
    Alldialogs: ChekAllChats,
    AllMesseges: SearchAllMesseges
};

export default messageHandlers;