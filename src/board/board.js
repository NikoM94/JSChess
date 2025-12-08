import { Tile } from "./tile.js";
import { ROWS, COLS, BOARD_PRESET } from "./constants.js";
import { Piece } from "../piece/piece.js";
// TODO: Refactor so all internal logic is updated, then board is rewdrawn from scratch after each move instead of mixing DOM manipulation and internal state updates
class Board {
  constructor() {
    this.tiles = [];
    this.pieces = [];
    this.currentTurn = "white";
    this.createBoard();
    this.drawBoard();
    this.moves = this.calculateAllMoves();
    this.selectedPiece = null;
    this.selectedMoves = [];
    this.receiverTiles = [];
  }

  getTile(x, y) {
    console.log(`Getting tile at (${x}, ${y})`);
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
    return moves;
  }

  addListeners() {
    const boardElement = document.querySelector(".game-container");
    boardElement.addEventListener("dragstart", this.dragStart.bind(this));
    boardElement.addEventListener("dragover", this.dragOver.bind(this));
    boardElement.addEventListener("dragleave", this.dragLeave.bind(this));
    boardElement.addEventListener("drop", this.drop.bind(this));
    boardElement.addEventListener("dragend", this.dragEnd.bind(this));
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
    // console.log(this.pieces);
    this.addListeners();
  }

  dragStart(event) {
    console.log("dragstart");
    event.target.classList.add("selected-piece");
    let pieceId = event.target.id;
    let pieceY = parseInt(pieceId.split("_")[0]);
    let pieceX = parseInt(pieceId.split("_")[1]);
    this.selectedPiece = this.getPiece(pieceX + 1, pieceY + 1);
    this.selectedMoves = this.selectedPiece.moves;
    let receiverTiles = [];
    this.selectedMoves.forEach((move) => {
      let tile = this.getTile(move.x, move.y);
      receiverTiles.push(tile);
    });
    receiverTiles.forEach((tile) => {
      let tileElement = document.getElementById(`tile_${tile.x}_${tile.y}`);
      tileElement.classList.add("receiver-tile");
    });
    this.receiverTiles = receiverTiles;
    console.log(this.receiverTiles);
    event.dataTransfer.setData("text/plain", event.target.id);
    setTimeout(() => {
      event.target.classList.add("hide");
    }, 0);
  }

  dragEnd(event) {
    console.log("dragend");
    event.target.classList.remove("hide");
    event.target.classList.remove("selected-piece");
  }

  dragOver(event) {
    event.preventDefault();
    event.target.classList.add("drag-over");
    console.log("dragover");
  }

  dragLeave(event) {
    event.target.classList.remove("drag-over");
    console.log("dragleave");
  }

  drop(event) {
    if (!event.target.classList.contains("receiver-tile")) return;
    const sourceId = event.dataTransfer.getData("text/plain");
    const [targetX, targetY] = [
      parseInt(event.target.id.split("_")[1]),
      parseInt(event.target.id.split("_")[2]),
    ];

    // Update internal game state only
    this.movePiece(sourceId, targetX, targetY);

    // DOM updates (can be moved elsewhere)
    event.target.firstChild?.remove();
    event.target.appendChild(document.getElementById(sourceId));
    event.target.classList.remove("drag-over");
    document.querySelectorAll(".receiver-tile").forEach((tile) => {
      tile.classList.remove("receiver-tile");
    });
  }

  movePiece(sourceId, targetX, targetY) {
    let movedPiece = this.getTile(
      parseInt(sourceId.split("_")[1]),
      parseInt(sourceId.split("_")[0]),
    ).getPiece();
    movedPiece.x = targetX;
    movedPiece.y = targetY;
    movedPiece.id = `${targetX}_${targetY}`;

    // Remove old piece from pieces array
    this.pieces = this.pieces.filter(
      (piece) => !(piece.x === movedPiece.x && piece.y === movedPiece.y),
    );

    // Add updated piece
    this.pieces.push(
      new Piece(
        movedPiece.type,
        movedPiece.color,
        `../../assets/${movedPiece.color}_${movedPiece.type}.svg`,
        targetX,
        targetY,
      ),
    );

    this.moves = this.calculateAllMoves();
    console.log(
      `this.pieces after drop: ${this.pieces}\nthis.moves after drop: ${this.moves}`,
    );
  }
}

export { Board };
