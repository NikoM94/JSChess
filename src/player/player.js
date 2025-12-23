import { attacksOnTile } from "../utils/boardutils.js";
import { CastleMove } from "../move/move.js";
import { copyBoard } from "../board/boardfactory.js";

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
    this.king = this.pieces.find(
      (piece) => piece.type === "king" && piece.color === this.color,
    );
    this.isInCheck = this.updateInCheck(board);
    this.isInCheckMate = this.updateInCheckMate();
    this.moves = this.updateMoves(board);
    this.calculateCastleMoves(board);
  }

  updateMoves(board) {
    let thisMoves = board.moves.filter((m) => {
      return m.pieceMoved.color === this.color;
    });
    console.log(this.filterMovesImproved(thisMoves, board));
    console.log(this.filterMoves(thisMoves, board));
    return this.filterMoves(thisMoves, board);
  }

  filterMovesImproved(moveList, board) {
    const legalMoves = [];
    for (const move of moveList) {
      if (move.type === "attack" && move.pieceCaptured.type === "king") {
        continue;
      }
      let bCopy = copyBoard(board);
      console.log(bCopy.whitePlayer.moves);
      console.log(moveList);

      let copiedMove = bCopy.moves.find(
        (copyMove) =>
          move.fromTile.x === copyMove.fromTile.x &&
          move.fromTile.y === copyMove.fromTile.y,
      );
      console.log(copiedMove);
      copiedMove.makeMove(bCopy);
      bCopy.logger.printBoard(bCopy);
      const currentKingTile =
        bCopy.currentTurn === "white"
          ? bCopy.getTile(bCopy.whitePlayer.king.x, bCopy.whitePlayer.king.y)
          : bCopy.getTile(bCopy.blackPlayer.king.x, bCopy.blackPlayer.king.y);
      const noAttacksOnKing = attacksOnTile(
        bCopy,
        currentKingTile,
        bCopy.currentTurn,
      );
      if (noAttacksOnKing) {
        legalMoves.push(move);
      }
    }
    return legalMoves;
  }

  filterMoves(moveList, board) {
    const legalMoves = [];
    for (const move of moveList) {
      if (move.type === "attack" && move.pieceCaptured.type === "king") {
        continue;
      }
      move.makeMove(board);
      const currentKingTile = board.tiles[this.king.x][this.king.y];
      const noAttacksOnKing =
        attacksOnTile(board, currentKingTile, this.color) == 0;
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

  calculateCastleMoves(board) {
    const moves = [];

    if (!this.canCastleKingSide && !this.canCastleQueenSide) {
      return;
    }

    if (this.isInCheck) {
      return;
    }

    let x = this.color === "white" ? 7 : 0;

    if (this.canCastleQueenSide) {
      var canCastleQueen = true;
      for (let y = 3; y > 0; y--) {
        const tile = board.getTile(x, y);
        if (!tile.isEmpty() || attacksOnTile(board, tile, this.color) > 0) {
          canCastleQueen = false;
        }
      }
    }

    if (this.canCastleKingSide) {
      var canCastleKing = true;
      for (let y = 5; y < 7; y++) {
        const tile = board.getTile(x, y);
        if (!tile.isEmpty() || attacksOnTile(board, tile, this.color) > 0) {
          canCastleKing = false;
        }
      }
    }
    if (canCastleKing) {
      let x = this.color === "white" ? 7 : 0;
      const king = this.king;
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

    if (canCastleQueen) {
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
