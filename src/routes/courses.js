'use strict';

const express = require('express');
const router = express.Router();
const mid = require('../middleware/auth');

const User = require('../models/User');
const Course = require('../models/Course');
const Review = require('../models/Review');

router.route('/')
    .get(function (req, res, next) {
        Course.find()
            .select({
                _id: 1,
                title: 1
            })
            .exec(function (error, courses) {
                if (error) {
                    return next(error)
                } else {
                    res.json(courses);
                }
            })
    })
    .post(mid.userAuth, function (req, res, next) {
        if (req.auth) {
            if (req.body.title &&
                req.body.description &&
                req.body.steps &&
                req.body.steps[0].title &&
                req.body.steps[0].description) {

                const courseData = {
                    title: req.body.title,
                    description: req.body.description,
                    steps: req.body.steps
                };

                Course.create(courseData, function (error, course) {
                    if (error) {
                        return next(error)
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
        } else {
            const err = new Error('Wrong email or password');
            err.status = 401;
            return next(err)
        }
    });

router.route('/:courseId')
    .get(function (req, res, next) {

        Course.find({
            _id: req.params.courseId
        })
            .exec(function (error, course) {
                if (error) {
                    return next(error)
                } else {
                    res.json(course);
                }
            })
    })
    .put(mid.userAuth, function (req, res, next) {
        if (req.auth) {
            if (req.body._id &&
                req.body.title &&
                req.body.description &&
                req.body.steps &&
                req.body.steps[0].title &&
                req.body.steps[0].description) {

                const courseData = {
                    title: req.body.title,
                    description: req.body.description,
                    steps: req.body.steps
                };

                Course.findByIdAndUpdate(req.body._id, courseData, function (error, course) {
                    if (error) {
                        return next(error)
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
        } else {
            const err = new Error('Wrong email or password');
            err.status = 401;
            return next(err)
        }
    });

router.post('/:courseId/reviews', mid.userAuth, function (req, res, next) {
    if (req.auth) {
        const reviewData = {
            user: req.user._id,
            rating: req.body.rating,
            review: req.body.review
        };
        Review.create(reviewData, function (err, review) {
            if (err) {
                return next(err)
            } else {
                Course.findByIdAndUpdate(req.params.courseId, {$push: {reviews: review._id}}, function (err, course) {
                    if (err) {
                        return next(err);
                    } else {
                        res.status(201)
                            .location("/api/courses/" + req.body._id)
                            .end();
                    }
                });
            }
        });
    } else {
        const err = new Error('Wrong email or password');
        err.status = 401;
        return next(err)
    }

});

module.exports = router;