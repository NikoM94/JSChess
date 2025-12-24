import { attacksOnTile } from "../utils/boardutils.js";
import { copyBoard, findCopiedMove } from "../board/boardfactory.js";
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
    this.moves = this.updateMoves(board);
    this.isInCheckMate = this.updateInCheckMate();
    this.calculateCastleMoves(board);
  }

  updateMoves(board) {
    let thisMoves = board.moves.filter((m) => {
      return m.pieceMoved.color === this.color;
    });
    // return thisMoves;
    return this.filterMovesImproved(thisMoves, board);
  }

  filterMoves(moveList, board) {
    const legalMoves = [];
    for (const move of moveList) {
      if (move.type === "attack" && move.pieceCaptured.type === "king") {
        continue;
      }
      move.makeMove(board);
      const currentKingTile = board.tiles[this.king.x][this.king.y];
      const noAttacksOnKing = attacksOnTile(board, currentKingTile, this.color) == 0;
      if (noAttacksOnKing) {
        legalMoves.push(move);
      }
      move.unmakeMove(board);
    }
    return legalMoves;
  }

  /**
   * Improved version of filterMoves that uses a copied board to avoid mutating state.
   * This creates a deep copy of the board, finds the matching move in the copy,
   * executes the move on the copy, and checks for attacks on the king.
   *
   * Key fixes for stale references:
   * 1. copyBoard recalculates all moves AFTER pieces are placed
   * 2. findCopiedMove matches by fromTile, toTile, AND move type
   * 3. The copied board's move references the copied pieces/tiles
   *
   * @param {Array} moveList - List of moves to filter
   * @param {Object} board - The original board
   * @returns {Array} List of legal moves that don't leave the king in check
   */
  filterMovesImproved(moveList, board) {
    const legalMoves = [];

    for (const move of moveList) {
      // Skip moves that capture the king (these should never be valid)
      if (move.type === "attack" && move.pieceCaptured.type === "king") {
        continue;
      }

      // Create a fresh copy of the board for each move validation
      // The copy has fresh moves calculated that reference the copied pieces/tiles
      const { copiedBoard, pieceMap } = copyBoard(board);

      // Find the corresponding move in the copied board's move list
      // This move already references the copied board's pieces and tiles
      const copiedMove = findCopiedMove(move, copiedBoard);

      if (!copiedMove) {
        // Move not found in copied board - this shouldn't happen with valid moves
        continue;
      }

      // Execute the move on the copied board
      copiedMove.makeMove(copiedBoard);

      // Find the king on the copied board after the move
      const copiedKing = pieceMap.get(this.king);
      const kingTileOnCopy = copiedBoard.getTile(copiedKing.x, copiedKing.y);

      // Check if the king is under attack on the copied board
      const noAttacksOnKing = attacksOnTile(copiedBoard, kingTileOnCopy, this.color) === 0;

      if (noAttacksOnKing) {
        // If the move is legal, add the ORIGINAL move (not the copy) to the list
        legalMoves.push(move);
      }

      // No need to unmake the move - we're discarding the copied board
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
        )
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
        )
      );
    }
    this.moves.push(...moves);
  }
}
