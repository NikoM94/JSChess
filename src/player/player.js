import { attacksOnTile } from "../utils/boardutils.js";
import { Board } from "../board/board.js";
import { CastleMove } from "../move/move.js";

export class Player {
  constructor(board, color) {
    this.color = color;
    this.pieces = board.pieces.filter((piece) => piece.color === this.color);
    this.king = board.pieces.find(
      (piece) => piece.type === "king" && piece.color === this.color,
    );
    this.moves = board.moves.filter((m) => m.pieceMoved.color === this.color);
    this.isInCheck = false;
    this.isInCheckMate = false;
    this.canCastleKingSide = true;
    this.canCastleQueenSide = true;
  }

  updatePlayer(board) {
    this.pieces = this.updatePieces(board);
    this.king = this.pieces.find((piece) => piece.type === "king" && piece.color === this.color);
    this.isInCheck = this.updateInCheck(board);
    this.isInCheckMate = this.updateInCheckMate();
    this.updateCanCastle(board);
    this.moves = this.updateMoves(board);
    this.calculateCastleMoves(board);
  }

  updateMoves(board) {
    let thisMoves = board.moves.filter((m) => {
      return m.pieceMoved.color === this.color;
    });
    // return thisMoves;
    return this.filterMoves(thisMoves, board);
  }

  filterMoves(moveList, board) {
    const legalMoves = [];
    for (const move of moveList) {
      if (move.type === "attack" && move.pieceCaptured.type === "king") {
        continue;
      }
      move.makeMove(board);
      const currentKingTile = board.tiles[this.king.x][this.king.y];
      const noAttacksOnKing = attacksOnTile(board, currentKingTile) == 0;
      if (noAttacksOnKing) {
        legalMoves.push(move);
      }
      move.unmakeMove(board);
    }
    return legalMoves;
  }

  updateInCheck(board) {
    return attacksOnTile(board, board.getTile(this.king.x, this.king.y)) != 0;
  }
  updateInCheckMate() {
    return this.isInCheck && this.moves.length === 0;
  }

  updatePieces(board) {
    return board.pieces.filter((piece) => piece.color === this.color);
  }

  updateCanCastle(board) {
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

  calculateCastleMoves(board) {
    const moves = [];

    if (!this.canCastleKingSide) {
      console.log("Can castle king side");
      let x = this.color === "white" ? 7 : 0;
      const king = this.king;
      console.log(king);
      const rookFrom = board.getTile(x, 7);
      const rookTo = board.getTile(x, 5);
      moves.push(
        new CastleMove(
          king,
          board.getTile(king.x, king.y),
          board.getTile(king.x, 6),
          rookFrom,
          rookTo,
          rookFrom.getPiece(),
        ),
      );
    }

    if (!this.canCastleQueenSide) {
      console.log("Can castle queen side");
      let x = this.color === "white" ? 7 : 0;
      const king = this.king;
      const rookFrom = board.getTile(x, 0);
      const rookTo = board.getTile(x, 3);
      moves.push(
        new CastleMove(
          king,
          board.getTile(king.x, king.y),
          board.getTile(king.x, 2),
          rookFrom,
          rookTo,
          rookFrom.getPiece(),
        ),
      );
    }
    this.moves.push(...moves);
  }
}
