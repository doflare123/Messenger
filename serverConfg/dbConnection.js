import dotenv from 'dotenv';
dotenv.config({ path: "./Config.env"});

import { MongoClient} from 'mongodb';

const uriTemplate = (user, password, host, database) => 
    `mongodb://${user}:${encodeURIComponent(password)}@${host}/${database}`;

// // Конфигурация для пользователя чтения
// const readUri = uriTemplate(
//     process.env.MONGODB_READ_USER,
//     process.env.MONGODB_READ_PASSWORD,
//     process.env.MONGODB_READ_HOST,
//     process.env.MONGODB_READ_DATABASE
// );
// const readClient = new MongoClient(readUri);

// Конфигурация для пользователя записи
export const writeUri = uriTemplate(
    process.env.MONGODB_WRITE_USER,
    process.env.MONGODB_WRITE_PASSWORD,
    process.env.MONGODB_WRITE_HOST,
    process.env.MONGODB_WRITE_DATABASE
);
export const writeClient = new MongoClient(writeUri);



export async function SendToDB(email, password, salt) {
    try {
        await writeClient.connect();
        console.log("Подключение установлено");
        console.log(email, password, salt)
        // взаимодействие с базой данных
    } catch(err) {
        console.log(err);
    } finally {
        await writeClient.close();
        console.log("Подключение закрыто");
    }
}

export async function ReadDB() {
    
}

export async function ChangeDB() {
    
}

export async function DeleteFromDB() {
    
}
