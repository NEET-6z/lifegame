import { Config } from "../../../js/config/Config.js";
import { RectangularBoard } from "../../../js/core/board/RectangularBoard.js";
import { GameManager } from "../../../js/core/GameManager.js";
import { GameEvaluator } from "../../../js/core/stage/GameEvaluator.js";
import { checkStageAccess } from "../../../js/core/stage/stageAccess.js";
import { StateManager } from "../../../js/core/StateManager.js";
import { Life } from "../../../js/data/rule.js";

checkStageAccess();

const config = new Config({
  resize: false,
  editstate: false,
  mode: "stage",
  name: "a4",
});


class StageB4Evaluator extends GameEvaluator{
  setCustomInfo(){
    this.customInfo["turn"] = 0;
    this.customInfo["complete"] = 0;
  }

  evaluateTurn(){
    let res = false;

    this.customInfo["turn"]++;

    if(this.cmis0() && this.board.getValueCount(2)==0){
      if(this.customInfo["turn"]==5){
        this.customInfo["complete"] = 1;
        res = true;
      }
      else{
        this.customInfo["complete"] = -1;
      }
    }

    if(this.cmis0() && this.customInfo["turn"]>=5){
      this.customInfo["complete"] = -1;
    }
    
    
    this.preBoard = JSON.parse(JSON.stringify(this.gameManager.board.cells));
    
    this.updateInfo(this.customInfo);
    return res
  }
}



const board = new RectangularBoard();
const stateManager = new StateManager(Life);
const gameEvaluator = new StageB4Evaluator();

const gameManager = new GameManager(board, stateManager, gameEvaluator, config);
