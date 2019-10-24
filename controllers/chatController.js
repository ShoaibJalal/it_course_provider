"use strict";

const Message = require("../models/message");

module.exports = io => {
  //Listening for new user connections
  io.on("connection", client => {
    Message.find({})
      .sort({
        createdAt: -1
      })
      .limit(10)
      .then(messages => {
        client.emit("load all messages", messages.reverse());
      });
    console.log("new connection");
    // Listening for when the user disconnects
    client.on("disconnect", () => {
      console.log("user disconnected");
    });
    // Listening for message events
    client.on("message", data => {
      let messageAttributes = {
          content: data.content,
          userName: data.userName,
          user: data.userId
        },
        m = new Message(messageAttributes);
      m.save()
        .then(() => {
          //broadcasting a message to all connected users.
          io.emit("message", messageAttributes);
        })
        .catch(error => console.log(`error: ${error.message}`));
    });
  });
};
