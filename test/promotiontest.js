import { Tile } from "../src/board/tile.js";
import { Piece } from "../src/piece/piece.js";
import { PromotionMove, NormalMove, AttackMove } from "../src/move/move.js";
import { COLORS } from "../src/board/constants.js";
import { createEmptyTile, createPieceFromFENChar } from "../src/utils/boardutils.js";
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

describe("PromotionMove", function () {
  describe("#makeMove and #unmakeMove", function () {
    it("should properly restore the pawn after unmaking a promotion move", function () {
      const board = createTestBoard();

      // Place a white pawn on row 1 (one step from promotion)
      const pawn = new Piece("pawn", "white", "../../assets/white_pawn.svg", 1, 3);
      board.tiles[1][3].setPiece(pawn);
      board.pieces.push(pawn);

      const fromTile = board.getTile(1, 3);
      const toTile = board.getTile(0, 3);

      const promotionMove = new PromotionMove(pawn, fromTile, toTile, null);

      // Count pieces before making move
      const pieceCountBefore = board.pieces.length;

      // Make the promotion move
      promotionMove.makeMove(board);

      // Verify promotion happened
      assert.strictEqual(board.pieces.length, pieceCountBefore, "Piece count should stay the same (pawn removed, queen added)");
      assert.ok(!board.pieces.includes(pawn), "Original pawn should be removed from pieces");
      const promotedQueen = board.getTile(0, 3).getPiece();
      assert.strictEqual(promotedQueen.type, "queen", "Tile should have a queen");
      assert.strictEqual(promotedQueen.color, "white", "Queen should be white");

      // Unmake the move
      promotionMove.unmakeMove(board);

      // Verify the pawn is restored
      assert.ok(board.pieces.includes(pawn), "Original pawn should be back in pieces array");
      assert.ok(!board.pieces.includes(promotedQueen), "Promoted queen should be removed from pieces array");
      const restoredPawn = board.getTile(1, 3).getPiece();
      assert.strictEqual(restoredPawn.type, "pawn", "Original tile should have pawn back");
      assert.strictEqual(restoredPawn.color, "white", "Pawn should be white");
      assert.strictEqual(restoredPawn.x, 1, "Pawn x should be restored");
      assert.strictEqual(restoredPawn.y, 3, "Pawn y should be restored");
      assert.strictEqual(board.pieces.length, pieceCountBefore, "Piece count should be restored");

      // Verify destination tile is empty
      const destTile = board.getTile(0, 3);
      assert.ok(destTile.isEmpty(), "Destination tile should be empty after unmake");
    });

    it("should properly restore captured piece after unmaking a promotion capture move", function () {
      const board = createTestBoard();

      // Place a white pawn on row 1 (one step from promotion)
      const pawn = new Piece("pawn", "white", "../../assets/white_pawn.svg", 1, 3);
      board.tiles[1][3].setPiece(pawn);
      board.pieces.push(pawn);

      // Place a black rook to be captured
      const rook = new Piece("rook", "black", "../../assets/black_rook.svg", 0, 4);
      board.tiles[0][4].setPiece(rook);
      board.pieces.push(rook);

      const fromTile = board.getTile(1, 3);
      const toTile = board.getTile(0, 4);

      const promotionMove = new PromotionMove(pawn, fromTile, toTile, rook);

      // Count pieces before making move
      const pieceCountBefore = board.pieces.length;

      // Make the promotion move (capture + promote)
      promotionMove.makeMove(board);

      // Verify promotion happened and piece was captured
      assert.strictEqual(board.pieces.length, pieceCountBefore - 1, "Piece count should decrease by 1 (pawn removed, rook removed, queen added)");
      assert.ok(!board.pieces.includes(pawn), "Original pawn should be removed");
      assert.ok(!board.pieces.includes(rook), "Rook should be captured");
      const promotedQueen = board.getTile(0, 4).getPiece();
      assert.strictEqual(promotedQueen.type, "queen", "Tile should have a queen");

      // Unmake the move
      promotionMove.unmakeMove(board);

      // Verify both pieces are restored
      assert.ok(board.pieces.includes(pawn), "Original pawn should be back in pieces array");
      assert.ok(board.pieces.includes(rook), "Captured rook should be back in pieces array");
      assert.strictEqual(board.pieces.length, pieceCountBefore, "Piece count should be restored");

      const restoredPawn = board.getTile(1, 3).getPiece();
      assert.strictEqual(restoredPawn.type, "pawn", "Original tile should have pawn back");

      const restoredRook = board.getTile(0, 4).getPiece();
      assert.strictEqual(restoredRook.type, "rook", "Rook should be restored to its tile");
    });
  });
});

