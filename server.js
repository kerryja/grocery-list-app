const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const next = require("next");

const mongo = require("mongodb");
const mongoose = require("mongoose");
const db = mongoose.connection;

const app = express();
const server = http.Server(app);

const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);
const io = socketIO(server);

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

//Connect to mongo
async function connectToMongo() {
  try {
    await mongoose.connect("mongodb://127.0.0.1/grocery-app", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    handleError(error);
    console.log(error);
  }
}

db.once("open", () => {
  console.log("MongoDB connected");
});

const itemSchema = new mongoose.Schema({
  name: String,
  checked: Boolean
});

const itemModel = mongoose.model("Item", itemSchema);

io.on("connection", socket => {
  socket.on("item", data => {
    itemModel.create(data);
    socket.emit("item", data);
    socket.broadcast.emit("item", data);
  });

  socket.on("delete", itemID => {
    // global.gItems = global.gItems.filter(item => item.id !== itemID);
    //challenge: figuring out how to delete one item. DeleteOne and passing in {_id: itemID} does not work - have to use findByIdAndRemove - not easy to find in docs
    //.exec makes sure it executes
    console.log(itemID);
    itemModel.findByIdAndRemove(itemID).exec();
    socket.broadcast.emit("delete", itemID);
  });

  socket.on("checked", checkedItem => {
    itemModel.update(checkedItem).exec();
    socket.broadcast.emit("checked", checkedItem);
  });

  socket.on("updated", updatedItem => {
    itemModel.update(updatedItem).exec();
    socket.broadcast.emit("updated", updatedItem);
  });
});

(async function() {
  //1.connect to Mongo 2. nextjs 3. launch server
  await connectToMongo();
  await nextApp.prepare();

  app.get("*", (req, res) => {
    req.itemModel = itemModel;
    return nextHandler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Ready on ${port}`);
  });
})();

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
