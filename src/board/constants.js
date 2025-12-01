const ROWS = 8;
const COLS = 8;
const COLORS = {
  none: "none",
  white: "white",
  black: "black",
};
const PIECES = {
  none: "none",
  pawn: "pawn",
  rook: "rook",
  knight: "knight",
  bishop: "bishop",
  queen: "queen",
  king: "king",
};

const BOARD_PRESET = {
  standard: [
    [
      "rook_black",
      "knight_black",
      "bishop_black",
      "queen_black",
      "king_black",
      "bishop_black",
      "knight_black",
      "rook_black",
    ],
    [
      "pawn_black",
      "pawn_black",
      "pawn_black",
      "pawn_black",
      "pawn_black",
      "pawn_black",
      "pawn_black",
      "pawn_black",
    ],
    ["none", "none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none", "none"],
    [
      "pawn_white",
      "pawn_white",
      "pawn_white",
      "pawn_white",
      "pawn_white",
      "pawn_white",
      "pawn_white",
      "pawn_white",
    ],
    [
      "rook_white",
      "knight_white",
      "bishop_white",
      "queen_white",
      "king_white",
      "bishop_white",
      "knight_white",
      "rook_white",
    ],
  ],
};

export { ROWS, COLS, COLORS, PIECES, BOARD_PRESET };
