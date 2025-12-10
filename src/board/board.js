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
    boardElement.addEventListener("dragend", this.dragEnd.bind(this));
    boardElement.addEventListener("drop", this.drop.bind(this));
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

  dragStart(event) {
    event.target.classList.add("selected-piece");
    let pieceId = event.target.id;
    let pieceX = parseInt(pieceId.split("_")[0]);
    let pieceY = parseInt(pieceId.split("_")[1]);
    this.selectedPiece = this.getPiece(pieceX + 1, pieceY + 1);
    this.selectedMoves = this.selectedPiece.moves;
    let receiverTiles = [];
    this.selectedMoves.forEach((move) => {
      let tile = this.getTile(move.x, move.y);
      receiverTiles.push(tile);
    });
    console.log(`this.selectedmoves: ${this.selectedMoves}`);
    receiverTiles.forEach((tile) => {
      let tileElement = document.getElementById(`tile_${tile.x}_${tile.y}`);
      tileElement.classList.add("receiver-tile");
    });
    this.receiverTiles = receiverTiles;
    event.dataTransfer.setData("text/plain", event.target.id);
    setTimeout(() => {
      event.target.classList.add("hide");
    }, 0);
  }

  dragEnd(event) {
    event.target.classList.remove("hide");
    event.target.classList.remove("selected-piece");
    document.querySelectorAll(".receiver-tile").forEach((tile) => {
      tile.classList.remove("receiver-tile");
    });
    this.selectedMoves = [];
    this.receiverTiles = [];
    this.selectedPiece = null;
    this.moves = this.calculateAllMoves();
  }

  dragOver(event) {
    event.preventDefault();
    event.target.classList.add("drag-over");
  }

  dragLeave(event) {
    event.target.classList.remove("drag-over");
  }

  drop(event) {
    if (!event.target.classList.contains("receiver-tile")) return;
    const sourceId = event.dataTransfer.getData("text/plain");
    const [newX, newY] = [
      parseInt(event.target.id.split("_")[1]),
      parseInt(event.target.id.split("_")[2]),
    ];

    console.log(`new x y: ${newX}, ${newY}`);
    console.log(
      `selected piece: ${this.selectedPiece.type} at ${this.selectedPiece.x}, ${this.selectedPiece.y}`,
    );
    const oldX = this.selectedPiece.x;
    const oldY = this.selectedPiece.y;
    this.movePiece(sourceId, newX, newY, oldX, oldY);
    //debug print
    this.tiles.forEach((r) => {
      console.log(r);
    });

    event.target.firstChild.remove();
    event.target.appendChild(document.getElementById(sourceId));
    const newPieceId = event.target.id.split("_").slice(1).join("_");
    document.getElementById(sourceId).id = newPieceId;
    event.target.classList.remove("drag-over");
    document.querySelectorAll(".receiver-tile").forEach((tile) => {
      tile.classList.remove("receiver-tile");
    });
  }
  movePiece(sourceId, currentX, currentY, oldX, oldY) {
    // BUG: piece is not set to new tile in internal state
    // BUG: old tile is not removed, new tile is added to the end of the tile array
    // instead of appended to the correct position in the array
    // TODO: instead of removing and adding tiles and pieces, just update their properties

    //UPDATE OLD AND NEW TILE
    this.getTile(oldX, oldY).removePiece();
    this.getTile(currentX, currentY).setPiece(null);

    // ADD NEW TILE AND PIECE
    // let movedPiece = this.getTile(
    //   parseInt(sourceId.split("_")[1]),
    //   parseInt(sourceId.split("_")[0]),
    // ).getPiece();
    // movedPiece.x = currentX;
    // movedPiece.y = currentY;
    // movedPiece.id = `${currentX}_${currentY}`;

    this.selectedMoves = [];
    this.receiverTiles = [];
    this.selectedPiece = null;
    this.moves = this.calculateAllMoves();
  }
}

export { Board };
