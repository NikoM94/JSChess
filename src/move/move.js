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

    this.pieceMoved.x = tileFrom.x;
    this.pieceMoved.y = tileFrom.y;

    tileFrom.setPiece(this.pieceMoved);
    if (this.type !== "attack") {
      tileTo.setPiece(new Piece("none", "", "", tileTo.x, tileTo.y));
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
    let tileFrom = board.tiles[this.fromTile.x][this.fromTile.y];
    tileFrom = new Piece("none", "", "", tileFrom.x, tileFrom.y);
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
    tileFrom.setPiece(new Piece("none", "", "", tileFrom.x, tileFrom.y));
  }

  unmakeMove(board) {
    super.unmakeMove(board);
    let tileTo = board.getTile(this.toTile.x, this.toTile.y);
    this.pieceCaptured.x = this.toTile.x;
    this.pieceCaptured.y = this.toTile.y;
    const newPiece = new Piece(
      this.pieceCaptured.type,
      this.pieceCaptured.color,
      "",
      this.pieceCaptured.x,
      this.pieceCaptured.y,
    );
    board.pieces.push(newPiece);
    tileTo.setPiece(newPiece);
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
