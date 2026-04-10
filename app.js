const express = require('express');
const app = express();
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

// ✅ DB Connection
const connectDB = require('./config/db');
connectDB();

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// ✅ Session
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-manager'
    })
}));

// ✅ View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/', authRoutes);
app.use('/', taskRoutes);

// ✅ Home Route
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/tasks');
    } else {
        res.redirect('/login');
    }
});

// ✅ Server Start (LAST)
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
/*const express = require('express');
const router = express.Router();
const app = express();
const session = require('express-session');
const {MongoStore} = require('connect-mongo');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.send('Server is running...');
});
app.get('/', (req, res) => {
    res.render('dashboard');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-manager'
    })
}));

app.use('/', authRoutes);
app.use('/', taskRoutes);

require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
*/