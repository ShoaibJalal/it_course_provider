"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

var courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    maxStudents: {
      type: Number,
      default: 0,
      min: [0, "Course cannot have a negative number of students"]
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, "Course cost can not be negative."]
    }
  },
  /* The timestamps property is an add-on provided by Mongoose to record the createdAt and updatedAt attributes */
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", courseSchema);
