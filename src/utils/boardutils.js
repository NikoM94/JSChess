import { FILES_WHITE, RANKS_WHITE, FEN_TYPES } from "../board/constants.js";
import { Piece } from "../piece/piece.js";
import { Tile } from "../board/tile.js";

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
