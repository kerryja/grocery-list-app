//make connection
const socket = io.connect("http://localhost:3000");

const addButton = document.getElementById("add-button");
const listItem = document.getElementById("list-item");
const output = document.getElementById("output");

addButton.addEventListener("click", () =>
  socket.emit("list-item", {
    item: listItem.value
  })
);

socket.on("list-item", data => {
  output.innerHTML += `<p>${data.item}</p>`;
});
