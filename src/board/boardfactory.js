import { Board } from "../board/board.js";
import { Piece } from "../piece/piece.js";
import { Tile } from "../board/tile.js";
import { Player } from "../player/player.js";

export function copyBoard(board) {
  let newBoard = new Board();

  for (let x = 0; x < newBoard.tiles.length; x++) {
    for (let y = 0; y < newBoard[x].length; y++) {
      let oldTile = board.tiles[x][y];
      let oldPiece = oldTile.piece;

      if (oldPiece.type !== "none") {
        var newPiece = new Piece(
          oldPiece.type,
          oldPiece.color,
          oldPiece.imageSrc,
          oldPiece.x,
          oldPiece.y,
          oldPiece.isFirstMove,
        );
      } else {
        var newPiece = new Piece("none", "none", "", oldPiece.x, oldPiece.y);
      }
      newBoard.tiles[x][y] = new Tile(
        oldTile.x,
        oldTile.y,
        oldTile.color,
        newPiece,
      );
    }
  }

  let oldEnPassantPawn = board.enPassantPawn;
  let newEnPassantPawn = new Piece(
    oldEnPassantPawn.type,
    oldEnPassantPawn.color,
    oldEnPassantPawn.imageSrc,
    oldEnPassantPawn.x,
    oldEnPassantPawn.y,
    oldEnPassantPawn.isFirstMove,
  );

  board.enPassantPawn = newEnPassantPawn;
  newBoard.currentTurn = board.currentTurn;

  newBoard.moves = newBoard.calculateAllMoves();

  let newWhitePlayer = new Player(newBoard, "white");
  let newBlackPlayer = new Player(newBoard, "black");
  newBoard.whitePlayer = newWhitePlayer;
  newBoard.blackPlayer = newBlackPlayer;

  newBoard.currentPlayer =
    currentTurn === "white" ? newBoard.whitePlayer : newBoard.blackPlayer;
}
