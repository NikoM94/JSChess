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

  addListeners() {
    const tileElements = document.querySelectorAll(".tile");
    tileElements.forEach((tileElement) => {
      const type = tileElement.firstChild.dataset.type;
      if (tileElement.firstChild.dataset.type === "none") return;
      tileElement.addEventListener("click", (event) => {
        const x = parseInt(event.currentTarget.getAttribute("data-x"));
        const y = parseInt(event.currentTarget.getAttribute("data-y"));
        console.log(`${type} clicked at (${x}, ${y})`);
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
          const piece = new Piece(pieceType, pieceColor);
          row.push(new Tile(i, j, color, piece));
        } else {
          const piece = new Piece(
            pieceType,
            pieceColor,
            `../../assets/${pieceColor}_${pieceType}.svg`,
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
