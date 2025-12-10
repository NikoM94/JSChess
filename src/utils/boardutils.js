import { FILES_WHITE, RANKS_WHITE } from "../board/constants.js";

export function xyToChessCoordinate(x, y) {
  return FILES_WHITE[y] + RANKS_WHITE[x];
}

export function validCoordinate(x, y) {
  return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}

export function chessCoordinateToXY(coordinate) {
  const file = coordinate.charAt(0);
  const rank = coordinate.charAt(1);
  const y = FILES_WHITE.indexOf(file);
  const x = RANKS_WHITE.indexOf(rank);
  return { x, y };
}
