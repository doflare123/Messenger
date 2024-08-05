const express = require('express');
const PORT = 3000;

const app = express();

function StartServer() {
  app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Listening on port ${PORT}`);
    }
  });
}

module.exports = StartServer;