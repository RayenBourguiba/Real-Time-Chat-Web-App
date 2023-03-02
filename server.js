const http = require("http");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "System";

//Set static folder
app.use(express.static(path.join(__dirname, "public")));
const PORT = 3000 || process.env.PORT;

//run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // Welcome user to chatroom
    socket.emit("message", formatMessage(botName, "welcome to chatroom !"));

    // Broadcast when a user connects (everyone except the user himself)
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} joined the chat`)
      );
    // Broadcast when a user connects (everyone including the user himself)
    // io.emit()

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chat Message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    // console.log(msg);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} left the chat`)
      );
      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log("====================================");
  console.log(`Server running on port ${PORT}`);
  console.log("====================================");
});
