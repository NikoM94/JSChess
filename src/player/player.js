import { attacksOnTile } from "../utils/boardutils.js";

export class Player {
  constructor(board, color) {
    this.board = board;
    this.color = color;
    this.pieces = this.updatePieces();
    this.king = this.findPlayerKing();
    this.moves = this.updateMoves();
    this.isInCheck = false;
    this.isInCheckMate = false;
    this.canCastleKingSide = true;
    this.canCastleQueenSide = true;
  }

  findPlayerKing() {
    for (const piece of this.pieces) {
      if (piece.type == "king") {
        return piece;
      }
    }
    return null;
  }

  updatePlayer() {
    this.pieces = this.updatePieces();
    this.moves = this.updateMoves();
    // this.updateOpponentMoves();
    this.isInCheck = this.updateInCheck();
    this.isInCheckMate = this.updateInCheckMate();
    this.updateCanCastle();
  }

  // updateOpponentMoves() {
  //   return this.board.getOpponent().moves;
  // }

  updateMoves() {
    let thisMoves = [];
    for (const move of this.board.moves) {
      if (move.pieceMoved.color == this.color) thisMoves.push(move);
    }
    console.log(thisMoves);
    // return this.filterMoves(thisMoves);
    return thisMoves;
  }

  filterMoves(moveList) {
    // bugged piece of shit
    const legalMoves = [];
    const kingTile = this.board.getTile(this.king.x, this.king.y);
    for (const move of moveList) {
      move.makeMove();
      const noAttacksOnKing = attacksOnTile(this.board, kingTile) == 0;
      if (noAttacksOnKing) {
        legalMoves.push(move);
      }
      move.unmakeMove();
    }
    return legalMoves;
  }

  updateInCheck() {
    return (
      attacksOnTile(this.board, this.board.getTile(this.king.x, this.king.y)) !=
      0
    );
  }
  updateInCheckMate() {
    return this.isInCheck && this.moves.length === 0;
  }

  updatePieces() {
    let thisPieces = [];
    for (const piece of this.board.pieces) {
      if (piece.color == this.color) {
        thisPieces.push(piece);
      }
    }
    return thisPieces;
  }

  updateCanCastle() {
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
      const tile = this.board.getTile(x, y);
      if (!tile.isEmpty() || attacksOnTile(this.board, tile) > 0) {
        canCastleQueen = false;
      }
    }
    for (let x = 5; x < 7; x++) {
      const tile = this.board.getTile(x, y);
      if (!tile.isEmpty() || attacksOnTile(this.board, tile) > 0) {
        canCastleKing = false;
      }
    }
    this.canCastleKingSide = canCastleKing;
    this.canCastleQueenSide = canCastleQueen;
  }
}
