'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/User');
const mid = require('../middleware/auth');

router.route('/')
    .get(mid.userAuth, function (req, res, next) {
        if (req.auth) {
            User.findById(req.user.id)
                .exec(function (error, user) {
                    if (error) {
                        return next(error);
                    } else {
                        console.log(user);
                        res.json(user)
                    }
                });
        } else {
            const err = new Error('Wrong email or password');
            err.status = 401;
            return next(err)
        }
    })
    .post(function (req, res, next) {
        if (req.body.fullName &&
            req.body.emailAddress &&
            req.body.password &&
            req.body.confirmPassword) {

            if (req.body.password !== req.body.confirmPassword) {
                const err = new Error('Passwords do not match');
                err.status = 400;
                return next(err);
            }

            const userData = {
                fullName: req.body.fullName,
                emailAddress: req.body.emailAddress,
                password: req.body.password
                };

            User.create(userData, function (error, user) {
                if (error) {
                    const err = new Error('That user already exists');
                    err.status = 500;
                    return next(err)
                } else {
                    res.status(201)
                        .location("/")
                        .end();
                }
            })
        } else {
            const err = new Error('All Fields Required');
            err.status = 400;
            return next(err);
        }
    });

module.exports = router;