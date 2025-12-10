function minimax(game, depth, alpha, beta, maximizingPlayer) {
  if (depth === 0 || game.game_over()) {
    const score = evaluateBoard(game);
    return maximizingPlayer ? score : -score;
  }

  const moves = game.moves({ verbose: true });

  if (maximizingPlayer) {
    let maxEval = -Infinity;

    for (const move of moves) {
      game.move(move);
      const score = minimax(game, depth - 1, alpha, beta, false);
      game.undo();

      maxEval = Math.max(maxEval, score);
      alpha = Math.max(alpha, score);

      if (beta <= alpha) break;
    }

    return maxEval;

  } else {
    let minEval = Infinity;

    for (const move of moves) {
      game.move(move);
      const score = minimax(game, depth - 1, alpha, beta, true);
      game.undo();

      minEval = Math.min(minEval, score);
      beta = Math.min(beta, score);

      if (beta <= alpha) break;
    }

    return minEval;
  }
}

function bestMove(game, depth) {
  let bestMove = null;
  let bestValue = -Infinity;
  const moves = game.moves({ verbose: true });

  for (const move of moves) {
    game.move(move);
    const score = minimax(game, depth - 1, -Infinity, Infinity, false);
    game.undo();

    if (score > bestValue) {
      bestValue = score;
      bestMove = move;
    }
  }

  return bestMove;
}
