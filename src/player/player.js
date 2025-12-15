import { attacksOnTile } from "../utils/boardutils.js";

export class Player {
  constructor(board, color) {
    this.board = board;
    this.color = color;
    this.pieces = this.updatePieces();
    this.king = this.findPlayerKing();
    this.moves = this.updateMoves();
    // this.opponentMoves = this.updateOpponentMoves();
    this.isInCheck = false;
    this.isInCheckMate = false;
    this.canCastleKingSide = true;
    this.canCastleQueenSide = true;
  }

  findPlayerKing() {
    return this.pieces.find((p) => {
      if (p.color === this.color && p.type === "king") {
        return p;
      }
    });
  }

  updatePlayer() {
    this.pieces = this.updatePieces();
    this.updateMoves();
    // this.updateOpponentMoves();
    this.isInCheck = this.updateInCheck();
    this.isInCheckMate = this.updateInCheckMate();
    this.updateCanCastle();
  }

  // updateOpponentMoves() {
  //   return this.board.getOpponent().moves;
  // }

  updateMoves() {
    const allMoves = [];
    this.pieces.forEach((piece) => {
      if (piece.type === "none" || piece.color !== this.color) return;
      piece.calculateMoves(this.board);
      piece.moves.forEach((move) => {
        allMoves.push(move);
      });
    });
    this.moves = allMoves;
  }

  // filterMoves(moveList) {
  //   const legalMoves = [];
  //   this.this.board.tiles.forEach((row) => {
  //     row.forEach((tile) => {
  //       console.log(tile.x, tile.y);
  //     });
  //   });
  //   moveList.forEach((move) => {
  //     if (move.toTile.x === this.king.x && move.toTile.y === this.king.y) {
  //       return;
  //     }
  //     move.makeMove();
  //     console.log(this.king.x, this.king.y);
  //     const kingTile = this.this.board.getTile(0, 0);
  //     if (attacksOnTile(this.this.board, kingTile) === 0) {
  //       legalMoves.push(move);
  //     }
  //     move.unmakeMove();
  //   });
  //   return legalMoves;
  // }

  updateInCheck() {
    return calculateAttacksOnTile(this.board.getTile(this.king.x, this.king.y));
  }

  updateInCheckMate() {
    return this.isInCheck && this.moves.length === 0;
  }

  updatePieces() {
    return this.board.pieces.filter((p) => p.color === this.color);
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
