const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./middlewares/logger');
const errorLogger = require('./middlewares/errorLogger');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const bootcampRouter = require('./routes/bootcamp');
const coursesRouter = require('./routes/course');

connectDB();

const app = express();
app.use(logger);
app.use(errorLogger);
app.use(cookieParser());
const urlPre = '/api/v1/';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// catch 404 and forward to error handler

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// File Upload
app.use(fileUpload());
app.use(urlPre, indexRouter);
app.use(`${urlPre}users`, usersRouter);
app.use(`${urlPre}auth`, authRouter);

app.use(`${urlPre}bootcamps`, bootcampRouter);
app.use(`${urlPre}courses`, coursesRouter);
app.use((req, res, next) => {
  next(createError(404));

});
// error handler
app.use(errorHandler);
module.exports = app;