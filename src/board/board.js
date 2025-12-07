import { Tile } from "./tile.js";
import { ROWS, COLS, BOARD_PRESET } from "./constants.js";
import { Piece } from "../piece/piece.js";
import { dragStart, dragEnd, dragOver, drop, dragLeave } from "./listeners.js";

class Board {
  constructor() {
    this.tiles = [];
    this.pieces = [];
    this.currentTurn = "white";
    this.createBoard();
    this.drawBoard();
    this.moves = this.calculateAllMoves();
  }

  getTile(x, y) {
    return this.tiles[x][y];
  }

  getPiece(x, y) {
    const tile = this.getTile(x - 1, y - 1);
    return tile.piece;
  }

  calculateAllMoves() {
    let moves = [];
    this.pieces.forEach((piece) => {
      piece.calculateMoves(this);
      piece.moves.forEach((move) => {
        moves.push({ piece: piece, move: move });
      });
    });
    this.moves = moves;
    console.log(this.moves);
  }

  addListeners() {
    const tileElements = document.querySelectorAll(".tile");
    tileElements.forEach((tileElement) => {
      tileElement.addEventListener("dragstart", dragStart);
      tileElement.addEventListener("dragend", dragEnd);
      tileElement.addEventListener("dragover", dragOver);
      tileElement.addEventListener("dragleave", dragLeave);
      tileElement.addEventListener("drop", drop);
    });
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
