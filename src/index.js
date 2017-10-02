'use strict';

// load modules
const express = require('express');
const app = express();
var http = require('http');
const morgan = require('morgan');
const jsonParser = require('body-parser').json;

const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const seedRoute = require('./routes/seed');

const User = require('./models/User');
const Course = require('./models/Course');
const Review = require('./models/Review');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/project-eleven-db", { useMongoClient: true });
const db = mongoose.connection;

db.on("error", function (err) {
    console.error("Connection Error: ", err);
});

db.once("open", function () {
    console.log("db connection was successful");
});

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

app.use(jsonParser());


// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/seed', seedRoute);


// catch 404 and forward to global error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// Express's global error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    res.status(err.status || 500)
        .json({
            message: err.message,
            error: {}
        })
});

// start listening on our port
var server = app.listen(app.get('port'), function () {
    console.log('Express server is listening on port ' + server.address().port);
});
