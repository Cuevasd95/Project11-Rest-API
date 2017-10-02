'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReviewSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId
    },
    postedOn: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: {
        type: String
    }
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;