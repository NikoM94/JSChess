import { Piece } from "../src/piece/piece.js";
import { NormalMove, AttackMove } from "../src/move/move.js";
import { createEmptyTile } from "../src/utils/boardutils.js";
import { copyBoard, findCopiedMove } from "../src/board/boardfactory.js";
import { Player } from "../src/player/player.js";
import assert from "assert";

// Mock document for tests
global.document = {
  createElement: () => ({
    classList: { add: () => {} },
    dataset: {},
    setAttribute: () => {},
    style: {}
  })
};

// Helper to create a minimal board structure for testing
function createTestBoard() {
  const tiles = [];
  const pieces = [];
  for (let x = 0; x < 8; x++) {
    const row = [];
    for (let y = 0; y < 8; y++) {
      row.push(createEmptyTile(x, y));
    }
    tiles.push(row);
  }
  return {
    tiles,
    pieces,
    moves: [],
    enPassantPawn: null,
    currentPlayer: {
      canCastleKingSide: true,
      canCastleQueenSide: true,
      color: "white"
    },
    getTile(x, y) {
      return this.tiles[x][y];
    }
  };
}

describe("copyBoard", function () {
  it("should create a deep copy of the board with new piece objects", function () {
    const board = createTestBoard();

    // Add a piece
    const piece = new Piece("pawn", "white", "../../assets/white_pawn.svg", 4, 4);
    board.tiles[4][4].setPiece(piece);
    board.pieces.push(piece);

    const { copiedBoard, pieceMap } = copyBoard(board);

    // Verify pieces are different objects
    assert.strictEqual(copiedBoard.pieces.length, 1, "Copied board should have 1 piece");
    assert.notStrictEqual(copiedBoard.pieces[0], piece, "Copied piece should be a different object");
    
    // Verify piece properties are the same
    assert.strictEqual(copiedBoard.pieces[0].type, piece.type);
    assert.strictEqual(copiedBoard.pieces[0].color, piece.color);
    assert.strictEqual(copiedBoard.pieces[0].x, piece.x);
    assert.strictEqual(copiedBoard.pieces[0].y, piece.y);

    // Verify pieceMap works correctly
    assert.strictEqual(pieceMap.get(piece), copiedBoard.pieces[0]);
  });

  it("should create independent tiles that don't affect original", function () {
    const board = createTestBoard();

    // Add a piece
    const piece = new Piece("pawn", "white", "../../assets/white_pawn.svg", 4, 4);
    board.tiles[4][4].setPiece(piece);
    board.pieces.push(piece);

    const { copiedBoard, pieceMap } = copyBoard(board);

    // Modify the copied board
    const copiedPiece = pieceMap.get(piece);
    copiedPiece.x = 3;
    copiedPiece.y = 4;
    copiedBoard.tiles[3][4].setPiece(copiedPiece);
    copiedBoard.tiles[4][4].setPiece(new Piece("none", "none", "", 4, 4));

    // Verify original board is unchanged
    assert.strictEqual(piece.x, 4, "Original piece x should be unchanged");
    assert.strictEqual(piece.y, 4, "Original piece y should be unchanged");
    assert.strictEqual(board.tiles[4][4].getPiece().type, "pawn", "Original tile should still have pawn");
  });
});

describe("findCopiedMove", function () {
  it("should find matching move in copied board by fromTile, toTile, and type", function () {
    const board = createTestBoard();

    // Add a pawn piece
    const piece = new Piece("pawn", "white", "../../assets/white_pawn.svg", 4, 4);
    board.tiles[4][4].setPiece(piece);
    board.pieces.push(piece);

    // Calculate moves for the board
    board.moves = [];
    for (const p of board.pieces) {
      p.calculateMoves(board);
      board.moves.push(...p.moves);
    }

    // Get an original move
    const originalMove = board.moves.find(m => m.pieceMoved === piece && m.type === "normal");
    assert.ok(originalMove, "Should have a normal move");

    const { copiedBoard, pieceMap } = copyBoard(board);
    const copiedMove = findCopiedMove(originalMove, copiedBoard);

    // Verify the copied move was found and references the copied board's objects
    assert.ok(copiedMove, "Should find the copied move");
    assert.notStrictEqual(copiedMove.pieceMoved, piece, "Copied move should use copied piece");
    assert.strictEqual(copiedMove.pieceMoved, pieceMap.get(piece), "Copied move should use mapped piece");
    assert.strictEqual(copiedMove.fromTile, copiedBoard.getTile(4, 4), "Copied move should use copied fromTile");
    assert.strictEqual(copiedMove.toTile.x, originalMove.toTile.x, "Copied move should have same toTile x");
    assert.strictEqual(copiedMove.toTile.y, originalMove.toTile.y, "Copied move should have same toTile y");
  });
});

