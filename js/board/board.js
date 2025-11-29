import { Tile } from "./tile.js";
import { ROWS, COLS } from "./constants.js";

class Board {
  constructor() {
    this.tiles = [];
  }

  getTile(x, y) {
    return this.tiles[y][x];
  }

  createBoard() {
    console.log("Creating board...");
    for (let i = 0; i < ROWS; i++) {
      let row = [];
      for (let j = 0; j < COLS; j++) {
        let color = (i + j) % 2 === 0 ? "white" : "black";
        row.push(new Tile(i, j, color));
        console.log(`Created tile at (${i}, ${j}) with color ${color}`);
      }
      this.tiles.push(row);
    }
  }

  drawBoard() {
    console.log("Drawing board...");
    console.log(this.tiles);
    const boardElement = document.querySelector(".game-container");
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const tileElement = this.tiles[i][j].drawTile();
        boardElement.appendChild(tileElement);
        console.log(`Drew tile at (${i}, ${j})`);
      }
    }
  }
}

export { Board };
