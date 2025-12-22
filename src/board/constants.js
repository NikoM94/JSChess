export const ROWS = 8;
export const COLS = 8;
export const COLORS = {
  none: "none",
  white: "white",
  black: "black",
};

export const FEN_TYPES = {
  p: "pawn",
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king",
};

export const PIECES = {
  none: "none",
  pawn: "pawn",
  rook: "rook",
  knight: "knight",
  bishop: "bishop",
  queen: "queen",
  king: "king",
};

export const PRESETS = {
  standard: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  test1: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  test2: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
  test3: "rnbq1bnr/pppp1kpp/4pp2/8/2P1P1Q1/3B4/PP1P1PPP/RNB1K1NR b KQ - 3 4",
  promotion: "8/1P1P1P1P/2P5/8/k6K/8/p1p1ppp1/8 w - - 0 1",
}

export const FILES_BLACK = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const RANKS_BLACK = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const FILES_WHITE = ["h", "g", "f", "e", "d", "c", "b", "a"];
export const RANKS_WHITE = ["8", "7", "6", "5", "4", "3", "2", "1"];

export const BOARD_PRESET = {
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

export const ROOK_MOVES = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

export const BISHOP_MOVES = [
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
];

export const KING_MOVES = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
];

export const KNIGHT_MOVES = [
  { x: -2, y: -1 },
  { x: -2, y: 1 },
  { x: -1, y: -2 },
  { x: -1, y: 2 },
  { x: 1, y: -2 },
  { x: 1, y: 2 },
  { x: 2, y: -1 },
  { x: 2, y: 1 },
];
