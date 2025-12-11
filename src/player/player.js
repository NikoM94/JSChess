import { attacksOnTile } from "../utils/boardutils.js";

export class Player {
  constructor(board, color) {
    this.color = color;
    this.pieces = this.findPieces(board);
    this.moves = this.pieces.forEach((piece) => {
      piece.calculateMoves(board);
    });
    this.king = this.pieces.find((p) => p.type === "king");
    this.isInCheck = false;
    this.isInCheckMate = false;
    this.canCastleKingSide = true;
    this.canCastleQueenSide = true;
  }

  updateMoves(board) {
    this.moves = [];
    this.pieces.forEach((piece) => {
      piece.calculateMoves(board);
      piece.moves.forEach((move) => {
        this.moves.push({ piece: piece, move: move });
      });
    });
  }

  updateInCheck(board) {
    return calculateAttacksOnTile(board.getTile(this.king.x, this.king.y));
  }

  updateInCheckMate(board) {
    //TODO: need to check if move would put king in check, need to implement undo move in board
  }

  findPieces(board) {
    return board.pieces.filter((p) => p.color === this.color);
  }

  checkCanCastle() {
    let canCastleKing = true;
    let canCastleQueen = true;
    const rookKingSide = this.pieces.find(
      (p) => p.type === "rook" && p.y === 7,
    );
    const rookQueenSide = this.pieces.find(
      (p) => p.type === "rook" && p.y === 0,
    );
    if (!this.king.isFirstMove || this.isInCheck) {
      canCastleKing = false;
      canCastleQueen = false;
      return;
    } else {
      if (rookKingSide && !rookKingSide.isFirstMove) {
        canCastleKing = false;
      }
      if (rookQueenSide && !rookQueenSide.isFirstMove) {
        canCastleQueen = false;
      }
    }
    let y = this.color === "white" ? 7 : 0;
    for (let x = 1; x < 4; x++) {
      const tile = board.getTile(x, y);
      if (!tile.isEmpty() || attacksOnTile(board, tile) > 0) {
        canCastleQueen = false;
      }
    }
    for (let x = 5; x < 7; x++) {
      const tile = board.getTile(x, y);
      if (!tile.isEmpty() || attacksOnTile(board, tile) > 0) {
        canCastleKing = false;
      }
    }
    this.canCastleKingSide = canCastleKing;
    this.canCastleQueenSide = canCastleQueen;
  }
}
