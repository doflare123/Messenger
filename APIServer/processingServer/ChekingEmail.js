const User = require("../app");
const mongoose = require('mongoose');



const EmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = {EmailValid};