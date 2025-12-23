import { Tile } from "./tile.js";
import {
  ROWS,
  COLS,
  BOARD_PRESET,
  COLORS,
  PRESETS,
  FEN_TYPES,
} from "./constants.js";
import { Piece } from "../piece/piece.js";
import { Player } from "../player/player.js";
import {
  validCoordinate,
  createPieceFromFENChar,
  validateChar,
  createEmptyTile,
} from "../utils/boardutils.js";
import { BoardLogger } from "../utils/logger.js";

export class Board {
  constructor() {
    this.tiles = [];
    this.pieces = [];
    this.createStartingPosition();
    this.selectedPiece = null;
    this.clickedTile = null;
    this.enPassantPawn = null;
    this.moves = this.calculateAllMoves();
    this.whitePlayer = new Player(this, COLORS["white"]);
    this.blackPlayer = new Player(this, COLORS["black"]);
    this.currentTurn = "white";
    this.currentPlayer = this.whitePlayer;
    this.capturedPieces = [];
    this.logger = new BoardLogger(this);
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
    const fenButton = document.getElementById("load-fen-button");
    fenButton.addEventListener("click", () => {
      const fenInput = document.getElementById("fen-input").value;
      this.loadPositionFromFEN(fenInput);
      boardElement.innerHTML = "";
      this.moves = this.calculateAllMoves();
      this.whitePlayer.updatePlayer(this);
      this.blackPlayer.updatePlayer(this);
      this.capturedPieces = [];
      this.drawBoard();
      this.logger.printBoard(this);
    });
  }

  onClickTile(event) {
    console.log("Tile clicked");
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
    const move = this.currentPlayer.moves.find((move) => {
      return (
        move.fromTile.x == oldX &&
        move.fromTile.y == oldY &&
        move.toTile.x == x &&
        move.toTile.y == y
      );
    });
    const newTileElement = document.getElementById(`tile_${x}_${y}`);
    if (move.type === "promotion") {
      newTileElement.style.backgroundImage = `url(../../assets/${move.pieceMoved.color}_queen.svg)`;
      newTileElement.dataset.pieceType = "queen";
      newTileElement.dataset.pieceColor = move.pieceMoved.color;
    } else {
      newTileElement.style.backgroundImage = `url(${this.selectedPiece.imageSrc})`;
      newTileElement.dataset.pieceType = this.selectedPiece.type;
      newTileElement.dataset.pieceColor = this.selectedPiece.color;
    }
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
      case "promotion":
        if (move.pieceCaptured) {
          this.capturedPieces.push(move.pieceCaptured);
        }
        move.makeMove(this);
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

  createStartingPosition() {
    this.loadPositionFromFEN(PRESETS.standard);
  }

  loadPositionFromFEN(fen) {
    this.tiles = [];
    this.pieces = [];
    for (let x = 0; x < 8; x++) {
      const row = [];
      for (let y = 0; y < 8; y++) {
        row.push(createEmptyTile(x, y));
      }
      this.tiles.push(row);
    }

    const splits = fen.split(" ");
    const [rows, meta] = [splits[0].split("/"), splits.slice(1)];

    for (let i = 0; i < rows.length; i++) {
      for (let j = 0, y = 0; j < rows[i].length; j++, y++) {
        const char = rows[i][j];
        if (validateChar(char)) {
          const newPiece = createPieceFromFENChar(char, i, y);
          this.tiles[i][y].setPiece(newPiece);
          this.pieces.push(newPiece);
        } else if (!isNaN(rows[i][j])) {
          const emptyCount = parseInt(rows[i][j]);
          y += emptyCount - 1;
        }
      }
    }

    const turn = meta[0];
    this.currentTurn = turn === "w" ? "white" : "black";

    const castlingRights = Array.from(meta[1]);
    if (!castlingRights.includes("K")) {
      this.whitePlayer.canCastleKingSide = false;
    }
    if (!castlingRights.includes("Q")) {
      this.whitePlayer.canCastleQueenSide = false;
    }
    if (!castlingRights.includes("k")) {
      this.blackPlayer.canCastleKingSide = false;
    }
    if (!castlingRights.includes("q")) {
      this.blackPlayer.canCastleQueenSide = false;
    }

    const enPassantTarget = meta[2];

    if (enPassantTarget !== "-") {
      const file = enPassantTarget.charCodeAt(0) - "a".charCodeAt(0);
      const rank = 8 - parseInt(enPassantTarget[1]);
      const enPassantTile = this.getTile(rank, file);
      const enPassantPiece = enPassantTile.getPiece();
      this.enPassantPawn = enPassantPiece;
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
  }

  getCopy() {
    return structuredClone(this);
  }
}
