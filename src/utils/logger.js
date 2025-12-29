export class BoardLogger {
  constructor(board) {
    this.board = board;
    this.addListeners();
    this.logBoardState = true;
    this.logCurrentMoves = true;
    this.logOpponentMoves = true;
    this.logCapturedPieces = true;
    this.logEnPassantPawn = true;
    this.logChecks = true;
    this.logCheckmates = true;
    this.logTurn = true;
    this.logTurnCount = true;
  }

  addListeners() {
    const toggleBoardBox = document.querySelector("#show-board");
    toggleBoardBox.addEventListener("change", () => {
      this.logBoardState = toggleBoardBox.checked;
    });

    const toggleCurrentMovesBox = document.querySelector("#show-moves-current");
    toggleCurrentMovesBox.addEventListener("change", () => {
      this.logWhiteMoves = toggleCurrentMovesBox.checked;
    });

    const toggleOpponentMovesBox = document.querySelector("#show-moves-opponent");
    toggleOpponentMovesBox.addEventListener("change", () => {
      this.logOpponentMoves = toggleOpponentMovesBox.checked;
    });

    const toggleCapturedPiecesBox = document.querySelector("#show-captured-pieces");
    toggleCapturedPiecesBox.addEventListener("change", () => {
      this.logCapturedPieces = toggleCapturedPiecesBox.checked;
    });

    const toggleEnPassantPawnBox = document.querySelector("#show-enpassant-pawn");
    toggleEnPassantPawnBox.addEventListener("change", () => {
      this.logEnPassantPawn = toggleEnPassantPawnBox.checked;
    });

    const toggleChecksBox = document.querySelector("#show-checks");
    toggleChecksBox.addEventListener("change", () => {
      this.logChecks = toggleChecksBox.checked;
    });

    const toggleCheckmatesBox = document.querySelector("#show-checkmates");
    toggleCheckmatesBox.addEventListener("change", () => {
      this.logCheckmates = toggleCheckmatesBox.checked;
    });

    const toggleTurnBox = document.querySelector("#show-turn");
    toggleTurnBox.addEventListener("change", () => {
      this.logTurn = toggleTurnBox.checked;
    });

    const toggleTurnCountBox = document.querySelector("#show-turn-count");
    toggleTurnCountBox.addEventListener("change", () => {
      this.logTurnCount = toggleTurnCountBox.checked;
    });
  }

  toggleBoardState() {
    this.logBoardState = document.querySelector("#show-board").checked;
  }

  toggleCurrentMoves() {
    this.logCurrentMoves = document.querySelector("#show-moves-current").checked;
  }

  toggleOpponentMoves() {
    this.logOpponentMoves = document.querySelector("#show-moves-opponent").checked;
  }

  toggleCapturedPieces() {
    this.logCapturedPieces = document.querySelector("#show-captured-pieces").checked;
  }

  toggleEnPassantPawn() {
    this.logEnPassantPawn = document.querySelector("#show-enpassant-pawn").checked;
  }

  toggleChecks() {
    this.logChecks = document.querySelector("#show-checks").checked;
  }

  toggleCheckmates() {
    this.logCheckmates = document.querySelector("#show-checkmates").checked;
  }

  toggleTurn() {
    this.logTurn = document.querySelector("#show-turn").checked;
  }

  toggleTurnCount() {
    this.logTurnCount = document.querySelector("#show-turn-count").checked;
  }

  printBoard(board) {
    console.log("|-----------------Current Board State:-----------------|");
    for (let x = 0; x < 8; x++) {
      let row = "";
      for (let y = 0; y < 8; y++) {
        const tile = board.getTile(x, y);
        if (tile.isEmpty()) {
          row += "[    ] ";
        } else {
          const piece = tile.getPiece();
          const symbolType = piece.type === "knight" ? "N" : piece.type.charAt(0).toUpperCase();
          const symbol =
            piece.color.charAt(0).toUpperCase() +
            symbolType +
            piece.x +
            piece.y;
          row += `[${symbol}] `;
        }
      }
      console.log(row);
    }
    console.log("|------------------------------------------------------|");
  }

  printInfo(board) {
    if (this.logBoardState) {
      this.printBoard(board);
    };
    console.log(this.board.currentTurn + "'s turn");
    console.log("EnPassant pawn: ", board.enPassantPawn);
    if (this.board.currentPlayer.isInCheck) {
      console.log(`${this.board.currentTurn} is in check!`);
    }
    if (this.board.currentPlayer.isInCheckMate) {
      console.log(`${this.board.currentTurn} is in checkmate!`);
    }
    console.log("Moves for current player:");
    this.board.currentPlayer.moves.forEach((move) => {
      const from = move.fromTile;
      const to = move.toTile;
      console.log(
        `${move.type.toUpperCase()} by piece: ${move.fromTile.piece.color} ${move.fromTile.piece.type}: (${from.x},${from.y}) -> (${to.x},${to.y})`,
      );
    });
    console.log("Captured Pieces:");
    this.board.capturedPieces.forEach((piece) => {
      console.log(
        `${piece.color.charAt(0).toUpperCase() + piece.type.charAt(0).toUpperCase()}`,
      );
    });
    console.log("---------------------");
  }
}
