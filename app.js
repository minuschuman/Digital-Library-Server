const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const cookieParser = require("cookie-parser");
// const session = require("express-session");

require("dotenv/config");

app.use(cors());
// app.use(
// cors({
/*
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
    */
// })
// );
// app.use(cookieParser());

const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const { PORT = 5000, LOCAL_ADDRESS = "0.0.0.0" } = process.env;

const bookRoute = require("./api/routes/books");
const orderRoute = require("./api/routes/orders");
const userRoute = require("./api/routes/user");
const ratingRoute = require("./api/routes/rating");
const viewRoute = require("./views/routes");

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   session({
//     key: "minus",
//     secret: "subscribe",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       expires: 60 * 60 * 24,
//     },
//   })
// );
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/api/books", bookRoute);
app.use("/api/orders", orderRoute);
app.use("/api/user", userRoute);
app.use("/api/rating", ratingRoute);
app.use("/", viewRoute);

// app.get("/", (req, res, next) => {
//   res.status(200).json({
//     minus: "Chuman",
//   });
// });

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const dbURI = process.env.DB_CONNECTION;
mongoose
  .connect(dbURI)
  .then((data) => {
    // console.log(data);
    app.listen(PORT, LOCAL_ADDRESS, () => {
      console.log(`server listening at http://${LOCAL_ADDRESS}:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
