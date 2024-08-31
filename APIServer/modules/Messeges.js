const mongoose = require('mongoose');

const Chatmesseges = new mongoose.Schema({
    data: String,
    time: String,
    sender: String,
    receiver: String,
    text: String
});
const Chatmessege = mongoose.model('messeges', Chatmesseges);

module.exports = Chatmessege;