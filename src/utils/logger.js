export class BoardLogger {
  constructor(loggable) {
    this.loggable = loggable;
  }

  printBoard(board) {
    for (let x = 0; x < 8; x++) {
      let row = "";
      for (let y = 0; y < 8; y++) {
        const tile = board.getTile(x, y);
        if (tile.isEmpty()) {
          row += "[    ] ";
        } else {
          const piece = tile.getPiece();
          const symbol =
            piece.color.charAt(0).toUpperCase() +
            piece.type.charAt(0).toUpperCase() +
            piece.x +
            piece.y;
          row += `[${symbol}] `;
        }
      }
      console.log(row);
    }
    console.log(this.loggable.currentTurn + "'s turn");
    console.log("EnPassant pawn: ", board.enPassantPawn);
    console.log("Moves for current player:");
    this.loggable.currentPlayer.moves.forEach((move) => {
      const from = move.fromTile;
      const to = move.toTile;
      console.log(
        `${move.type.toUpperCase()} by piece: ${move.fromTile.piece.color} ${move.fromTile.piece.type}: (${from.x},${from.y}) -> (${to.x},${to.y})`,
      );
    });
    console.log("Captured Pieces:");
    this.loggable.capturedPieces.forEach((piece) => {
      console.log(
        `${piece.color.charAt(0).toUpperCase() + piece.type.charAt(0).toUpperCase()}`,
      );
    });
    console.log("---------------------");
  }
}
