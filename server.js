const express = require("express");
const http = require("http");
const next = require("next");

const socketIO = require("socket.io");

const port = process.env.PORT || 3000;

const app = express();

// app.get("/", (req, res) => res.send("Hello"));

const server = http.Server(app);

server.listen(port, () => console.log(`server is listening on ${port}`));

app.use(express.static("public"));

const io = socketIO(server);

io.on("connection", socket => {
  console.log("New client connected");

  socket.on("list-item", data => {
    io.sockets.emit("list-item", data);
  });
});
