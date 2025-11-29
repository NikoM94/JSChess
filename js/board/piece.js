import { PIECES, COLORS } from "./constants.js";
class Piece {
  constructor(type, color, imageSrc = "") {
    this.type = PIECES[type];
    this.color = COLORS[color];
    this.imageSrc = imageSrc;
  }
  drawPiece() {
    const pieceElement = document.createElement("img");
    pieceElement.classList.add("piece");
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
