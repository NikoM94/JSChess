function dragStart(event) {
  console.log("dragstart");
  event.target.classList.add("selected-piece");
  event.dataTransfer.setData("text/plain", event.target.id);
  setTimeout(() => {
    event.target.classList.add("hide");
  }, 0);
}

function dragEnd(event) {
  console.log("dragend");
  event.target.classList.remove("hide");
  event.target.classList.remove("selected-piece");
}

function dragOver(event) {
  event.preventDefault();
  event.target.classList.add("drag-over");
  console.log("dragover");
}

function dragLeave(event) {
  event.target.classList.remove("drag-over");
  console.log("dragleave");
}

function drop(event) {
  console.log("drop");
  const id = event.dataTransfer.getData("text/plain");
  console.log(`id: ${id}`);
  const draggable = document.getElementById(id);
  const target = event.target;
  target.appendChild(draggable);
  event.target.classList.remove("drag-over");
}

export { dragStart, dragEnd, dragOver, drop, dragLeave };
