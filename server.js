
const express = require('express');
const app = express();
const socket = require("socket.io");

const PORT = process.env.PORT || 5010;
const bodyParser = require('body-parser');
require('dotenv').config()
const cors = require("cors");

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use('/uploads', express.static('uploads'))

app.use('/upload-image', require('./app/upload-image'))
app.use("/user", require("./app/routes/Users/customerRoute"))
app.use("/messages", require("./app/routes/Messages/messagesRoute"))


const server = app.listen(5010, () => {
  console.log(`
################################################
       Server listening on port: ${PORT}
################################################
`);
});
const io = socket(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    // console.log("data",data)
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", {
        msg: data.msg,
        type: data.type, 
        user_id:data.from
      });
    }
  });

  socket.on("update-unread-messages", (user_id) => {
    // Implement logic to update unread messages count for the clicked contact/user.
    // This logic can involve database updates or any other data manipulation.
    // console.log("user_id")
 
    // console.log(user_id)
    // Once the unread messages are updated, you can emit an event to inform the client.
    socket.emit("unread-messages-updated", user_id);
  });
  // admin unread message with type 
  socket.on("update-unread-messages-admin", (user) => {
    // Implement logic to update unread messages count for the clicked contact/user.
    // This logic can involve database updates or any other data manipulation.
    // console.log("Admin Spocket")
 
    // console.log(user)
    // console.log(type)
    // let Arraydata=[{
    //   user_id:user_id,
    //   type:type
    // }]

    // Once the unread messages are updated, you can emit an event to inform the client.
    socket.emit("unread-messages-updated-admin", user);
  });
});



