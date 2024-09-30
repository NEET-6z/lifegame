import { Array2 } from "../../../js/common/utils.js";
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
  name: "b4",
});

class StageB4Evaluator extends GameEvaluator {
  setgameInfo() {
    super.setgameInfo();;
    this.gameInfo["complete"] = 0;
    this.preBoard = JSON.parse(JSON.stringify(this.gameManager.board.cells));
  }

  evaluateTurn() {

    if (this.cmis0() && this.gameInfo["turn"] === 1) {
      if (
        JSON.stringify(this.preBoard) ==
        JSON.stringify(this.gameManager.board.cells)
      ) {
        this.gameInfo["complete"] = 1;
      } else {
        this.gameInfo["complete"] = -1;
      }
    }

    this.preBoard = JSON.parse(JSON.stringify(this.gameManager.board.cells));

    super.evaluateTurn();
  }
}

let defaultCells = Array2(20,20,1);
let lockedCells = Array2(20,20,0);

defaultCells[8][8] = 2;
defaultCells[8][9] = 2;
defaultCells[8][10] = 2;
defaultCells[8][11] = 2;
defaultCells[9][11] = 2;
defaultCells[10][11] = 2;
defaultCells[11][11] = 2;
defaultCells[11][10] = 2;
defaultCells[11][9] = 2;
defaultCells[11][8] = 2;
defaultCells[10][8] = 2;
defaultCells[9][8] = 2;

lockedCells[8][8] = 2;
lockedCells[8][9] = 2;
lockedCells[8][10] = 2;
lockedCells[8][11] = 2;
lockedCells[9][11] = 2;
lockedCells[10][11] = 2;
lockedCells[11][11] = 2;
lockedCells[11][10] = 2;
lockedCells[11][9] = 2;
lockedCells[11][8] = 2;
lockedCells[10][8] = 2;
lockedCells[9][8] = 2;

const board = new RectangularBoard(20, defaultCells, lockedCells);
const stateManager = new StateManager(Life);
const gameEvaluator = new StageB4Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
