import { Tile } from "./tile.js";
import { ROWS, COLS, BOARD_PRESET, COLORS } from "./constants.js";
import { Piece } from "../piece/piece.js";
import { Player } from "../player/player.js";
import {
  validCoordinate,
  hasMoves,
  checkTurnAndSelectedPiece,
} from "../utils/boardutils.js";
import { NormalMove, AttackMove, EnPassantMove } from "../move/move.js";
import { BoardLogger } from "../utils/logger.js";
// TODO: checkmate, stalemate, draw, move history(should be done in a separate game class
// and stored as FEN, can use this to set board state for undo/redo),
// timers, undo/redo, load from FEN/PGN
// TODO: Unit tests for board
class Board {
  constructor() {
    this.tiles = [];
    this.pieces = [];
    this.currentTurn = "white";
    this.createBoard();
    this.drawBoard();
    this.moves = this.calculateAllMoves();
    this.selectedPiece = null;
    this.clickedTile = null;
    this.enPassantPawn = null;
    this.turn = COLORS.white;
    this.whitePlayer = new Player(this, COLORS["white"]);
    this.blackPlayer = new Player(this, COLORS["black"]);
    this.capturedPieces = [];
    this.logger = new BoardLogger(this);
    this.logger.printBoard();
  }

  getTile(x, y) {
    if (validCoordinate(x, y)) {
      return this.tiles[x][y];
    } else {
      return null;
    }
  }

  getPiece(x, y) {
    const tile = this.getTile(x - 1, y - 1);
    return tile.piece;
  }

  calculateAllMoves() {
    let moves = [];
    this.pieces.forEach((piece) => {
      piece.calculateMoves(this);
      moves.push(...piece.moves);
    });
    return moves;
  }

  addListeners() {
    const boardElement = document.querySelector(".game-container");
    boardElement.addEventListener("click", this.onClickTile.bind(this));
  }

  onClickTile(event) {
    const targetElement = event.target;
    if (
      !targetElement.classList.contains("tile") ||
      checkTurnAndSelectedPiece(this, targetElement)
    )
      return;
    if (!this.selectedPiece && !this.clickedTile) {
      const [x, y] = [
        parseInt(targetElement.getAttribute("data-x")),
        parseInt(targetElement.getAttribute("data-y")),
      ];
      this.drawReceiverTiles(x, y);
    } else {
      const [x, y] = [
        parseInt(targetElement.getAttribute("data-x")),
        parseInt(targetElement.getAttribute("data-y")),
      ];
      if (hasMoves(this.selectedPiece, x, y)) {
        const [oldX, oldY] = [this.selectedPiece.x, this.selectedPiece.y];
        this.updateDOM(x, y);
        this.updateBoard(oldX, oldY, x, y);
      }
    }
  }

  drawReceiverTiles(x, y) {
    this.clickedTile = this.getTile(x, y);
    this.selectedPiece = this.clickedTile.getPiece();
    const moves = this.selectedPiece.moves;
    moves.forEach((move) => {
      const tileElement = document.getElementById(
        `tile_${move.toTile.x}_${move.toTile.y}`,
      );
      tileElement.classList.add("receiver-tile");
    });
  }

  updateDOM(x, y) {
    const newTileElement = document.getElementById(`tile_${x}_${y}`);
    newTileElement.style.backgroundImage = `url(${this.selectedPiece.imageSrc})`;
    newTileElement.setAttribute("piece-type", this.selectedPiece.type);
    newTileElement.setAttribute("piece-color", this.selectedPiece.color);
    const oldTileElement = document.getElementById(
      `tile_${this.selectedPiece.x}_${this.selectedPiece.y}`,
    );
    oldTileElement.style.backgroundImage = "";
    document.querySelectorAll(".receiver-tile").forEach((tile) => {
      tile.classList.remove("receiver-tile");
    });
  }

  updateBoard(oldX, oldY, x, y) {
    const move = this.moves.find((move) => {
      return (
        move.fromTile.x == oldX &&
        move.fromTile.y == oldY &&
        move.toTile.x == x &&
        move.toTile.y == y
      );
    });
    // let capturedPiece = null;
    switch (move.type) {
      case "normal":
        move.makeMove();
        break;
      case "attack":
        move.makeMove();
        break;
      case "en_passant":
        move.makeMove();
        break;
    }
    // if (capturedPiece) {
    //   this.capturedPieces.push(capturedPiece);
    // }
    this.resetBoard();
  }

  resetBoard() {
    this.currentTurn = this.currentTurn === "white" ? "black" : "white";
    this.receiverTiles = [];
    this.selectedPiece = null;
    this.turn = COLORS.white ? COLORS.black : COLORS.white;
    this.moves = this.calculateAllMoves();
    this.selectedPiece = null;
    this.clickedTile = null;
    this.logger.printBoard();
  }

  createBoard() {
    for (let i = 0; i < ROWS; i++) {
      let row = [];
      for (let j = 0; j < COLS; j++) {
        let color = (i + j + 2) % 2 === 0 ? "#E0D5EA" : "#957AB0";
        const pieceType = BOARD_PRESET.standard[i][j].split("_")[0];
        const pieceColor = BOARD_PRESET.standard[i][j].split("_")[1];
        if (pieceType === "none") {
          const piece = new Piece(pieceType, pieceColor, "", i, j);
          row.push(new Tile(i, j, color, piece));
        } else {
          const piece = new Piece(
            pieceType,
            pieceColor,
            `../../assets/${pieceColor}_${pieceType}.svg`,
            i,
            j,
          );
          row.push(new Tile(i, j, color, piece));
          this.pieces.push(piece);
        }
      }
      this.tiles.push(row);
    }
  }

  drawBoard() {
    const boardElement = document.querySelector(".game-container");
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const tileElement = this.tiles[i][j].drawTile();
        boardElement.appendChild(tileElement);
      }
    }
    this.addListeners();
  }
}

export { Board };
