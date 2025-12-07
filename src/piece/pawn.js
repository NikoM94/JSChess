class Pawn extends Piece {
  constructor(type, color, imageSrc = "", x, y) {
    super(type, color, imageSrc, x, y);
    this.moves = calculateMoves();
  }
}
