import { Piece } from "../piece/piece.js";
class Move {
  constructor(pieceMoved, fromTile, toTile) {
    this.pieceMoved = pieceMoved;
    this.fromTile = fromTile;
    this.toTile = toTile;
  }

  makeMove(board) {
    let tileFrom = board.tiles[this.fromTile.x][this.fromTile.y];
    let tileTo = board.tiles[this.toTile.x][this.toTile.y];

    // Store the original isFirstMove state to restore later
    this.wasFirstMove = this.pieceMoved.isFirstMove;
    this.pieceMoved.isFirstMove = false;
    this.pieceMoved.x = tileTo.x;
    this.pieceMoved.y = tileTo.y;

    tileTo.setPiece(this.pieceMoved);
    tileFrom.setPiece(new Piece("none", "none", "", tileFrom.x, tileFrom.y));
  }

  unmakeMove(board) {
    let tileFrom = board.getTile(this.fromTile.x, this.fromTile.y);
    let tileTo = board.getTile(this.toTile.x, this.toTile.y);

    // Restore the piece's position
    this.pieceMoved.x = tileFrom.x;
    this.pieceMoved.y = tileFrom.y;

    // Restore the isFirstMove state
    this.pieceMoved.isFirstMove = this.wasFirstMove;

    tileFrom.setPiece(this.pieceMoved);
    if (this.type !== "attack" && this.type !== "enPassant") {
      tileTo.setPiece(new Piece("none", "none", "", tileTo.x, tileTo.y));
    }
  }
}

export class NormalMove extends Move {
  constructor(pieceMoved, fromTile, toTile) {
    super(pieceMoved, fromTile, toTile);
    this.type = "normal";
  }

  makeMove(board) {
    super.makeMove(board);
  }

  unmakeMove(board) {
    super.unmakeMove(board);
  }
}

export class DoubleStep extends Move {
  constructor(pieceMoved, fromTile, toTile) {
    super(pieceMoved, fromTile, toTile);
    this.type = "doubleStep";
  }

  makeMove(board) {
    super.makeMove(board);
  }

  unmakeMove(board) {
    super.unmakeMove(board);
  }
}

export class AttackMove extends Move {
  constructor(pieceMoved, fromTile, toTile, pieceCaptured) {
    super(pieceMoved, fromTile, toTile);
    this.pieceCaptured = pieceCaptured;
    this.type = "attack";
  }

  makeMove(board) {
    super.makeMove(board);
    board.pieces = board.pieces.filter((piece) => piece !== this.pieceCaptured);
  }

  unmakeMove(board) {
    super.unmakeMove(board);
    let tileTo = board.getTile(this.toTile.x, this.toTile.y);

    board.pieces.push(this.pieceCaptured);
    tileTo.setPiece(this.pieceCaptured);
  }
}

export class EnPassantMove extends Move {
  constructor(pieceMoved, fromTile, toTile, pieceCaptured) {
    super(pieceMoved, fromTile, toTile);
    this.pieceCaptured = pieceCaptured;
    this.type = "enPassant";
  }

  makeMove(board) {
    // Store the captured pawn's position before super.makeMove changes anything
    this.capturedPawnX = this.pieceCaptured.x;
    this.capturedPawnY = this.pieceCaptured.y;

    super.makeMove(board);
    board.pieces = board.pieces.filter((piece) => piece !== this.pieceCaptured);

    // Clear the tile where the captured pawn was (different from toTile in en passant)
    let capturedPawnTile = board.getTile(
      this.capturedPawnX,
      this.capturedPawnY,
    );
    capturedPawnTile.setPiece(
      new Piece("none", "none", "", this.capturedPawnX, this.capturedPawnY),
    );
  }

  unmakeMove(board) {
    super.unmakeMove(board);

    let tileTo = board.getTile(this.toTile.x, this.toTile.y);

    // Restore the captured pawn at its original position
    let enPassantCapturedTile = board.getTile(
      this.capturedPawnX,
      this.capturedPawnY,
    );

    board.pieces.push(this.pieceCaptured);
    enPassantCapturedTile.setPiece(this.pieceCaptured);
    tileTo.setPiece(new Piece("none", "none", "", tileTo.x, tileTo.y));
  }
}

export class PromotionMove extends Move {
  constructor(pieceMoved, fromTile, toTile, promoteTo) {
    super(pieceMoved, toTile, fromTile);
    this.promoteTo = promoteTo; //handle this dynamically later
    this.type = "promotion";
  }
}

export class CastleMove extends Move {
  constructor(pieceMoved, fromTile, toTile, castleRookFrom, castleRookTo) {
    super(pieceMoved, toTile, fromTile);
    this.castleRookFrom = castleRookFrom;
    this.castleRookTo = castleRookTo;
    this.type = "castle";
  }
}
