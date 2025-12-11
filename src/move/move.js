class Move {
  constructor(pieceMoved, fromTile, toTile) {
    this.pieceMoved = pieceMoved;
    this.fromTile = fromTile;
    this.toTile = toTile;
  }
}

class NormalMove extends Move {
  constructor(pieceMoved, fromTile, toTile) {
    super(pieceMoved, fromTile, toTile);
  }
}

class AttackMove extends Move {
  constructor(pieceMoved, fromTile, toTile, pieceCaptured) {
    super(pieceMoved, fromTile, toTile);
    this.pieceCaptured = pieceCaptured;
  }
}

class PromotionMove extends Move {
  constructor(pieceMoved, fromTile, toTile, promoteTo) {
    super(pieceMoved, toTile, fromTile);
    this.promoteTo = promoteTo; //handle this dynamically later
  }
}
