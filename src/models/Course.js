'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    estimatedTime: {
        type: String
    },
    materialsNeeded: {
        type: String
    },
    steps: {
        type: [{
            stepNumber: Number,
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }]
    },
    reviews: {
        type: [Schema.Types.ObjectId]
    }
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;