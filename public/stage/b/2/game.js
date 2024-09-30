import { Config } from "../../../js/config/Config.js";
import { RectangularBoard } from "../../../js/core/board/RectangularBoard.js";
import { GameManager } from "../../../js/core/GameManager.js";
import { GameEvaluator } from "../../../js/core/stage/GameEvaluator.js";
import { checkStageAccess } from "../../../js/core/stage/stageAccess.js";
import { StateManager } from "../../../js/core/StateManager.js";
import { Life } from "../../../js/data/templates.js";

checkStageAccess();

const config = new Config({
  mode: "stage",
  name: "b2",
});

class StageB2Evaluator extends GameEvaluator {
  setgameInfo() {
    super.setgameInfo();;
    this.gameInfo["complete"] = 0;
  }

  evaluateTurn() {
    if (this.cmis0() && this.isblock()) {
      if (this.gameInfo["turn"] === 3) {
        this.gameInfo["complete"] = 1;
      } else {
        this.gameInfo["complete"] = -1;
      }
    }

    if (this.cmis0() && this.gameInfo["turn"] >= 3) {
      this.gameInfo["complete"] = -1;
    }

    super.evaluateTurn();
  }

  isblock() {
    let ac = 0;
    let hasblock = 0;
    for (let i = 0; i < this.board.size; i++) {
      for (let j = 0; j < this.board.getWsize(i); j++) {
        if (this.board.getCell(j, i) === 2) ac++;

        if (i != this.board.size - 1 && j != this.board.size - 1) {
          if (
            this.board.getCell(j, i) +
              this.board.getCell(j + 1, i) +
              this.board.getCell(j, i + 1) +
              this.board.getCell(j + 1, i + 1) === 8
          ) {
            hasblock = 1;
          }
        }
      }
    }
    return ac === 4 && hasblock;
  }
}

const board = new RectangularBoard(10);
const stateManager = new StateManager(Life);
const gameEvaluator = new StageB2Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
