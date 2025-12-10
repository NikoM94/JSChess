import { PIECES, COLORS } from "../board/constants.js";
class Piece {
  constructor(type, color, imageSrc = "", x, y) {
    this.type = PIECES[type];
    this.color = COLORS[color];
    this.imageSrc = imageSrc;
    this.x = x;
    this.y = y;
    this.id = `${this.x}_${this.y}`;
    this.moves = [];
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

  calculateMoves(board) {
    this.moves = [];
    switch (this.type) {
      case "pawn":
        this.calculatePawnMoves(board);
        break;
      // Other piece types can be added here
      default:
        this.moves = [];
    }
  }

  calculatePawnMoves(board) {
    //TODO en passant, capture, promotion
    const dir = this.color === "white" ? -1 : 1;
    const destination = board.getTile(this.x + dir, this.y);
    const startRow = this.color === "white" ? 6 : 1;
    if (destination && destination.isEmpty()) {
      this.moves.push({ x: this.x + dir, y: this.y });
    }
  }
}

export { Piece };
