const express = require('express');
const { v1: uuidv1 } = require('uuid');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('express-async-errors');
require('dotenv').config();

const app = express();

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorRouter = require('./controllers/authors');
const readingsRouter = require('./controllers/readings');
const logoutRouter = require('./controllers/logout');
const middleware = require('./utils/middleware');

const { connectToDatabase, sequelize } = require('./utils/db');

const morgan = require('morgan');

const start = async () => {
  await connectToDatabase();
};

start();

app.use(express.json());
app.use(
  session({
    genid: (req) => {
      console.log('Inside the session middleware');
      console.log(req.sessionID);
      return uuidv1();
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
      tableName: 'sessions',
    }),
  })
);

morgan.token('body-to-json', (req) => {
  return JSON.stringify(req.body || {});
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body-to-json'
  )
);

/** Please, notice that the app is using export-async-errors library!
 * Thus, errors are handled "under the hood".
 * Library passes the error automatically to the errorHandler-middleware
 * defined in './utils/middleware.js' taken to use below.
 *
 * Thus, no async/await try-catch or Promise.then(...).catch(...) structures are needed
 * in controllers!
 */
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/authors', authorRouter);
app.use('/api/readinglists', readingsRouter);
app.use('/api/logout', logoutRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
