class Move {
  constructor(pieceMoved, fromTile, toTile) {
    this.pieceMoved = pieceMoved;
    this.fromTile = fromTile;
    this.toTile = toTile;
  }

  makeMove() {
    this.toTile.piece = this.pieceMoved;
    this.fromTile.piece.type = "none";
    this.pieceMoved.isFirstMove = false;
  }
}

class NormalMove extends Move {
  constructor(pieceMoved, fromTile, toTile) {
    super(pieceMoved, fromTile, toTile);
    this.type = "normal";
  }

  makeMove() {
    super.makeMove();
  }
}

class AttackMove extends Move {
  constructor(pieceMoved, fromTile, toTile, pieceCaptured) {
    super(pieceMoved, fromTile, toTile);
    this.pieceCaptured = pieceCaptured;
    this.type = "attack";
  }

  makeMove() {
    super.makeMove();
    return this.pieceCaptured;
  }
}

class EnPassantMove extends Move {
  constructor(pieceMoved, fromTile, toTile, pieceCaptured) {
    super(pieceMoved, fromTile, toTile);
    this.pieceCaptured = pieceCaptured;
    this.type = "en_passant";
  }

  makeMove() {
    super.makeMove();
    return this.pieceCaptured;
  }
}

class PromotionMove extends Move {
  constructor(pieceMoved, fromTile, toTile, promoteTo) {
    super(pieceMoved, toTile, fromTile);
    this.promoteTo = promoteTo; //handle this dynamically later
    this.type = "promotion";
  }
}

class CastleMove extends Move {
  constructor(pieceMoved, fromTile, toTile, castleRookFrom, castleRookTo) {
    super(pieceMoved, toTile, fromTile);
    this.castleRookFrom = castleRookFrom;
    this.castleRookTo = castleRookTo;
    this.type = "castle";
  }
}
