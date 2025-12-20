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

    tileTo.piece = this.pieceMoved;
    tileFrom.piece = new Piece(
      "none",
      "none",
      "",
      this.fromTile.x,
      this.fromTile.y,
    );
  }

  unmakeMove(board) {
    let tileFrom = board.getTile(this.fromTile.x, this.fromTile.y);
    let tileTo = board.getTile(this.toTile.x, this.toTile.y);

    // Restore the piece's position
    this.pieceMoved.x = tileFrom.x;
    this.pieceMoved.y = tileFrom.y;
    
    // Restore the isFirstMove state
    if (this.wasFirstMove !== undefined) {
      this.pieceMoved.isFirstMove = this.wasFirstMove;
    }

    tileFrom.setPiece(this.pieceMoved);
    if (this.type !== "attack") {
      tileTo.setPiece(new Piece("none", "none", "", tileTo.x, tileTo.y));
    }
  }
}

export class NormalMove extends Move {
  constructor(pieceMoved, fromTile, toTile, board) {
    super(pieceMoved, fromTile, toTile, board);
    this.type = "normal";
  }

  makeMove(board) {
    super.makeMove(board);
    // tileFrom is already set by parent class, no additional work needed
  }
}

export class AttackMove extends Move {
  constructor(pieceMoved, fromTile, toTile, pieceCaptured, board) {
    super(pieceMoved, fromTile, toTile, board);
    this.pieceCaptured = pieceCaptured;
    this.type = "attack";
  }

  makeMove(board) {
    super.makeMove(board);
    board.pieces = board.pieces.filter((piece) => piece !== this.pieceCaptured);
    let tileFrom = board.getTile(this.fromTile.x, this.fromTile.y);
    tileFrom.setPiece(new Piece("none", "none", "", tileFrom.x, tileFrom.y));
  }

  unmakeMove(board) {
    super.unmakeMove(board);
    let tileTo = board.getTile(this.toTile.x, this.toTile.y);
    
    // Restore the original captured piece position
    this.pieceCaptured.x = this.toTile.x;
    this.pieceCaptured.y = this.toTile.y;
    
    // Add the original piece back to the board (not a new instance)
    board.pieces.push(this.pieceCaptured);
    tileTo.setPiece(this.pieceCaptured);
  }
}

export class EnPassantMove extends Move {
  constructor(pieceMoved, fromTile, toTile, pieceCaptured, board) {
    super(pieceMoved, fromTile, toTile, board);
    this.pieceCaptured = pieceCaptured;
    this.type = "en_passant";
  }

  makeMove(board) {
    super.makeMove(board);
  }
}

export class PromotionMove extends Move {
  constructor(pieceMoved, fromTile, toTile, board, promoteTo) {
    super(pieceMoved, toTile, fromTile, board);
    this.promoteTo = promoteTo; //handle this dynamically later
    this.type = "promotion";
  }
}

export class CastleMove extends Move {
  constructor(
    pieceMoved,
    fromTile,
    toTile,
    board,
    castleRookFrom,
    castleRookTo,
  ) {
    super(pieceMoved, toTile, fromTile, board);
    this.castleRookFrom = castleRookFrom;
    this.castleRookTo = castleRookTo;
    this.type = "castle";
  }
}
