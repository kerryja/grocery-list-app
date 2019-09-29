const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const next = require("next");

// const mongo = require("mongodb");
// const mongoose = require("mongoose");
// const db = mongoose.connection;
const app = express();
const server = http.Server(app);

const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);
const io = socketIO(server);

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

//fake db
global.gItems = [];

// app.get("/", (req, res) => res.send("Hello"));

//Connect to mongo
// async function connect() {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1/grocery-app", {
//       useNewUrlParser: true
//     });
//   } catch (error) {
//     handleError(error);
//     console.log(error);
//   }
// }

// db.once("open", () => {
//   console.log("MongoDB connected");
// });

//connect to socket.io
// io.on("connection", socket => {
//   console.log("New client connected");
//   let listItems = db.collection("list-items");

io.on("connection", socket => {
  socket.on("item", data => {
    global.gItems.push(data);
    socket.broadcast.emit("item", data);
  });

  socket.on("delete", itemID => {
    console.log(itemID);
    global.gItems = global.gItems.filter(item => item.id !== itemID);
    socket.broadcast.emit("delete", itemID);
  });

  socket.on("checked", checkedItem => {
    global.gItems = global.gItems.map(item =>
      item.id === checkedItem.id ? checkedItem : item
    );
    socket.broadcast.emit("checked", checkedItem);
  });

  socket.on("updated", updatedItem => {
    global.gItems = global.gItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    socket.broadcast.emit("updated", updatedItem);
  });
  // setTimeout(function() {
  //   // To add to the "database"
  //   //global.gItems.push("From socket.io");
  //   socket.emit("item", "From socket.io");
  // }, 3000);
});

nextApp.prepare().then(() => {
  // app.get("/items", (req, res) => {
  //   res.json(items);
  // });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  //send status
  // sendStatus = s => {
  //   socket.emit("status", s);
  // };

  //get list items from mongo collection
  // socket.on("list-item", data => {
  //   let listItems = db.collection("list-items");
  //   io.sockets.emit("list-item", data);
  // });

  // listItems.find()
  // });
  // });

  // app.use(express.static("public"));

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Ready on ${port}`);
  });
});

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
