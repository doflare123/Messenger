const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config.env" });




async function CreateJWT(id, name){
    const payload = {
        id: id,
        name: name
    }

    return jwt.sign(payload, process.env.Secret_key_Jwt)
}

module.exports = CreateJWT;