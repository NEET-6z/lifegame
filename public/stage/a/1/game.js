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
  name: "a1",
});

class StageA1Evaluator extends GameEvaluator {
  constructor() {
    super();
  }

  setgameInfo() {
    super.setgameInfo();

    this.gameInfo["complete"] = 0;
    this.preBoard = JSON.parse(JSON.stringify(this.gameManager.board.cells));
  }
  evaluateTurn() {
    if (
      this.cmis0() &&
      JSON.stringify(this.preBoard) ==
        JSON.stringify(this.gameManager.board.cells)
    ) {
      this.gameInfo["complete"] = -1;
    }

    if (this.cmis0() && this.gameInfo["turn"] >= 10) {
      this.gameInfo["complete"] = 1;
    }

    this.preBoard = JSON.parse(JSON.stringify(this.gameManager.board.cells));

    super.evaluateTurn();
  }
}

const gameEvaluator = new StageA1Evaluator();

const board = new RectangularBoard(10);
const stateManager = new StateManager(Life);
const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