describe("Pawn Attack Moves", function () {
  describe("#calculatePawnMoves", function () {
    it("should generate right capture moves independently of left captures", function () {
      const board = createTestBoard();

      // Place a white pawn in the middle
      const pawn = new Piece("pawn", "white", "../../assets/white_pawn.svg", 4, 4);
      board.tiles[4][4].setPiece(pawn);
      board.pieces.push(pawn);

      // Place only a black piece to the right (no piece on left)
      const blackPawn = new Piece("pawn", "black", "../../assets/black_pawn.svg", 3, 5);
      board.tiles[3][5].setPiece(blackPawn);
      board.pieces.push(blackPawn);

      pawn.calculateMoves(board);

      // Should have: 1 normal move forward, 1 attack move to right (diagonal)
      const attackMoves = pawn.moves.filter(m => m.type === "attack");
      assert.strictEqual(attackMoves.length, 1, "Should have 1 attack move (right capture only)");
      assert.strictEqual(attackMoves[0].toTile.x, 3, "Attack should go to row 3");
      assert.strictEqual(attackMoves[0].toTile.y, 5, "Attack should go to column 5");
    });

    it("should generate left capture moves independently of right captures", function () {
      const board = createTestBoard();

      // Place a white pawn in the middle
      const pawn = new Piece("pawn", "white", "../../assets/white_pawn.svg", 4, 4);
      board.tiles[4][4].setPiece(pawn);
      board.pieces.push(pawn);

      // Place only a black piece to the left (no piece on right)
      const blackPawn = new Piece("pawn", "black", "../../assets/black_pawn.svg", 3, 3);
      board.tiles[3][3].setPiece(blackPawn);
      board.pieces.push(blackPawn);

      pawn.calculateMoves(board);

      // Should have: 1 normal move forward, 1 attack move to left (diagonal)
      const attackMoves = pawn.moves.filter(m => m.type === "attack");
      assert.strictEqual(attackMoves.length, 1, "Should have 1 attack move (left capture only)");
      assert.strictEqual(attackMoves[0].toTile.x, 3, "Attack should go to row 3");
      assert.strictEqual(attackMoves[0].toTile.y, 3, "Attack should go to column 3");
    });

    it("should generate both left and right capture moves when available", function () {
      const board = createTestBoard();

      // Place a white pawn in the middle
      const pawn = new Piece("pawn", "white", "../../assets/white_pawn.svg", 4, 4);
      board.tiles[4][4].setPiece(pawn);
      board.pieces.push(pawn);

      // Place black pieces on both sides
      const blackPawnLeft = new Piece("pawn", "black", "../../assets/black_pawn.svg", 3, 3);
      board.tiles[3][3].setPiece(blackPawnLeft);
      board.pieces.push(blackPawnLeft);

      const blackPawnRight = new Piece("pawn", "black", "../../assets/black_pawn.svg", 3, 5);
      board.tiles[3][5].setPiece(blackPawnRight);
      board.pieces.push(blackPawnRight);

      pawn.calculateMoves(board);

      // Should have: 1 normal move forward, 2 attack moves (left and right diagonal)
      const attackMoves = pawn.moves.filter(m => m.type === "attack");
      assert.strictEqual(attackMoves.length, 2, "Should have 2 attack moves (both captures)");
    });

    it("should generate capture moves even when forward movement is blocked", function () {
      const board = createTestBoard();

      // Place a white pawn in the middle
      const pawn = new Piece("pawn", "white", "../../assets/white_pawn.svg", 4, 4);
      board.tiles[4][4].setPiece(pawn);
      board.pieces.push(pawn);

      // Block forward movement with another piece
      const blockingPiece = new Piece("pawn", "white", "../../assets/white_pawn.svg", 3, 4);
      board.tiles[3][4].setPiece(blockingPiece);
      board.pieces.push(blockingPiece);

      // Place black pieces on both sides
      const blackPawnLeft = new Piece("pawn", "black", "../../assets/black_pawn.svg", 3, 3);
      board.tiles[3][3].setPiece(blackPawnLeft);
      board.pieces.push(blackPawnLeft);

      const blackPawnRight = new Piece("pawn", "black", "../../assets/black_pawn.svg", 3, 5);
      board.tiles[3][5].setPiece(blackPawnRight);
      board.pieces.push(blackPawnRight);

      pawn.calculateMoves(board);

      // Should have no normal moves (blocked) but 2 attack moves
      const normalMoves = pawn.moves.filter(m => m.type === "normal" || m.type === "doubleStep");
      const attackMoves = pawn.moves.filter(m => m.type === "attack");

      assert.strictEqual(normalMoves.length, 0, "Should have no normal moves (blocked)");
      assert.strictEqual(attackMoves.length, 2, "Should have 2 attack moves even when blocked");
    });
  });
});
