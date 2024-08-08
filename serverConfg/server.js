import { SendToDB, writeClient, writeUri} from './dbConnection.js';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: "./Config.env"});

const PORT = 3000;
const app = express();

StartServer();
function StartServer() {
  console.log(123)
  app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Listening on port ${PORT}`);
      SendToDB("fff", 123, 123)
    }
  });
}

export default StartServer;
