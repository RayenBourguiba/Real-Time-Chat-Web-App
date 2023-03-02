const http = require("http");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));
const PORT = 3000 || process.env.PORT;

//run when client connects
io.on("connection", (socket) => {
  // Welcome user to chatroom
  socket.emit("message", "welcome to chatroom");

  // Broadcast when a user connects (everyone except the user himself)
  socket.broadcast.emit("message", "a user joined the chat");
  // Broadcast when a user connects (everyone including the user himself)
  // io.emit()

  // Runs when user disconnects
  socket.on("disconnect", () => {
    io.emit("message", "a user left the chat");
  });

  // Lister for chat Message
  socket.on("chatMessage", (msg) => {
    // console.log(msg);
    io.emit("message", msg);
  });
});

server.listen(PORT, () => {
  console.log("====================================");
  console.log(`Server running on port ${PORT}`);
  console.log("====================================");
});
