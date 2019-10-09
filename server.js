const express = require("express");
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const next = require("next");
require("dotenv").config();
const passport = require("passport");
const passportSocketIo = require("passport.socketio");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

//google auth
app.use(cookieParser());
app.use(require("body-parser").urlencoded({ extended: true }));
let memoryStore = new MemoryStore({ checkPeriod: 8640000 /* 24h */ });
app.use(
  session({
    store: memoryStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1.21e9
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

const mongoose = require("mongoose");
const db = mongoose.connection;
const queries = require("./db/queries");

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
    const MONGO_DB =
      process.env.MONGODB_URI ||
      (process.env.NODE_ENV == "test"
        ? "mongodb://127.0.0.1/grocery-app-test"
        : "mongodb://127.0.0.1/grocery-app");
    await mongoose.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  } catch (error) {
    handleError(error);
    console.log(error);
  }
}

db.once("open", () => {
  console.log("MongoDB connected");
});

//middleware - adds a user property to socket.io. Without this, you would be able to add things to list w/out beign signed in
io.use(
  passportSocketIo.authorize({
    key: "connect.sid",
    secret: process.env.SESSION_SECRET,
    passport: passport,
    store: memoryStore,
    cookieParser: cookieParser
  })
);

io.on("connection", socket => {
  socket.on("item", async data => {
    if (socket.request.user && socket.request.user.logged_in) {
      let newItem = await queries.createNewGroceryItem(data);
      data.id = newItem.id;
      socket.emit("item", data);
      socket.broadcast.emit("item", data);
    }
  });

  socket.on("delete", itemID => {
    //authenticating user
    if (socket.request.user && socket.request.user.logged_in) {
      console.log("deleting this item ID");
      console.log(itemID);
      queries.deleteGroceryItem(itemID);
      socket.to(socket.request.user.id).emit("delete", itemID);
    }
  });

  socket.on("clearList", () => {
    if (socket.request.user && socket.request.user.logged_in) {
      queries.clearList();
      socket.to(socket.request.user.id).emit("clearList");
    }
  });

  socket.on("checked", checkedItem => {
    if (socket.request.user && socket.request.user.logged_in) {
      queries.checkOffGroceryItem(checkedItem);
      socket.broadcast.emit("checked", checkedItem);
    }
  });

  socket.on("updated", updatedItem => {
    if (socket.request.user && socket.request.user.logged_in) {
      queries.updateGroceryItem(updatedItem);
      socket.broadcast.emit("updated", updatedItem);
    }
  });
});

// Passport config
const callbackUrl = dev
  ? "http://localhost:3000/auth/google/callback"
  : "https://kerryja-groceries.herokuapp.com/auth/google/callback";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackUrl
    },
    function(token, tokenSecret, profile, done) {
      return done(null, profile);
    }
  )
);

//needed for remembering who is connected/how
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
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

module.exports = (async function() {
  //1.connect to Mongo 2. nextjs 3. launch server
  await connectToMongo();
  await nextApp.prepare();

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: "openid profile"
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
      res.redirect("/");
    }
  );

  app.get("/auth/google/signout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("*", (req, res) => {
    req.queries = queries;
    return nextHandler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Ready on ${port}`);
  });
})();
