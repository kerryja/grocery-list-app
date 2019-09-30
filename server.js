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

const mongo = require("mongodb");
const mongoose = require("mongoose");
const db = mongoose.connection;

const server = http.Server(app);

const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);
const io = socketIO(server);

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

//look into checked not saving in db correctly

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
  socket.on("item", data => {
    if (socket.request.user && socket.request.user.logged_in) {
      itemModel.create(data);
      socket.emit("item", data);
      socket.broadcast.emit("item", data);
    }
  });

  socket.on("delete", itemID => {
    //authenticating user
    if (socket.request.user && socket.request.user.logged_in) {
      // global.gItems = global.gItems.filter(item => item.id !== itemID);
      //challenge: figuring out how to delete one item. DeleteOne and passing in {_id: itemID} does not work - have to use findByIdAndRemove - not easy to find in docs
      //.exec makes sure it executes
      console.log(itemID);
      itemModel.findByIdAndRemove(itemID).exec();
      socket.broadcast.emit("delete", itemID);
    }
  });

  socket.on("checked", checkedItem => {
    if (socket.request.user && socket.request.user.logged_in) {
      itemModel.update(checkedItem).exec();
      socket.broadcast.emit("checked", checkedItem);
    }
  });

  socket.on("updated", updatedItem => {
    if (socket.request.user && socket.request.user.logged_in) {
      itemModel.update(updatedItem).exec();
      socket.broadcast.emit("updated", updatedItem);
    }
  });
});

// Passport config
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(token, tokenSecret, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

(async function() {
  //1.connect to Mongo 2. nextjs 3. launch server
  await connectToMongo();
  await nextApp.prepare();

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: "openid email"
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
