class Tile {
  constructor(x, y, color, piece = null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.piece = piece ? piece : null;
    this.id = `tile_${this.x}_${this.y}`;
  }

  addListeners(tileElement) {
    const pieceElement = this.piece.drawPiece();
    pieceElement.draggable = true;
    pieceElement.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", pieceElement.id);
    });
    // Listeners can be added here if needed
    console.log(`Listeners added to tile at (${this.x}, ${this.y})`);
  }

  drawTile() {
    const tileElement = document.createElement("div");
    tileElement.classList.add("tile");
    tileElement.setAttribute("data-x", this.x);
    tileElement.setAttribute("data-y", this.y);
    tileElement.setAttribute("id", this.id);
    tileElement.style.backgroundColor = this.color;
    if (this.piece.type !== "none") {
      this.addListeners(tileElement);
      tileElement.appendChild(pieceElement);
    }
    return tileElement;
  }
}

export { Tile };
