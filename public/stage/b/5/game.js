import { Config } from "../../../js/config/Config.js";
import { RectangularBoard } from "../../../js/core/board/RectangularBoard.js";
import GameManager from "../../../js/core/GameManager.js";
import { GameEvaluator } from "../../../js/core/stage/GameEvaluator.js";
import { checkStageAccess } from "../../../js/core/stage/stageAccess.js";
import { StateManager } from "../../../js/core/StateManager.js";

checkStageAccess();

const config = new Config({
  resize: false,
  editstate: false,
  mode: "stage",
  name: "a5",
});


class StageB5Evaluator extends GameEvaluator{
  setCustomInfo(){
    this.customInfo["turn"] = 0;
    this.customInfo["complete"] = 0;
    this.customInfo["startcount"] = this.board.getValueCount(2);
  }

  evaluateTurn(){
    let res = false;

    this.customInfo["turn"]++;


    if(this.cmis0() && this.customInfo["startcount"]*5 <= this.board.getValueCount(2)){
      this.customInfo["complete"] = 1;
      res = true;
    }

    this.updateInfo(this.customInfo);
    return res
  }
}





const board = new RectangularBoard(15);
const stateManager = new StateManager();
const gameEvaluator = new StageB5Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
