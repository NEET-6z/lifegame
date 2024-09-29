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
  name: "a4",
});

class StageA4Evaluator extends GameEvaluator {
  setgameInfo() {
    super.setgameInfo();
    this.gameInfo["complete"] = 0;

    if (this.board.getValueCount(2) < 15) {
      this.gameInfo["complete"] = -2;
    }
  }

  evaluateTurn() {
    if (this.cmis0() && this.gameInfo["turn"] >= 100) {
      this.gameInfo["complete"] = -1;
    }

    if (this.cmis0() && this.board.getValueCount(2) === 0) {
      this.gameInfo["complete"] = 1;
    }
    
    return super.evaluateTurn();
  }
}

const board = new RectangularBoard(7);
const stateManager = new StateManager(Life);
const gameEvaluator = new StageA4Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
