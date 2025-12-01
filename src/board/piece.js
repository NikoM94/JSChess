import { PIECES, COLORS } from "./constants.js";
class Piece {
  constructor(type, color, imageSrc = "", x, y) {
    this.type = PIECES[type];
    this.color = COLORS[color];
    this.imageSrc = imageSrc;
    this.x = x;
    this.y = y;
  }
  drawPiece() {
    const pieceElement = document.createElement("img");
    pieceElement.classList.add("piece");
    pieceElement.id = `${this.x}_${this.y}`;
    pieceElement.setAttribute("data-type", this.type);
    pieceElement.setAttribute("data-color", this.color);
    if (this.imageSrc == "") {
      pieceElement.classList.add("none-piece");
    }
    pieceElement.src = this.imageSrc;
    return pieceElement;
  }
}

export { Piece };
