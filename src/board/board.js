import { Tile } from "./tile.js";
import { ROWS, COLS, BOARD_PRESET, COLORS, PRESETS, FEN_TYPES } from "./constants.js";
import { Piece } from "../piece/piece.js";
import { Player } from "../player/player.js";
import {
  validCoordinate,
  createPieceFromFENChar,
  validateChar,
  createEmptyTile,
} from "../utils/boardutils.js";
import { BoardLogger } from "../utils/logger.js";
// TODO: checkmate, stalemate, draw, move history,
// timers, undo/redo move, load from FEN/PGN
// Unit tests for board

export class Board {
  constructor(loadPosition = PRESETS.standard) {
    this.tiles = [];
    this.pieces = [];
    this.createBoard(loadPosition);
    this.drawBoard();
    this.selectedPiece = null;
    this.clickedTile = null;
    this.enPassantPawn = null;
    this.turn = COLORS.white;
    this.moves = this.calculateAllMoves();
    this.whitePlayer = new Player(this, COLORS["white"]);
    this.blackPlayer = new Player(this, COLORS["black"]);
    this.currentTurn = "white";
    this.currentPlayer = this.whitePlayer;
    this.capturedPieces = [];
    this.logger = new BoardLogger(this);
    this.logger.printBoard(this);
    this.turns = 0;
  }

  getTile(x, y) {
    return validCoordinate(x, y) ? this.tiles[x][y] : null;
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
    if (!targetElement.classList.contains("tile")) return;
    const [newX, newY] = [
      parseInt(targetElement.dataset.x),
      parseInt(targetElement.dataset.y),
    ];
    if (!this.selectedPiece && !this.clickedTile) {
      this.drawAvailableTiles(newX, newY);
    } else {
      if (!targetElement.classList.contains("receiver-tile")) {
        document.querySelectorAll(".receiver-tile").forEach((tile) => {
          tile.classList.remove("receiver-tile");
        });
        this.selectedPiece = null;
        this.clickedTile = null;
      } else {
        const [oldX, oldY] = [this.selectedPiece.x, this.selectedPiece.y];
        this.updateDOM(oldX, oldY, newX, newY);
        this.updateBoard(oldX, oldY, newX, newY);
      }
    }
  }

  drawAvailableTiles(x, y) {
    this.clickedTile = this.getTile(x, y);
    this.selectedPiece = this.clickedTile.getPiece();
    const selectedMoves = this.currentPlayer.moves.filter(
      (move) => move.fromTile.x === x && move.fromTile.y === y,
    );
    selectedMoves.forEach((move) => {
      const tileElement = document.getElementById(
        `tile_${move.toTile.x}_${move.toTile.y}`,
      );
      tileElement.classList.add("receiver-tile");
    });
  }

  updateDOM(oldX, oldY, x, y) {
    const newTileElement = document.getElementById(`tile_${x}_${y}`);
    newTileElement.style.backgroundImage = `url(${this.selectedPiece.imageSrc})`;
    newTileElement.dataset.pieceType = this.selectedPiece.type;
    newTileElement.dataset.pieceColor = this.selectedPiece.color;
    const oldTileElement = document.getElementById(`tile_${oldX}_${oldY}`);
    oldTileElement.style.backgroundImage = "";
    oldTileElement.dataset.pieceColor = "none";
    oldTileElement.dataset.pieceType = "none";
    document.querySelectorAll(".receiver-tile").forEach((tile) => {
      tile.classList.remove("receiver-tile");
    });
  }

  updateBoard(oldX, oldY, x, y) {
    const move = this.currentPlayer.moves.find((move) => {
      return (
        move.fromTile.x == oldX &&
        move.fromTile.y == oldY &&
        move.toTile.x == x &&
        move.toTile.y == y
      );
    });
    this.enPassantPawn = null;
    // TODO: promotion, castling
    switch (move.type) {
      case "normal":
        move.makeMove(this);
        break;
      case "doubleStep":
        move.makeMove(this);
        this.enPassantPawn = move.pieceMoved;
        break;
      case "attack":
        this.capturedPieces.push(move.pieceCaptured);
        move.makeMove(this);
        break;
      case "enPassant":
        const pieceCapturedElement = document.getElementById(
          `tile_${move.pieceCaptured.x}_${move.pieceCaptured.y}`,
        );
        pieceCapturedElement.style.backgroundImage = "";
        pieceCapturedElement.dataset.pieceType = "none";
        pieceCapturedElement.dataset.pieceColor = "none";
        this.capturedPieces.push(move.pieceCaptured);
        move.makeMove(this);
        break;
      case "castle":
        move.makeMove(this);
        const rookFromElement = document.getElementById(
          `tile_${move.castleRookFrom.x}_${move.castleRookFrom.y}`,
        );
        const rookToElement = document.getElementById(
          `tile_${move.castleRookTo.x}_${move.castleRookTo.y}`,
        );
        rookToElement.style.backgroundImage = `url(${move.rook.imageSrc})`;
        rookFromElement.style.backgroundImage = "";
        rookToElement.dataset.pieceType = move.rook.type;
        rookToElement.dataset.pieceColor = move.rook.color;
        rookFromElement.dataset.pieceType = "none";
        rookFromElement.dataset.pieceColor = "none";
        break;
    }
    this.nextTurn();
  }

  nextTurn() {
    this.receiverTiles = [];
    this.selectedPiece = null;
    this.moves = this.calculateAllMoves();
    this.currentTurn = this.currentTurn === "white" ? "black" : "white";
    this.currentPlayer =
      this.currentPlayer === this.whitePlayer
        ? this.blackPlayer
        : this.whitePlayer;
    this.whitePlayer.updatePlayer(this);
    this.blackPlayer.updatePlayer(this);
    this.selectedPiece = null;
    this.clickedTile = null;
    this.logger.printBoard(this);
  }

  createBoard(loadPosition) {
    for (let x = 0; x < 8; x++) {
      const row = [];
      for (let y = 0; y < 8; y++) {
        row.push(createEmptyTile(x, y));
      }
      this.tiles.push(row);
    }
    const splits = loadPosition.split(" ");
    const [rows, meta] = [splits[0].split("/"), splits.slice(1)];
    for (let x = 0; x < rows.length; x++) {
      for (let y = 0, yb = 0; y < rows[x].length; y++, yb++) {
        const char = rows[x][y];
        if (validateChar(char)) {
          const newPiece = createPieceFromFENChar(char, x, yb);
          console.log(newPiece);
          this.tiles[x][yb].setPiece(newPiece);
          this.pieces.push(newPiece);
        } else if (!isNaN(rows[x][y])) {
          const emptyCount = parseInt(rows[x][y]);
          yb += emptyCount - 1;
        }
      }
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
