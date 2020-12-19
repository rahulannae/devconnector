const express = require('express');
const mongoose = require('mongoose');

const configKeys = require('./config/keys');
const db = configKeys.mongoURI;

const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(db, mongoClientOptions)
    .then(() => console.log('MONGO connected through mongoose'))
    .catch(error => console.log('MONGO connection error', error));

const user = require('./routes/api/user');
const profile = require('./routes/api/profile');
const post = require('./routes/api/post');

const app = express();

app.get('/', (req, res) => {
    res.send('WORKING again?');
});

app.use('/api/user', user);
app.use('/api/profile', profile);
app.use('/api/post', post);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
