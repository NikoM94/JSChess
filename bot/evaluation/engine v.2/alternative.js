import { PIECES_VAL, POSITION_VAL } from "./basic_val.js";

export function evaluateBoard(board, aiColor = "black") {
  let score = 0;

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const tile = board.getTile(x, y);
      const piece = tile?.piece;

      if (!piece) continue;

      const base = PIECES_VAL[piece.type];
      const posVal = POSITION_VAL[piece.type]?.[x]?.[y] || 0;

      const value = base + posVal;

      if (piece.color === aiColor) score += value;
      else score -= value;
    }
  }

  return score;
}


export function minimax(board, depth, alpha, beta, maximizingPlayer, aiColor) {
  if (depth === 0 || board.isGameOver()) {
    return evaluateBoard(board, aiColor);
  }

  const moves = board.generateMoves(maximizingPlayer ? aiColor : board.oppositeColor(aiColor));

  if (maximizingPlayer) {
    let maxEval = -Infinity;

    for (const move of moves) {
      board.makeMove(move);
      const eval = minimax(board, depth - 1, alpha, beta, false, aiColor);
      board.undoMove();

      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break;
    }

    return maxEval;
  }

  else {
    let minEval = Infinity;

    for (const move of moves) {
      board.makeMove(move);
      const eval = minimax(board, depth - 1, alpha, beta, true, aiColor);
      board.undoMove();

      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);eval
      if (beta <= alpha) break;
    }

    return minEval;
  }
}


export function bestMove(board, depth, aiColor = "black") {
  let best = null;
  let bestScore = -Infinity;

  const moves = board.generateMoves(aiColor);

  for (const move of moves) {
    board.makeMove(move);
    const score = minimax(board, depth - 1, -Infinity, Infinity, false, aiColor);
    board.undoMove();

    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }

  return best;
}
