import axios from 'axios';

async function Sentmess(ws, { DataTime, JwtToken, recipient, sender, text, Data}) {
    try {
        const response = await axios.post(process.env.URL_CKECK_SENTMESSEGE, {DataTime, JwtToken, recipient, sender, text, Data});
        ws.send(JSON.stringify(response.data)); // Успешный ответ клиенту
    } catch (err) {
        console.error('Ошибка при отправке запроса:', err.message);
        ws.send(JSON.stringify({ success: false, message: 'Не удалось отправить сообщение' }));
    }
}

export default Sentmess;
