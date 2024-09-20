import LoginCheck from './login.js';
import RegisterCheck from "./register.js";
import ChekAllChats from "./AllChatsShow.js";
import SearchAllMesseges from "./AllMesseges.js"
import Sentmess from "./SendMess.js";
import SearchUsers from "./SearchUsers.js";

const messageHandlers = {
    login: LoginCheck,
    register: RegisterCheck,
    Alldialogs: ChekAllChats,
    AllMesseges: SearchAllMesseges,
    NewMessage: Sentmess,
    SearchUser: SearchUsers,
};

export default messageHandlers;