const express = require('express');
const mongodb = require('mongodb');
const crypto = require('crypto');

const router = express.Router();

router.post('/login', async (req, res) => {
    const userCollection = await loadUserCollection();

    var user = await userCollection.findOne({
        username: req.body.username
    });
    var hash = sha512(req.body.password, user.salt);

    if (hash === user.hash) {
        req.session.username = req.body.username;
        res.cookie('username', req.body.username, {maxAge: 1000 * 60 * 60 * 24 * 7});
        res.status(200).send();
    }
    else {
        res.status(401).send();
    }
});

router.post('/register', async (req, res) => {
    const userCollection = await loadUserCollection();

    var salt = genRandomString(16);
    var hash = sha512(req.body.password, salt);

    await userCollection.insertOne({
        username: req.body.username,
        hash: hash,
        salt: salt,
        score: 0
    });

    req.session.username = req.body.username;
    res.cookie('username', req.body.username, {maxAge: 1000 * 60 * 60 * 24 * 7});

    res.status(201).send();
});

function sha512(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};

function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

async function loadUserCollection() {
    const client = await mongodb.MongoClient.connect("mongodb+srv://pvpasm:jxJJAySr7Jt8d8X7@pvpasm-rxxxy.mongodb.net/pvpasm?retryWrites=true", {
        useNewUrlParser: true
    })

    return client.db('pvpasm').collection('user');
}

module.exports = router;