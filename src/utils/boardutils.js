import { FILES_WHITE, RANKS_WHITE, FEN_TYPES } from "../board/constants.js";
import { Piece } from "../piece/piece.js";
import { Tile } from "../board/tile.js";
import {
  NormalMove,
  AttackMove,
  DoubleStep,
  EnPassantMove,
  PromotionMove,
  CastleMove,
} from "../move/move.js";

export function xyToChessCoordinate(x, y) {
  return FILES_WHITE[y] + RANKS_WHITE[x];
}

export function validCoordinate(x, y) {
  return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}

export function chessCoordinateToXY(coordinate) {
  const file = coordinate.charAt(0);
  const rank = coordinate.charAt(1);
  const y = FILES_WHITE.indexOf(file);
  const x = RANKS_WHITE.indexOf(rank);
  return { x, y };
}

export function attacksOnTile(board, tile, color, options = {}) {
  let attacks = 0;
  // Recalculate moves for all pieces to get accurate attacks based on current board state
  board.pieces.forEach((p) => {
    // Save the original moves to restore after checking
    if (p.color === color) return;
    const originalMoves = p.moves;
    p.calculateMoves(board, options);
    p.moves.forEach((move) => {
      if (move.toTile.x === tile.x && move.toTile.y === tile.y) {
        attacks++;
      }
    });
    // Restore original moves to avoid side effects
    p.moves = originalMoves;
  });
  return attacks;
}

export function loadFromFEN(board, fen) {
  board.pieces = [];
  board.tiles = [];
  for (let x = 0; x < 8; x++) {
    const row = [];
    for (let y = 0; y < 8; y++) {
      row.push(createEmptyTile(x, y));
    }
    board.tiles.push(row);
  }
  const splits = fen.split(" ");
  const [rows, meta] = [splits[0].split("/"), splits.slice(1)];
  for (let row of rows) {
    for (let char of row) {
      if (validateChar(char)) {
        const color = char === char.toUpperCase() ? "white" : "black";
        const type = FEN_TYPES[char.toLowerCase()];
        const x = rows.indexOf(row);
        const y = row.indexOf(char);
        const newPiece = createPieceFromFENChar(char, x, y);
        board.tiles[x][y].setPiece(newPiece);
        board.pieces.push(newPiece);
        //todo
      } else if (!isNaN(char)) {
        const emptyCount = parseInt(char);
        const x = rows.indexOf(row);
        const startY = row.indexOf(char);

      } else {
        throw new Error(`Invalid FEN character: ${char}`);
      }
    }
  }
}

function boardToFEN(board) {
  let fen = "";
  for (let x = 0; x < 8; x++) {
    let emptyCount = 0;
    for (let y = 0; y < 8; y++) {
      const piece = board.tiles[x][y].piece;
      if (piece.type === "none") {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount.toString();
          emptyCount = 0;
        }
        const fenChar = getFENCharFromPiece(piece);
        fen += fenChar;
      }
    }
    if (emptyCount > 0) {
      fen += emptyCount.toString();
    }
    if (x < 7) {
      fen += "/";
    }
  }
  return fen;
}

export function validateChar(char) {
  return /[prnbqkPRNBQK]/.test(char);
}

export function createPieceFromFENChar(char, x, y) {
  const color = char === char.toUpperCase() ? "white" : "black";
  const type = FEN_TYPES[char.toLowerCase()];
  const imageSrc = `../../assets/${color}_${type}.svg`;
  return new Piece(type, color, imageSrc, x, y);
}

export function createEmptyTile(x, y) {
  return new Tile(
    x,
    y,
    (x + y + 2) % 2 === 0 ? "#E0D5EA" : "#957AB0",
    new Piece("none", "none", "", x, y),
  );
}

/**
 * Creates a deep copy of the board state for move validation.
 * This creates new Piece and Tile objects to avoid mutating the original board.
 * @param {Object} board - The original board to copy
 * @returns {Object} A copy of the board with new pieces and tiles
 */
