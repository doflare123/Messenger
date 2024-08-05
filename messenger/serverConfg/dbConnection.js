const mongoose = require('mongoose');
require('dotenv').config();

const uriTemplate = (user, password, host, database) => 
    `mongodb://${user}:${password}@${host}/${database}`;

// Конфигурация для пользователя чтения
const readUri = uriTemplate(
    process.env.MONGODB_READ_USER,
    process.env.MONGODB_READ_PASSWORD,
    process.env.MONGODB_READ_HOST,
    process.env.MONGODB_READ_DATABASE
);
const readClient = new MongoClient(readUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Конфигурация для пользователя записи
const writeUri = uriTemplate(
    process.env.MONGODB_WRITE_USER,
    process.env.MONGODB_WRITE_PASSWORD,
    process.env.MONGODB_WRITE_HOST,
    process.env.MONGODB_WRITE_DATABASE
);
const writeClient = new MongoClient(writeUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Конфигурация для пользователя обновления
const updateUri = uriTemplate(
    process.env.MONGODB_UPDATE_USER,
    process.env.MONGODB_UPDATE_PASSWORD,
    process.env.MONGODB_UPDATE_HOST,
    process.env.MONGODB_UPDATE_DATABASE
);
const updateClient = new MongoClient(updateUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Конфигурация для пользователя удаления
const deleteUri = uriTemplate(
    process.env.MONGODB_DELETE_USER,
    process.env.MONGODB_DELETE_PASSWORD,
    process.env.MONGODB_DELETE_HOST,
    process.env.MONGODB_DELETE_DATABASE
);
const deleteClient = new MongoClient(deleteUri, { useNewUrlParser: true, useUnifiedTopology: true });

Reader().catch(err => console.log(err));
Writer().catch(err => console.log(err));
Updater().catch(err => console.log(err));
Deleter().catch(err => console.log(err));

async function Reader() {
    await mongoose.connect(readClient);
}

async function Writer() {
    await mongoose.connect(writeClient);
}

async function Updater() {
    await mongoose.connect(updateClient);
}

async function Deleter() {
    await mongoose.connect(deleteClient);
}