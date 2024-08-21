const dotenv = require('dotenv');
dotenv.config({ path: "./Config.env"});

const uriTemplate = (user, password, host, database) => 
    `mongodb://${user}:${encodeURIComponent(password)}@${host}/${database}`;

const writeUri = uriTemplate(
    process.env.MONGODB_WRITE_USER,
    process.env.MONGODB_WRITE_PASSWORD,
    process.env.MONGODB_WRITE_HOST,
    process.env.MONGODB_WRITE_DATABASE
);

module.exports = writeUri;