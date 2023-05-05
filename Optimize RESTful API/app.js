const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3000;
app.use(bodyParser.json());
const uri = 'mongodb://localhost:27017/mydb';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/users', usersRouter);
app.use(limiter);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
