// server.js
require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csurf = require('csurf');
const flashMiddleware = require('./middlewares/flash');
const authRoutes = require('./routes/auth');
const adminFootballRoutes = require('./routes/adminFootball');
const adminUsersRoutes = require('./routes/adminUsers');

const { connectDB } = require('./config/db');

// connect to DB
connectDB(process.env.MONGO_URI).catch((err) => {
  console.error('DB connection error', err);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 3256;

// middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

app.use(csurf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.currentUser = req.session.user || null;
  // flash messages middleware: expose session flash to views
  app.use(flashMiddleware);
  next();
});
const userRoutes = require('./routes/user');

app.use('/auth', authRoutes);
app.use('/admin/football', adminFootballRoutes);
app.use('/admin/users', adminUsersRoutes);
app.use('/', userRoutes);
// index route
app.get('/', (req, res) => {
  res.render('index');
});

// error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send('Invalid CSRF token');
  }
  console.error(err);
  res.status(500).send('Internal Server Error');
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
