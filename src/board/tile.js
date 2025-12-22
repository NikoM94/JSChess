export class Tile {
  constructor(x, y, color, piece = null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.piece = piece ? piece : null;
    this.id = `tile_${this.x}_${this.y}`;
    this.backgroundImage =
      this.piece.type !== "none" ? `url(${this.piece.imageSrc})` : "";
  }

  getPiece() {
    return this.piece;
  }

  setPiece(piece) {
    this.piece = piece;
    this.backgroundImage =
      this.piece && this.piece.type !== "none"
        ? `url(${this.piece.imageSrc})`
        : "";
  }

  isEmpty() {
    return this.piece === null || this.piece.type === "none";
  }

  drawTile() {
    const tileElement = document.createElement("div");
    tileElement.classList.add("tile");
    tileElement.dataset.x = this.x;
    tileElement.dataset.y = this.y;
    tileElement.setAttribute("id", this.id);
    tileElement.dataset.pieceType = this.piece ? this.piece.type : "none";
    tileElement.dataset.pieceColor = this.piece ? this.piece.color : "none";
    tileElement.style.backgroundColor = this.color;
    tileElement.style.backgroundImage = this.backgroundImage;
    return tileElement;
  }
}
