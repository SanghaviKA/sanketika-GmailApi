var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require('cors')


require("dotenv").config();
console.log(process.env);

var indexRouter = require("./routes/index");

var app = express();
app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log({ error });
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.json({
    message: res.message || "Internal Server Error",
  });
});

module.exports = app;
