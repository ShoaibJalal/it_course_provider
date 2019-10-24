"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose"),
  Subscriber = require("./subscriber");

var userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true
      },
      last: {
        type: String,
        trim: true
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999
    },
    password: {
      type: String,
      required: true
    },
    /* Associating users with subscribers */
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
    /* Associating users with multiple courses */
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
  },
  /* The timestamps property is an add-on provided by Mongoose to record the createdAt and updatedAt attributes */
  {
    timestamps: true
  }
);

// making virtual attribute to return users fullname
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});
// Mongoose pre("save") hook to link subscribers and users with the same email address
userSchema.pre("save", function(next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email
    })
      .then(subscriber => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});
//  Adding  passport-local-mongoose module as a user schema plugin
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);
