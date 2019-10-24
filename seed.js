"use strict";

const mongoose = require("mongoose"),
  Course = require("./models/course");
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/it_course_provider",
  { useNewUrlParser: true, useFindAndModify: false }
);

Course.deleteMany({})
  .then(() => {
    return Course.create({
      title: "Java",
      description: "Learn basics in this course",
      cost: 22,
      maxStudents: 30
    });
  })
  .then(course => console.log(course.title))
  .then(() => {
    return Course.create({
      title: "Internet Security",
      description: "Learn to secure your network",
      cost: 50,
      maxStudents: 40
    });
  })
  .then(course => console.log(course.title))
  .then(() => {
    return Course.create({
      title: "JavaScript",
      description: "Learn basics of web Development",
      cost: 25,
      maxStudents: 30
    });
  })
  .then(course => console.log(course.title))
  .catch(error => console.log(error.message))
  .then(() => {
    console.log("DONE");
    mongoose.connection.close();
  });
