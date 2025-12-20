import { Board } from "../src/board/board.js";
import assert from "assert";

describe("Board", function () {
  describe("#constructor()", function () {
    it("should create an 8x8 board", function () {
      const board = new Board();
      assert.equal(board.tiles.length, 8);
      assert.equal(board.tiles[0].length, 8);
    });
  });
});
