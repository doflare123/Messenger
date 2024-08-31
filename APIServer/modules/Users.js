const mongoose = require('mongoose');

const Users = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    salt: String,
    Jwt: String
});

const User = mongoose.model('Users', Users);
module.exports = User;