describe("filterMovesImproved", function () {
  it("should allow legal moves when king is not exposed", function () {
    // Test that a move NOT exposing the king is allowed
    const board = createTestBoard();

    const king = new Piece("king", "white", "../../assets/white_king.svg", 7, 4);
    board.tiles[7][4].setPiece(king);
    board.pieces.push(king);

    const pawn = new Piece("pawn", "white", "../../assets/white_pawn.svg", 6, 3);
    board.tiles[6][3].setPiece(pawn);
    board.pieces.push(pawn);

    // Calculate all moves
    board.moves = [];
    for (const p of board.pieces) {
      p.calculateMoves(board);
      board.moves.push(...p.moves);
    }

    // Create a mock player
    const mockPlayer = {
      color: "white",
      king: king,
      filterMovesImproved: Player.prototype.filterMovesImproved
    };

    const pawnMoves = board.moves.filter(m => m.pieceMoved === pawn);
    const legalMoves = mockPlayer.filterMovesImproved(pawnMoves, board);

    // Pawn should have legal moves (no piece attacking king after move)
    assert.ok(legalMoves.length > 0, "Pawn should have legal moves when king is safe");
  });

  it("should not mutate the original board when checking moves", function () {
    const board = createTestBoard();

    const king = new Piece("king", "white", "../../assets/white_king.svg", 7, 4);
    board.tiles[7][4].setPiece(king);
    board.pieces.push(king);

    const pawn = new Piece("pawn", "white", "../../assets/white_pawn.svg", 6, 4);
    board.tiles[6][4].setPiece(pawn);
    board.pieces.push(pawn);

    // Calculate moves
    board.moves = [];
    for (const p of board.pieces) {
      p.calculateMoves(board);
      board.moves.push(...p.moves);
    }

    const originalPawnX = pawn.x;
    const originalPawnY = pawn.y;
    const originalTilePiece = board.tiles[6][4].getPiece();

    // Create a mock player
    const mockPlayer = {
      color: "white",
      king: king,
      filterMovesImproved: Player.prototype.filterMovesImproved
    };

    const pawnMoves = board.moves.filter(m => m.pieceMoved === pawn);
    mockPlayer.filterMovesImproved(pawnMoves, board);

    // Verify original board is unchanged
    assert.strictEqual(pawn.x, originalPawnX, "Pawn x should be unchanged");
    assert.strictEqual(pawn.y, originalPawnY, "Pawn y should be unchanged");
    assert.strictEqual(board.tiles[6][4].getPiece(), originalTilePiece, "Original tile should still have the same piece");
    assert.strictEqual(board.tiles[6][4].getPiece().type, "pawn", "Original tile should still have pawn");
  });

  it("should correctly filter moves that expose king to attack", function () {
    const board = createTestBoard();

    // Setup: White king at h1 (7, 7), white bishop at g2 (6, 6) blocking diagonal
    // Black bishop at a8 (0, 0) attacking diagonally
    // Moving white bishop should be illegal as it exposes king

    const whiteKing = new Piece("king", "white", "../../assets/white_king.svg", 7, 7);
    board.tiles[7][7].setPiece(whiteKing);
    board.pieces.push(whiteKing);

    const whiteBishop = new Piece("bishop", "white", "../../assets/white_bishop.svg", 6, 6);
    board.tiles[6][6].setPiece(whiteBishop);
    board.pieces.push(whiteBishop);

    const blackBishop = new Piece("bishop", "black", "../../assets/black_bishop.svg", 0, 0);
    board.tiles[0][0].setPiece(blackBishop);
    board.pieces.push(blackBishop);

    // Calculate moves
    board.moves = [];
    for (const p of board.pieces) {
      p.calculateMoves(board);
      board.moves.push(...p.moves);
    }

    const mockPlayer = {
      color: "white",
      king: whiteKing,
      filterMovesImproved: Player.prototype.filterMovesImproved
    };

    // Get all white bishop moves (that move off the diagonal)
    const bishopMoves = board.moves.filter(m => m.pieceMoved === whiteBishop);
    const legalMoves = mockPlayer.filterMovesImproved(bishopMoves, board);

    // Only moves that keep the bishop on the a8-h1 diagonal should be legal
    // These are moves to (5,5), (4,4), (3,3), (2,2), (1,1) and capturing (0,0)
    for (const move of legalMoves) {
      const onDiagonal = move.toTile.x === move.toTile.y;
      assert.ok(onDiagonal, `Legal move should stay on diagonal: (${move.toTile.x}, ${move.toTile.y})`);
    }
  });
});
