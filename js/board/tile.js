import { Piece } from "../pieces/piece.js";
import { PIECES, COLORS } from "../pieces/constants.js";
class Tile {
  constructor(x, y, color, piece = null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.piece = piece ? piece : null;
  }

  getCoordinates() {
    return { x: this.x, y: this.y };
  }

  drawTile() {
    const tileElement = document.createElement("div");
    tileElement.classList.add("tile");
    tileElement.setAttribute("data-x", this.x);
    tileElement.setAttribute("data-y", this.y);
    tileElement.style.backgroundColor = this.color;
    if (this.piece) {
      const pieceElement = this.piece.drawPiece();
      tileElement.appendChild(pieceElement);
    }
    return tileElement;
  }
}

export { Tile };
