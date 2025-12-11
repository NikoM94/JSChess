import { Tile } from "./tile.js";
import { ROWS, COLS, BOARD_PRESET, COLORS } from "./constants.js";
import { Piece } from "../piece/piece.js";
// TODO: check, checkmate, stalemate, draw, move history, timers, undo/redo, load from FEN/PGN
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
    boardElement.addEventListener("click", this.onClickTile.bind(this));
  }

  onClickTile(event) {
    const target = event.target;
    if (!target.classList.contains("tile")) return;
    // check turn
    if (
      target.getAttribute("piece-color") !== this.currentTurn &&
      !this.selectedPiece
    ) {
      return;
    }
    if (!this.selectedPiece && !this.clickedTile) {
      const x = parseInt(target.getAttribute("data-x"));
      const y = parseInt(target.getAttribute("data-y"));
      this.clickedTile = this.getTile(x, y);
      this.selectedPiece = this.clickedTile.getPiece();
      const moves = this.selectedPiece.moves;
      moves.forEach((move) => {
        const tileElement = document.getElementById(`tile_${move.x}_${move.y}`);
        tileElement.classList.add("receiver-tile");
      });
    } else {
      const x = parseInt(target.getAttribute("data-x"));
      const y = parseInt(target.getAttribute("data-y"));
      if (
        this.selectedPiece &&
        this.selectedPiece.moves.some((move) => move.x === x && move.y === y)
      ) {
        console.log(`this.selectedPiece: ${this.selectedPiece.imageSrc}`);
        const oldX = this.selectedPiece.x;
        const oldY = this.selectedPiece.y;
        const newTile = document.getElementById(`tile_${x}_${y}`);
        newTile.style.backgroundImage = `url(${this.selectedPiece.imageSrc})`;
        newTile.setAttribute("piece-type", this.selectedPiece.type);
        newTile.setAttribute("piece-color", this.selectedPiece.color);
        const oldTile = document.getElementById(
          `tile_${this.selectedPiece.x}_${this.selectedPiece.y}`,
        );
        oldTile.style.backgroundImage = "";
        this.movePiece(x, y, oldX, oldY);
      }
      document.querySelectorAll(".receiver-tile").forEach((tile) => {
        tile.classList.remove("receiver-tile");
      });
      this.selectedPiece = null;
      this.clickedTile = null;
    }
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

  movePiece(newX, newY, oldX, oldY) {
    // Find the piece to move
    let pieceToMove = this.pieces.find((p) => p.x === oldX && p.y === oldY);
    // Update old tile: set to empty piece object
    let oldTile = this.getTile(oldX, oldY);
    oldTile.piece = {
      x: oldX,
      y: oldY,
      id: `${oldX}_${oldY}`,
      type: "none",
      imageSrc: "",
      color: "none",
    };
    // Update new tile: assign reference to moved piece
    let newTile = this.getTile(newX, newY);
    if (!newTile.isEmpty()) {
      // Remove captured piece from pieces list
      this.pieces = this.pieces.filter((p) => {
        // TODO: remove en passant captured pawn
        !(p.x === newX && p.y === newY);
      });
    }
    // Update piece coordinates
    pieceToMove.x = newX;
    pieceToMove.y = newY;
    pieceToMove.id = `${newX}_${newY}`;
    if (pieceToMove.type === "pawn" && pieceToMove.isFirstMove) {
      // Handle en passant setup
      if (Math.abs(newX - oldX) === 2) {
        this.enPassantPawn = pieceToMove;
        console.log(`En Passant pawn at ${pieceToMove.x}, ${pieceToMove.y}`);
      } else {
        this.enPassantPawn = null;
      }
    } else {
      this.enPassantPawn = null;
    }
    pieceToMove.isFirstMove = false;
    newTile.piece = pieceToMove;
    // Reset board state for next move
    this.currentTurn = this.currentTurn === "white" ? "black" : "white";
    this.selectedMoves = [];
    this.selectedPiece.moves = [];
    this.receiverTiles = [];
    this.selectedPiece = null;
    this.turn = COLORS.white ? COLORS.black : COLORS.white;
    this.moves = this.calculateAllMoves();
  }
}

export { Board };
