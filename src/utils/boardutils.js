import { FILES_WHITE, RANKS_WHITE } from "./constants.js";

export function xyToChessCoordinate(x, y) {
  return FILES_WHITE[y] + RANKS_WHITE[x];
}
