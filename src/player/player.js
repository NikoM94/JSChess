import { attacksOnTile } from "../utils/boardutils.js";

export class Player {
  constructor(board, color) {
    this.board = board;
    this.color = color;
    this.pieces = this.board.pieces.filter((piece) => piece.color === this.color);
    this.king = this.board.pieces.find((piece) => piece.type === "king" && piece.color === this.color);
    this.moves = this.board.moves.filter(m => m.pieceMoved.color === this.color);
    this.isInCheck = false;
    this.isInCheckMate = false;
    this.canCastleKingSide = true;
    this.canCastleQueenSide = true;
  }

  updatePlayer(board) {
    this.pieces = this.updatePieces(board);
    this.king = this.pieces.find((piece) => piece.type === "king");
    this.isInCheck = this.updateInCheck(board);
    this.isInCheckMate = this.updateInCheckMate();
    this.updateCanCastle(board);
    this.moves = this.updateMoves(board);
  }

  updateMoves(board) {
    let thisMoves = board.moves.filter(m => {
      return m.pieceMoved.color === this.color;
    })
    // return this.filterMoves(thisMoves, board);
    return thisMoves;
  }

  filterMoves(moveList, board) {
    const legalMoves = [];
    moveList.forEach((move) => {
      if (move.type === "attack" && move.toTile.getPiece().type === "king") {
        return;
      }
      move.makeMove(board);
      const playerKing = board.pieces.find((p) => p.type === "king" && p.color === this.color);
      if (attacksOnTile(board, board.getTile(playerKing.x, playerKing.y), this.color) === 0) {
        legalMoves.push(move);
      }
      // BUG: unmakeMove is not working properly
      move.unmakeMove(board);
    });
    return legalMoves;
  }

  updateInCheck(board) {
    return (
      attacksOnTile(board, board.getTile(this.king.x, this.king.y), this.color) != 0
    );
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
}
