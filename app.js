const express = require("express");
const expressHbs = require("express-handlebars");
const app = express();
const passport = require("passport");
const expressSession = require("express-session");

const userRoutes = require("./routes/users.route");
const catRoutes = require("./routes/category.route");
const newsRoutes = require("./routes/news.route");
const api = require("./routes/API");

var initPassport = require("./passport/initSetup");
const flash = require("connect-flash");
app.use(flash());

app.engine(
  "hbs",
  expressHbs({
    extname: "hbs",
    defaultView: "main",
    layoutsDir: __dirname + "/views/layouts/"
  })
);
app.set("view engine", ".hbs");

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("/public/uploads"));

app.use(
  expressSession({
    secret: "The login section is referenced from LeeHao",
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

const connectDB = require("./config/config");
connectDB();

//Cấu hình form gửi từ client
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", userRoutes(passport));
app.use("/category", catRoutes(passport));
app.use("/news", newsRoutes(passport));
app.use(api);

app.listen(process.env.PORT || 3000);
