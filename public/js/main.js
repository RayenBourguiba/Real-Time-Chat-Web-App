const socket = io();
const chatForm = document.getElementById("chat-form");

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  //console.log(msg);
  // emit message to server
  socket.emit("chatMessage", msg);
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Rayen <span>9:12pm</span></p><p class="text">${message}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
