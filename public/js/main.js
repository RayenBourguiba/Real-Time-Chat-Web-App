const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// Get Username & Room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
//console.log(username, room);

// Join Room
socket.emit("joinRoom", { username, room });

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  //console.log(msg);
  // emit message to server
  socket.emit("chatMessage", msg);
  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p><p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
