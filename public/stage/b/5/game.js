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
  name: "b5",
});

class StageB5Evaluator extends GameEvaluator {
  setgameInfo() {
    this.gameInfo["turn"] = 0;
    this.gameInfo["complete"] = 0;
    this.gameInfo["startcount"] = this.board.getValueCount(2);
  }

  evaluateTurn() {
    let res = false;

    this.gameInfo["turn"]++;

    if (
      this.cmis0() &&
      this.gameInfo["startcount"] * 5 <= this.board.getValueCount(2)
    ) {
      this.gameInfo["complete"] = 1;
      res = true;
    }

    this.updateInfo(this.gameInfo);
    return res;
  }
}

const board = new RectangularBoard(15);
const stateManager = new StateManager(Life);
const gameEvaluator = new StageB5Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
