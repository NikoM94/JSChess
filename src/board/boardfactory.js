import { Piece } from "../piece/piece.js";
import { Tile } from "../board/tile.js";
import { validCoordinate } from "../utils/boardutils.js";

/**
 * Creates a deep copy of the board state for move validation.
 * This creates new Piece and Tile objects to avoid mutating the original board.
 * 
 * Key fixes for stale references:
 * 1. Pieces array is rebuilt from tiles BEFORE calculating moves
 * 2. All pieces are copied with their current state (position, isFirstMove, etc.)
 * 3. EnPassant pawn is mapped to the copied piece, not the original
 * 4. Moves are recalculated fresh on the copied board
 * 
 * @param {Object} board - The original board to copy
 * @returns {Object} A copy of the board with new pieces, tiles, and fresh moves
 */
export function copyBoard(board) {
  const copiedBoard = {
    tiles: [],
    pieces: [],
    moves: [],
    enPassantPawn: null,
    currentTurn: board.currentTurn || null,
    currentPlayer: board.currentPlayer ? {
      canCastleKingSide: board.currentPlayer.canCastleKingSide,
      canCastleQueenSide: board.currentPlayer.canCastleQueenSide,
      color: board.currentPlayer.color
    } : null,
    getTile(x, y) {
      return validCoordinate(x, y) ? this.tiles[x][y] : null;
    }
  };

  // Map from original piece -> copied piece for reference mapping
  const pieceMap = new Map();

  // First pass: Create all tiles with copied pieces
  for (let x = 0; x < 8; x++) {
    const row = [];
    for (let y = 0; y < 8; y++) {
      const oldTile = board.tiles[x][y];
      const oldPiece = oldTile.piece;

      let newPiece;
      if (oldPiece && oldPiece.type !== "none") {
        newPiece = new Piece(
          oldPiece.type,
          oldPiece.color,
          oldPiece.imageSrc,
          oldPiece.x,
          oldPiece.y
        );
        newPiece.isFirstMove = oldPiece.isFirstMove;
        
        // Add to pieceMap and pieces array
        pieceMap.set(oldPiece, newPiece);
        copiedBoard.pieces.push(newPiece);
      } else {
        newPiece = new Piece("none", "none", "", x, y);
      }

      const newTile = new Tile(
        oldTile.x,
        oldTile.y,
        oldTile.color,
        newPiece
      );
      row.push(newTile);
    }
    copiedBoard.tiles.push(row);
  }

  // Copy en passant pawn reference - must be the COPIED piece, not the original
  if (board.enPassantPawn) {
    copiedBoard.enPassantPawn = pieceMap.get(board.enPassantPawn) || null;
  }

  // CRITICAL: Recalculate ALL moves AFTER pieces are in place
  // This ensures moves reference the copied board's pieces and tiles
  copiedBoard.moves = [];
  for (const piece of copiedBoard.pieces) {
    piece.calculateMoves(copiedBoard);
    copiedBoard.moves.push(...piece.moves);
  }

  return { copiedBoard, pieceMap };
}

/**
 * Finds a matching move in the copied board's move list.
 * Matches by fromTile AND toTile coordinates to uniquely identify the move.
 * 
 * @param {Move} originalMove - The move from the original board
 * @param {Object} copiedBoard - The copied board with recalculated moves
 * @returns {Move|null} The matching move from the copied board, or null if not found
 */
export function findCopiedMove(originalMove, copiedBoard) {
  return copiedBoard.moves.find(
    (copiedMove) =>
      originalMove.fromTile.x === copiedMove.fromTile.x &&
      originalMove.fromTile.y === copiedMove.fromTile.y &&
      originalMove.toTile.x === copiedMove.toTile.x &&
      originalMove.toTile.y === copiedMove.toTile.y &&
      originalMove.type === copiedMove.type
  ) || null;
}
