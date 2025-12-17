import { Piece } from "../piece/piece.js";
class Move {
  constructor(pieceMoved, fromTile, toTile, board) {
    this.pieceMoved = pieceMoved;
    this.fromTile = fromTile;
    this.toTile = toTile;
    this.board = board;
  }

  makeMove(board) {
    let tileFrom = board.getTile(this.fromTile.x, this.fromTile.y);
    let tileTo = board.getTile(this.toTile.x, this.toTile.y);

    this.pieceMoved.isFirstMove = false;
    this.pieceMoved.x = tileTo.x;
    this.pieceMoved.y = tileTo.y;

    tileTo.setPiece(this.pieceMoved);
    tileFrom.setPiece(new Piece("none", "", "", tileFrom.x, tileFrom.y));
  }

  unmakeMove(board) {
    let tileFrom = board.getTile(this.fromTile.x, this.fromTile.y);
    let tileTo = board.getTile(this.toTile.x, this.toTile.y);

    this.pieceMoved.x = tileFrom.x;
    this.pieceMoved.y = tileFrom.y;

    tileTo.setPiece(new Piece("none", "", "", tileTo.x, tileTo.y));
    tileFrom.setPiece(this.pieceMoved);
  }
}

export class NormalMove extends Move {
  constructor(pieceMoved, fromTile, toTile, board) {
    super(pieceMoved, fromTile, toTile, board);
    this.type = "normal";
  }

  makeMove(board) {
    super.makeMove(board);
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
    board.pieces = this.board.pieces.filter(
      (piece) => piece !== this.pieceCaptured,
    );
  }

<<<<<<< HEAD
  unmakeMove(board) {
    let tileFrom = board.getTile(this.fromTile.x, this.fromTile.y);
    let tileTo = board.getTile(this.toTile.x, this.toTile.y);

    this.pieceMoved.x = tileFrom.x;
    this.pieceMoved.y = tileFrom.y;

    tileTo.setPiece(this.pieceCaptured);
    tileFrom.setPiece(this.pieceMoved);
=======
  unmakeMove() {
    super.unmakeMove();
    this.board.pieces.push(this.pieceCaptured);
>>>>>>> 8111587 (fix unmakemove for attack moves)
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
