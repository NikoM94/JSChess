import {
  PIECES,
  COLORS,
  ROOK_MOVES,
  BISHOP_MOVES,
  KING_MOVES,
  KNIGHT_MOVES,
} from "../board/constants.js";
import { validCoordinate } from "../utils/boardutils.js";
import { Move } from "../move/move.js";

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
    for (const dir of ROOK_MOVES) {
      let nx = this.x + dir.x;
      let ny = this.y + dir.y;
      while (validCoordinate(nx, ny)) {
        const destination = board.getTile(nx, ny);
        if (destination.isEmpty()) {
          this.moves.push(
            new NormalMove(this, board.getTile(this.x, this.y), destination),
          );
        } else {
          if (destination.getPiece().color !== this.color) {
            this.moves.push(
              new AttackMove(
                this,
                board.getTile(this.x, this.y),
                destination,
                destination.getPiece(),
              ),
            );
          }
          break;
        }
        nx += dir.x;
        ny += dir.y;
      }
    }
  }

  calculateBishopMoves(board) {
    for (const dir of BISHOP_MOVES) {
      let nx = this.x + dir.x;
      let ny = this.y + dir.y;
      while (validCoordinate(nx, ny)) {
        const destination = board.getTile(nx, ny);
        if (destination.isEmpty()) {
          this.moves.push(
            new NormalMove(this, board.getTile(this.x, this.y), destination),
          );
        } else {
          if (destination.getPiece().color !== this.color) {
            this.moves.push(
              new AttackMove(
                this,
                board.getTile(this.x, this.y),
                destination,
                destination.getPiece(),
              ),
            );
          }
          break;
        }
        nx += dir.x;
        ny += dir.y;
      }
    }
  }

  calculateQueenMoves(board) {
    // queen moves are just bishop + rook moves
    this.calculateRookMoves(board);
    this.calculateBishopMoves(board);
  }

  calculateKingMoves(board) {
    // TODO: castling
    for (const move of KING_MOVES) {
      const nx = this.x + move.x;
      const ny = this.y + move.y;
      if (validCoordinate(nx, ny)) {
        const destination = board.getTile(nx, ny);
        if (destination.isEmpty()) {
          this.moves.push(
            new NormalMove(this, board.getTile(this.x, this.y), destination),
          );
        }
        if (destination.getPiece().color !== this.color) {
          this.moves.push(
            new AttackMove(
              this,
              board.getTile(this.x, this.y),
              destination,
              destination.getPiece(),
            ),
          );
        }
      }
    }
  }

  calculateKnightMoves(board) {
    for (const move of KNIGHT_MOVES) {
      const nx = this.x + move.x;
      const ny = this.y + move.y;
      if (validCoordinate(nx, ny)) {
        const destination = board.getTile(nx, ny);
        if (destination.isEmpty()) {
          this.moves.push(
            new NormalMove(this, board.getTile(this.x, this.y), destination),
          );
        }
        if (destination.getPiece().color !== this.color) {
          this.moves.push(
            new AttackMove(
              this,
              board.getTile(this.x, this.y),
              destination,
              destination.getPiece(),
            ),
          );
        }
      }
    }
  }

  calculatePawnMoves(board) {
    // TODO: promotion
    const dir = this.color === "white" ? -1 : 1;
    if (this.x + dir < 0 || this.x + dir > 7) return;
    const destination = board.getTile(this.x + dir, this.y);
    const startRow = this.color === "white" ? 6 : 1;
    if (destination && destination.isEmpty()) {
      this.moves.push(
        new NormalMove(this, board.getTile(this.x, this.y), destination),
      );
      if (this.x === startRow) {
        const doubleStep = board.getTile(this.x + 2 * dir, this.y);
        if (doubleStep && doubleStep.isEmpty()) {
          this.moves.push(
            new NormalMove(this, board.getTile(this.x, this.y), doubleStep),
          );
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
      this.moves.push(
        new AttackMove(
          this,
          board.getTile(this.x, this.y),
          captureLeft,
          captureLeft.getPiece(),
        ),
      );
    }
    if (
      captureRight &&
      !captureRight.isEmpty() &&
      captureRight.getPiece().color !== this.color
    ) {
      this.moves.push(
        new AttackMove(
          this,
          board.getTile(this.x, this.y),
          captureRight,
          captureRight.getPiece(),
        ),
      );
    }
    if (board.enPassantPawn) {
      const enPassantX = board.enPassantPawn.x;
      const enPassantY = board.enPassantPawn.y;
      if (
        enPassantX === this.x &&
        (enPassantY === this.y - 1 || enPassantY === this.y + 1)
      ) {
        this.moves.push(
          new EnPassantMove(
            this,
            board.getTile(this.x, this.y),
            board.getTile(this.x + dir, enPassantY),
            board.enPassantPawn,
          ),
        );
      }
    }
  }
}

export { Piece };
