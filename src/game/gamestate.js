import { boardToFEN } from "../utils/fen.js";

export class BoardStates {
  constructor(board) {
    // array of FEN strings representing board states
    this.states = [];
    // pointer to current state in states array
    this.currentStateIndex = 0;
    this.board = board;
  }

  storeState() {
    this.states.push(boardToFEN(this.board));
    this.currentStateIndex = this.states.length - 1;
  }

  getState(index) {
    if (index < 0 || index >= this.states.length) {
      throw new Error("Invalid state index");
    }
    return this.states[index];
  }

  setState(index) {
    if (index < 0 || index >= this.states.length) {
      throw new Error("Invalid state index");
    }
    this.currentStateIndex = index;
  }

  nextState() {
    if (this.currentStateIndex < this.states.length - 1) {
      this.currentStateIndex++;
      return this.states[this.currentStateIndex];
    }
    return null;
  }

  previousState() {
    if (this.currentStateIndex > 0) {
      this.currentStateIndex--;
      return this.states[this.currentStateIndex];
    }
    return null;
  }
}
