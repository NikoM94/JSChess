class Tile {
  constructor(x, y, color, piece = null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.piece = piece ? piece : null;
    this.id = `tile_${this.x}_${this.y}`;
    this.canMoveHere = false;
    this.backgroundImage =
      this.piece.type !== "none" ? `url(${this.piece.imageSrc})` : "";
  }

  getPiece() {
    return this.piece;
  }

  setPiece(piece) {
    this.piece = piece;
  }

  removePiece() {
    this.piece = null;
  }

  isEmpty() {
    return this.piece === null || this.piece.type === "none";
  }

  getCoordinates() {
    return { x: this.x, y: this.y };
  }

  drawTile() {
    const tileElement = document.createElement("div");
    tileElement.classList.add("tile");
    tileElement.setAttribute("data-x", this.x);
    tileElement.setAttribute("data-y", this.y);
    tileElement.setAttribute("id", this.id);
    tileElement.setAttribute(
      "piece-type",
      this.piece ? this.piece.type : "none",
    );
    tileElement.setAttribute(
      "piece-color",
      this.piece ? this.piece.color : "none",
    );
    tileElement.style.backgroundColor = this.color;
    tileElement.style.backgroundImage = this.backgroundImage;
    return tileElement;
  }
}

export { Tile };
