// basic_val.js

export const PIECES_VAL = {
  none: 0,
  pawn: 100,
  knight: 300,
  bishop: 325,
  rook: 500,
  queen: 900,
  king: 20000
};

// Example positional values (simple version)
export const POSITION_VAL = {
  pawn: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [1, -1, -2, 0, 0, -2, -1, 1],
    [5, 5, 5, -5, -5, 5, 5, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]
};
