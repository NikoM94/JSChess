import { PIECES, COLORS } from "../board/constants.js";
import { validCoordinate } from "../utils/boardutils.js";
class Piece {
  constructor(type, color, imageSrc = "", x, y) {
    this.type = PIECES[type];
    this.color = COLORS[color];
    this.imageSrc = imageSrc;
    this.x = x;
    this.y = y;
    this.id = `${this.x}_${this.y}`;
    this.moves = [];
    this.isFirstMove = true;
  }

  calculateMoves(board) {
    this.moves = [];
    switch (this.type) {
      case "pawn":
        this.calculatePawnMoves(board);
        break;
      case "rook":
        this.calculateRookMoves(board);
        break;
      case "knight":
        this.calculateKnightMoves(board);
        break;
      case "bishop":
        this.calculateBishopMoves(board);
        break;
      case "queen":
        this.calculateQueenMoves(board);
        break;
      case "king":
        this.calculateKingMoves(board);
        break;
      default:
        this.moves = [];
    }
  }

  calculateRookMoves(board) {
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];
    for (const dir of directions) {
      let nx = this.x + dir.x;
      let ny = this.y + dir.y;
      while (validCoordinate(nx, ny)) {
        const destination = board.getTile(nx, ny);
        if (destination.isEmpty()) {
          this.moves.push({ x: nx, y: ny });
        } else {
          if (destination.getPiece().color !== this.color) {
            this.moves.push({ x: nx, y: ny });
          }
          break;
        }
        nx += dir.x;
        ny += dir.y;
      }
    }
  }

  calculateBishopMoves(board) {
    const directions = [
      { x: 1, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
    ];
    for (const dir of directions) {
      let nx = this.x + dir.x;
      let ny = this.y + dir.y;
      while (validCoordinate(nx, ny)) {
        const destination = board.getTile(nx, ny);
        if (destination.isEmpty()) {
          this.moves.push({ x: nx, y: ny });
        } else {
          if (destination.getPiece().color !== this.color) {
            this.moves.push({ x: nx, y: ny });
          }
          break;
        }
        nx += dir.x;
        ny += dir.y;
      }
    }
  }

  calculateQueenMoves(board) {
    this.calculateRookMoves(board);
    this.calculateBishopMoves(board);
  }

  calculateKingMoves(board) {
    const kingMoves = [
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
    for (const move of kingMoves) {
      const nx = this.x + move.x;
      const ny = this.y + move.y;
      if (validCoordinate(nx, ny)) {
        const destination = board.getTile(nx, ny);
        if (
          destination.isEmpty() ||
          destination.getPiece().color !== this.color
        ) {
          this.moves.push({ x: nx, y: ny });
        }
      }
    }
  }

  calculateKnightMoves(board) {
    const knightMoves = [
      { x: -2, y: -1 },
      { x: -2, y: 1 },
      { x: -1, y: -2 },
      { x: -1, y: 2 },
      { x: 1, y: -2 },
      { x: 1, y: 2 },
      { x: 2, y: -1 },
      { x: 2, y: 1 },
    ];
    for (const move of knightMoves) {
      const nx = this.x + move.x;
      const ny = this.y + move.y;
      if (validCoordinate(nx, ny)) {
        const destination = board.getTile(nx, ny);
        if (
          destination.isEmpty() ||
          destination.getPiece().color !== this.color
        ) {
          this.moves.push({ x: nx, y: ny });
        }
      }
    }
  }

  calculatePawnMoves(board) {
    //TODO en passant, promotion
    const dir = this.color === "white" ? -1 : 1;
    if (this.x + dir < 0 || this.x + dir > 7) return;
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
