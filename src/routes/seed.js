'use strict';
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const db = mongoose.connection;

const seeder = require('mongoose-seeder');
const data = require('../data/data.json');

router.get('/', function (req, res, next) {
    seeder.seed(data).then(function (dbData) {
        console.log(dbData);
        res.status(200)
            .location("/")
            .end();
    }).catch(function (err) {
        console.error("Seeder Error: ", err);
        next(err);
    });
});

module.exports = router;
