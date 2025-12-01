import { Tile } from "./tile.js";
import { ROWS, COLS, BOARD_PRESET } from "./constants.js";
import { Piece } from "./piece.js";

class Board {
  constructor() {
    this.tiles = [];
    this.pieces = [];
  }

  getTile(x, y) {
    return this.tiles[y][x];
  }

  getPiece(x, y) {
    const tile = this.getTile(x, y);
    return tile.piece;
  }

  addListeners() {
    const tileElements = document.querySelectorAll(".tile");
    tileElements.forEach((tileElement) => {
      const firstChild = tileElement.firstChild;
      if (!firstChild) return;
      if (firstChild.dataset.type === "none") {
        tileElement.addEventListener("drop", (event) => {
          const id = event.dataTransfer.getData("text/plain");
          const draggable = document.getElementById(id);
          const target = event.currentTarget;
          const x = parseInt(target.getAttribute("data-x"));
          const y = parseInt(target.getAttribute("data-y"));
          target.appendChild(draggable);
          console.log(`Empty tile dropped on at (${x}, ${y})`);
        });
      }
      const type = firstChild.dataset.type;
      tileElement.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const x = parseInt(target.getAttribute("data-x"));
        const y = parseInt(target.getAttribute("data-y"));
        console.log(`${type} clicked at (${x}, ${y})`);
      });
      tileElement.addEventListener("dragstart", (event) => {
        const target = event.currentTarget;
        const x = parseInt(target.getAttribute("data-x"));
        const y = parseInt(target.getAttribute("data-y"));
        console.log(`${type} dragged from (${x}, ${y})`);
      });
    });
  }

  createBoard() {
    for (let i = 1; i <= ROWS; i++) {
      let row = [];
      for (let j = 1; j <= COLS; j++) {
        let color = (i + j) % 2 === 0 ? "#E0D5EA" : "#957AB0";
        const pieceType = BOARD_PRESET.standard[i - 1][j - 1].split("_")[0];
        const pieceColor = BOARD_PRESET.standard[i - 1][j - 1].split("_")[1];
        if (pieceType === "none") {
          const piece = new Piece(pieceType, pieceColor, i, j);
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
