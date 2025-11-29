import { PIECES, COLORS } from "./constants";
class Piece {
  constructor(type, color) {
    this.type = PIECES[type];
    this.color = COLORS[color];
  }
}

export { Piece };
