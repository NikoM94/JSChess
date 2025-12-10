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
      if (this.x === startRow) {
        const doubleStep = board.getTile(this.x + 2 * dir, this.y);
        if (doubleStep && doubleStep.isEmpty()) {
          this.moves.push({ x: this.x + 2 * dir, y: this.y });
        }
      }
    }
    const captureLeft = board.getTile(this.x + dir, this.y - 1);
    const captureRight = board.getTile(this.x + dir, this.y + 1);
    if (
      captureLeft &&
      !captureLeft.isEmpty() &&
      captureLeft.getPiece().color !== this.color
    ) {
      this.moves.push({ x: this.x + dir, y: this.y - 1 });
    }
    if (
      captureRight &&
      !captureRight.isEmpty() &&
      captureRight.getPiece().color !== this.color
    ) {
      this.moves.push({ x: this.x + dir, y: this.y + 1 });
    }
  }
}

export { Piece };
