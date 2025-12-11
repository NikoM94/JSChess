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

export function attacksOnTile(board, tile) {
  let attacks = 0;
  board.pieces.forEach((p) => {
    p.moves.forEach((move) => {
      if (move.x === tile.x && move.y === tile.y) {
        attacks++;
      }
    });
  });
  return attacks;
}

export function checkTurnAndSelectedPiece(board, targetElement) {
  return (
    targetElement.getAttribute("piece-color") !== board.currentTurn &&
    !board.selectedPiece
  );
}

export function hasMoves(selectedPiece, x, y) {
  return (
    selectedPiece &&
    selectedPiece.moves.some((move) => {
      return move.toTile.x === x && move.toTile.y === y;
    })
  );
}
