function dragStart(event) {
  console.log("dragstart");
  event.dataTransfer.setData("text/plain", event.target.id);
  setTimeout(() => {
    event.target.classList.add("hide");
  }, 0);
}

function dragEnd(event) {
  console.log("dragend");
  event.target.classList.remove("hide");
}

function dragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("drag-over");
  console.log("dragover");
}

function dragLeave(event) {
  event.currentTarget.classList.remove("drag-over");
  console.log("dragleave");
}

function drop(event) {
  console.log("drop");
  const id = event.dataTransfer.getData("text/plain");
  console.log(`id: ${id}`);
  const draggable = document.getElementById(id);
  const target = event.currentTarget;
  target.appendChild(draggable);
}

export { dragStart, dragEnd, dragOver, drop, dragLeave };