export function copyBoard(board) {
  const copiedBoard = {
    tiles: [],
    pieces: [],
    enPassantPawn: null,
    // Copy currentPlayer state for move validation (castling rights, etc.)
    currentPlayer: board.currentPlayer ? {
      canCastleKingSide: board.currentPlayer.canCastleKingSide,
      canCastleQueenSide: board.currentPlayer.canCastleQueenSide,
      color: board.currentPlayer.color
    } : null,
    getTile(x, y) {
      return validCoordinate(x, y) ? this.tiles[x][y] : null;
    }
  };

  // Create a map to track original piece -> copied piece
  const pieceMap = new Map();

  // First pass: create all tiles with empty pieces
  for (let x = 0; x < 8; x++) {
    const row = [];
    for (let y = 0; y < 8; y++) {
      row.push(createEmptyTile(x, y));
    }
    copiedBoard.tiles.push(row);
  }

  // Second pass: copy pieces and place them on tiles
  for (const originalPiece of board.pieces) {
    const copiedPiece = new Piece(
      originalPiece.type,
      originalPiece.color,
      originalPiece.imageSrc,
      originalPiece.x,
      originalPiece.y
    );
    copiedPiece.isFirstMove = originalPiece.isFirstMove;
    copiedPiece.moves = []; // Fresh moves array - will be recalculated

    pieceMap.set(originalPiece, copiedPiece);
    copiedBoard.pieces.push(copiedPiece);
    copiedBoard.tiles[copiedPiece.x][copiedPiece.y].setPiece(copiedPiece);
  }

  // Copy en passant pawn reference if it exists
  if (board.enPassantPawn) {
    copiedBoard.enPassantPawn = pieceMap.get(board.enPassantPawn) || null;
  }

  return { copiedBoard, pieceMap };
}

/**
 * Creates a copy of a move that works with the copied board.
 * This remaps piece and tile references from the original board to the copied board.
 * @param {Move} move - The original move to copy
 * @param {Object} copiedBoard - The copied board
 * @param {Map} pieceMap - Map from original pieces to copied pieces
 * @returns {Move} A new move that references the copied board's pieces and tiles
 */
export function copyMoveForBoard(move, copiedBoard, pieceMap) {
  const copiedPieceMoved = pieceMap.get(move.pieceMoved);
  const copiedFromTile = copiedBoard.getTile(move.fromTile.x, move.fromTile.y);
  const copiedToTile = copiedBoard.getTile(move.toTile.x, move.toTile.y);

  switch (move.type) {
    case "normal":
      return new NormalMove(copiedPieceMoved, copiedFromTile, copiedToTile);

    case "doubleStep":
      return new DoubleStep(copiedPieceMoved, copiedFromTile, copiedToTile);

    case "attack": {
      const copiedPieceCaptured = pieceMap.get(move.pieceCaptured);
      return new AttackMove(copiedPieceMoved, copiedFromTile, copiedToTile, copiedPieceCaptured);
    }

    case "enPassant": {
      const copiedPieceCaptured = pieceMap.get(move.pieceCaptured);
      return new EnPassantMove(copiedPieceMoved, copiedFromTile, copiedToTile, copiedPieceCaptured);
    }

    case "promotion": {
      const copiedPieceCaptured = move.pieceCaptured ? pieceMap.get(move.pieceCaptured) : null;
      return new PromotionMove(copiedPieceMoved, copiedFromTile, copiedToTile, copiedPieceCaptured);
    }

    case "castle": {
      const copiedRookFrom = copiedBoard.getTile(move.castleRookFrom.x, move.castleRookFrom.y);
      const copiedRookTo = copiedBoard.getTile(move.castleRookTo.x, move.castleRookTo.y);
      const copiedRook = pieceMap.get(move.rook);
      return new CastleMove(
        copiedPieceMoved,
        copiedFromTile,
        copiedToTile,
        copiedRookFrom,
        copiedRookTo,
        copiedRook
      );
    }

    default:
      throw new Error(`Unknown move type: ${move.type}`);
  }
}
