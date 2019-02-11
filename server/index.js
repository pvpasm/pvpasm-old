const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
var store = new MongoDBStore({
    uri: 'mongodb+srv://pvpasm:jxJJAySr7Jt8d8X7@pvpasm-rxxxy.mongodb.net/pvpasm?retryWrites=true',
    collection: 'sessions'
});

// Middleware
app.use(bodyParser.json());
app.use(cors({
    methods:['GET','POST'],
    credentials: true // enable set cookie
}));

app.use(require('express-session')({
    secret: 'pvpasmabcdefghijklmnopqrstuvwxyz',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true
}));

const news = require('./routes/api/news');
const user = require('./routes/api/user');
const leaderboard = require('./routes/api/leaderboard');
const challenge = require('./routes/api/challenge');
app.use('/api/news', news);
app.use('/api/user', user);
app.use('/api/leaderboard', leaderboard);
app.use('/api/challenge', challenge);

app.use(express.static(__dirname + '/public'));
app.get(/^(\/api.*)/, (req, res) => res.sendFile(__dirname + `/public${req.path}/index.html`));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`))