import { Config } from "../../../js/config/Config.js";
import { RectangularBoard } from "../../../js/core/board/RectangularBoard.js";
import { GameManager } from "../../../js/core/GameManager.js";
import { GameEvaluator } from "../../../js/core/stage/GameEvaluator.js";
import { checkStageAccess } from "../../../js/core/stage/stageAccess.js";
import { StateManager } from "../../../js/core/StateManager.js";

import { Queue } from "../../../js/common/utils.js";
import { Life } from "../../../js/data/templates.js";

checkStageAccess();

const config = new Config({
  mode: "stage",
  name: "a3",
});

class StageA3Evaluator extends GameEvaluator {
  setgameInfo() {
    super.setgameInfo();
    this.gameInfo["complete"] = 0;
    this.gameInfo["period length"] = 1;

    this.history = new Array(10000000).fill(-1);
    this.queue = new Queue();
    const hash = this.hash();
    this.history[hash] = 0;
    this.queue.push(hash);
  }

  hash() {
    let base = this.gameManager.stateManager.getAllState().length;
    let mod = 10000000;
    let h = 0;
    for (let i = 0; i < this.gameManager.board.size; i++) {
      for (let j = 0; j < this.gameManager.board.getWsize(i); j++) {
        h = (h * base + this.gameManager.board.getCell(j, i)) % mod;
      }
    }

    return h;
  }

  evaluateTurn() {

    const hash = this.hash(this.gameManager.board.cells);
    if (this.history[hash] === -1) {
      this.history[hash] = this.gameInfo["turn"];
    }

    if (this.cmis0() && this.gameInfo["turn"] - this.history[hash] >= 2) {
      this.gameInfo["complete"] = 1;
      this.gameInfo["period length"] =
        this.gameInfo["turn"] - this.history[hash];
    }

    if (this.gameInfo["turn"] >= 20) {
      const p = this.queue.pop();
      if (this.gameInfo["turn"] - 20 >= this.history[p]) {
        this.history[p] = -1;
      }
    }
    this.history[hash] = this.gameInfo["turn"];
    this.queue.push(hash);

    super.evaluateTurn();
  }
}

const board = new RectangularBoard(10);
const stateManager = new StateManager(Life);
const gameEvaluator = new StageA3Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
