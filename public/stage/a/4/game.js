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
  name: "a4",
});

class StageA3Evaluator extends GameEvaluator{
  setCustomInfo(){
    this.customInfo["turn"] = 0;
    this.customInfo["complete"] = 0;

    if(this.board.getValueCount(2)<10){
      this.customInfo['complete'] = -2;
    }
  }

  evaluateTurn(){
    let ch = false;

    this.customInfo["turn"]++;
    if(this.cmis0() && this.customInfo["turn"]>=100){
      this.customInfo["complete"] = -1;
    }
    
    if(this.cmis0() && this.board.getValueCount(2)===0){
      this.customInfo["complete"] = 1;
      ch = true;
    }
    this.updateInfo(this.customInfo);
    return ch
  }
}


const board = new RectangularBoard();
const stateManager = new StateManager();
const gameEvaluator = new StageA3Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
